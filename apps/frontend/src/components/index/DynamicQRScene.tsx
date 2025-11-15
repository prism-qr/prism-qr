"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";

interface QRDot {
  id: string;
  x: number;
  y: number;
  active: boolean;
  transitioning: boolean;
}

export function DynamicQRScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrDots, setQrDots] = useState<QRDot[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const gridSize = 21;
  const dotSize = 8;
  const gap = 2;

  useEffect(() => {
    const generateQRPattern = (): QRDot[] => {
      const dots: QRDot[] = [];
      for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
          const isFinderPattern =
            (x < 7 && y < 7) ||
            (x >= gridSize - 7 && y < 7) ||
            (x < 7 && y >= gridSize - 7);

          const isFinderCorner =
            isFinderPattern &&
            ((x >= 2 && x <= 4 && y >= 2 && y <= 4) ||
              (x >= gridSize - 5 && x <= gridSize - 3 && y >= 2 && y <= 4) ||
              (x >= 2 && x <= 4 && y >= gridSize - 5 && y <= gridSize - 3));

          const randomActive = Math.random() > 0.5;

          dots.push({
            id: `${x}-${y}`,
            x,
            y,
            active: isFinderPattern ? !isFinderCorner : randomActive,
            transitioning: false,
          });
        }
      }
      return dots;
    };

    setQrDots(generateQRPattern());

    const morphInterval = setInterval(() => {
      setQrDots((prevDots) => {
        const newDots = [...prevDots];
        const dotsToChange = Math.floor(gridSize * gridSize * 0.15);

        for (let i = 0; i < dotsToChange; i++) {
          const randomIndex = Math.floor(
            Math.random() * (gridSize * gridSize)
          );
          const dot = newDots[randomIndex];

          const isFinderPattern =
            (dot.x < 7 && dot.y < 7) ||
            (dot.x >= gridSize - 7 && dot.y < 7) ||
            (dot.x < 7 && dot.y >= gridSize - 7);

          if (!isFinderPattern) {
            newDots[randomIndex] = {
              ...dot,
              active: !dot.active,
              transitioning: true,
            };
          }
        }

        return newDots;
      });
    }, 2000);

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
    const padding = 40;
    const baseCanvasSize = qrCodeSize + padding * 2;
    
    const maxWidth = Math.min(window.innerWidth - 64, 500);
    const canvasSize = Math.min(baseCanvasSize, maxWidth);
    const scale = canvasSize / baseCanvasSize;

    canvas.width = canvasSize * dpr;
    canvas.height = canvasSize * dpr;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    ctx.scale(dpr * scale, dpr * scale);

    let scanLineY = 0;
    let scanDirection = 1;

    const animate = () => {
      ctx.clearRect(0, 0, baseCanvasSize, baseCanvasSize);

      ctx.fillStyle = "rgba(255, 255, 255, 0.03)";
      ctx.fillRect(
        padding - 10,
        padding - 10,
        qrCodeSize + 20,
        qrCodeSize + 20
      );

      ctx.strokeStyle = "rgba(139, 92, 246, 0.3)";
      ctx.lineWidth = 2;
      ctx.strokeRect(
        padding - 10,
        padding - 10,
        qrCodeSize + 20,
        qrCodeSize + 20
      );

      qrDots.forEach((dot) => {
        const x = padding + dot.x * cellSize;
        const y = padding + dot.y * cellSize;

        if (dot.active) {
          const gradient = ctx.createRadialGradient(
            x + dotSize / 2,
            y + dotSize / 2,
            0,
            x + dotSize / 2,
            y + dotSize / 2,
            dotSize / 2
          );

          const isScanningArea = Math.abs(y - scanLineY) < 30;

          if (isScanningArea) {
            gradient.addColorStop(0, "rgba(139, 92, 246, 1)");
            gradient.addColorStop(1, "rgba(139, 92, 246, 0.6)");
          } else {
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.95)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0.7)");
          }

          ctx.fillStyle = gradient;
          ctx.fillRect(x, y, dotSize, dotSize);
        } else {
          ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
          ctx.fillRect(x, y, dotSize, dotSize);
        }
      });

      const scanGradient = ctx.createLinearGradient(
        0,
        scanLineY - 20,
        0,
        scanLineY + 20
      );
      scanGradient.addColorStop(0, "rgba(139, 92, 246, 0)");
      scanGradient.addColorStop(0.5, "rgba(139, 92, 246, 0.4)");
      scanGradient.addColorStop(1, "rgba(139, 92, 246, 0)");

      ctx.fillStyle = scanGradient;
      ctx.fillRect(padding - 30, scanLineY - 20, qrCodeSize + 60, 40);

      scanLineY += scanDirection * 2;
      if (scanLineY > padding + qrCodeSize + 10) {
        scanDirection = -1;
      } else if (scanLineY < padding - 10) {
        scanDirection = 1;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [qrDots]);

  return (
    <div className="flex items-center justify-center w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="relative"
      >
        <div className="absolute -inset-20 bg-gradient-to-r from-purple-500/20 via-blue-500/20 to-cyan-500/20 blur-3xl opacity-60 animate-pulse" />

        <canvas
          ref={canvasRef}
          className="relative z-10"
          style={{
            filter: "drop-shadow(0 0 30px rgba(139, 92, 246, 0.3))",
          }}
        />
      </motion.div>
    </div>
  );
}
