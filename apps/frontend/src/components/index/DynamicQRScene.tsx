"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface QRDot {
  id: string;
  x: number;
  y: number;
  active: boolean;
  transitioning: boolean;
  opacity: number;
}

export function DynamicQRScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDots, setQrDots] = useState<QRDot[]>([]);
  const qrDotsRef = useRef<QRDot[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // High density for "data stream" look
  const gridSize = 60;
  const dotSize = 2.5;
  const gap = 2;

  useEffect(() => {
    const generateQRPattern = (): QRDot[] => {
      const dots: QRDot[] = [];
      const center = Math.floor(gridSize / 2);

      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          // Finder patterns (corners) - larger safe zones
          const isFinderPattern =
            (x < 12 && y < 12) ||
            (x >= gridSize - 12 && y < 12) ||
            (x < 12 && y >= gridSize - 12);

          const isFinderCorner =
            isFinderPattern &&
            ((x >= 2 && x <= 9 && y >= 2 && y <= 9) ||
              (x >= gridSize - 10 && x <= gridSize - 3 && y >= 2 && y <= 9) ||
              (x >= 2 && x <= 9 && y >= gridSize - 10 && y <= gridSize - 3));

          // Circular density falloff
          const distFromCenter = Math.sqrt(Math.pow(x - center, 2) + Math.pow(y - center, 2));
          const maxDist = Math.sqrt(Math.pow(center, 2) + Math.pow(center, 2));
          const density = 0.55 - (distFromCenter / maxDist) * 0.5;

          const randomActive = Math.random() < density;

          dots.push({
            id: `${x}-${y}`,
            x,
            y,
            active: isFinderPattern ? !isFinderCorner : randomActive,
            transitioning: false,
            opacity: Math.random() * 0.5 + 0.2,
          });
        }
      }
      return dots;
    };

    const initialDots = generateQRPattern();
    setQrDots(initialDots);
    qrDotsRef.current = initialDots;

    // Fast but subtle morphing
    const morphInterval = setInterval(() => {
      setQrDots((prevDots) => {
        const newDots = [...prevDots];
        // Change very few dots per tick
        const dotsToChange = Math.floor(gridSize * gridSize * 0.005);

        for (let i = 0; i < dotsToChange; i++) {
          const randomIndex = Math.floor(
            Math.random() * (gridSize * gridSize)
          );
          const dot = newDots[randomIndex];

          const isFinderPattern =
            (dot.x < 12 && dot.y < 12) ||
            (dot.x >= gridSize - 12 && dot.y < 12) ||
            (dot.x < 12 && dot.y >= gridSize - 12);

          if (!isFinderPattern) {
            if (Math.random() > 0.5) {
              newDots[randomIndex] = {
                ...dot,
                active: !dot.active,
                transitioning: true,
                opacity: 0,
              };
            }
          }
        }

        qrDotsRef.current = newDots;
        return newDots;
      });
    }, 500); // Slower updates (was 100)

    return () => clearInterval(morphInterval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cellSize = dotSize + gap;
    const qrCodeSize = gridSize * cellSize;
    const padding = 80; // Large padding for soft fade
    const baseCanvasSize = qrCodeSize + padding * 2;

    // Reduced max width for better layout fit
    const maxWidth = Math.min(window.innerWidth - 40, 380);
    const canvasSize = Math.min(baseCanvasSize, maxWidth);
    const scale = canvasSize / baseCanvasSize;

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    ctx.scale(dpr * scale, dpr * scale);

    let scanLineY = padding;
    let velocity = 1; // Slower scan (was 2)
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, baseCanvasSize, baseCanvasSize);

      // Center glow (Brighter)
      const bgGradient = ctx.createRadialGradient(
        baseCanvasSize / 2, baseCanvasSize / 2, 0,
        baseCanvasSize / 2, baseCanvasSize / 2, baseCanvasSize / 2
      );
      bgGradient.addColorStop(0, "rgba(139, 92, 246, 0.2)"); // Increased from 0.1
      bgGradient.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, baseCanvasSize, baseCanvasSize);

      // Draw dots
      qrDotsRef.current.forEach((dot) => {
        const x = padding + dot.x * cellSize;
        const y = padding + dot.y * cellSize;

        // Fade in effect for transitioning dots
        if (dot.transitioning && dot.opacity < 1) {
          dot.opacity += 0.1;
        }

        if (dot.active) {
          const distToScanLine = Math.abs(y - scanLineY);
          const isScanningArea = distToScanLine < 60;

          // Brighter base opacity
          let alpha = dot.opacity * 0.6; // Increased from 0.4
          let color = "139, 92, 246"; // Violet base

          if (isScanningArea) {
            const intensity = 1 - (distToScanLine / 60);
            alpha = 0.6 + (intensity * 0.4); // Brighter scan area
            // Shift to Cyan/White near scan line
            if (intensity > 0.8) color = "255, 255, 255";
            else if (intensity > 0.5) color = "6, 182, 212"; // Cyan
          }

          // Subtle breathing
          const pulse = Math.sin(time + dot.x * 0.2 + dot.y * 0.2) * 0.1;
          alpha += pulse;

          // Radial fade mask
          const centerX = baseCanvasSize / 2;
          const centerY = baseCanvasSize / 2;
          const distFromCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
          const maxDist = qrCodeSize / 1.4;
          const mask = Math.max(0, 1 - Math.pow(distFromCenter / maxDist, 3));

          alpha *= mask;

          if (alpha > 0.01) {
            ctx.fillStyle = `rgba(${color}, ${alpha})`;
            ctx.beginPath();
            ctx.arc(x + dotSize / 2, y + dotSize / 2, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
          }

        } else {
          // No inactive dots for cleaner look
        }
      });

      // Scan Line (Reverted to linear style) - Brighter
      const scanGradient = ctx.createLinearGradient(
        0, scanLineY - 40,
        0, scanLineY + 10
      );
      scanGradient.addColorStop(0, "rgba(139, 92, 246, 0)");
      scanGradient.addColorStop(0.8, "rgba(139, 92, 246, 0.4)"); // Increased from 0.2
      scanGradient.addColorStop(1, "rgba(168, 85, 247, 0.9)"); // Increased from 0.6

      ctx.fillStyle = scanGradient;
      ctx.fillRect(padding - 20, scanLineY - 40, qrCodeSize + 40, 50);

      // Thin bright line at the bottom of the scan
      ctx.fillStyle = "rgba(232, 121, 249, 0.5)"; // Pinkish highlight
      ctx.fillRect(padding - 20, scanLineY + 8, qrCodeSize + 40, 2);

      scanLineY += velocity;

      if (scanLineY >= padding + qrCodeSize + 20) {
        scanLineY = padding + qrCodeSize + 20;
        velocity = -Math.abs(velocity);
      } else if (scanLineY <= padding - 20) {
        scanLineY = padding - 20;
        velocity = Math.abs(velocity);
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute -inset-20 bg-violet-500/5 blur-[100px] rounded-full" />
        <canvas
          ref={canvasRef}
          className="relative z-10"
        />
      </motion.div>
    </div>
  );
}
