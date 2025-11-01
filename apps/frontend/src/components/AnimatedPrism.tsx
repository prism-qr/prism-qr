"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  originalVx: number;
  originalVy: number;
  size: number;
  baseSize: number;
  color: string;
  type: "prism" | "beam" | "rainbow";
  rainbowColor?: string;
}

export default function AnimatedPrism() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const timeRef = useRef<number>(0);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: -1, y: -1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let centerX = canvas.width / 2;
    let centerY = canvas.height / 2;
    let prismSize = Math.min(canvas.width, canvas.height) * 0.25;
    const colors = ["#ff0000", "#ff7700", "#ffcc00", "#00ff00", "#00ccff", "#0066ff", "#7700ff"];

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      centerX = canvas.width / 2;
      centerY = canvas.height / 2;
      prismSize = Math.min(canvas.width, canvas.height) * 0.3;
    };

    resize();
    window.addEventListener("resize", resize);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePosRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1, y: -1 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const createPrismParticles = (): Particle[] => {
      const particles: Particle[] = [];
      const triangleHeight = prismSize * 0.8;
      const triangleWidth = prismSize * 1.1;
      const density = 4;
      
      const createEdgeParticles = (startX: number, startY: number, endX: number, endY: number, count: number) => {
        const edgeParticles: Particle[] = [];
        for (let i = 0; i < count; i++) {
          const progress = i / count;
          const x = startX + (endX - startX) * progress;
          const y = startY + (endY - startY) * progress;
          const baseSize = 2 + Math.random() * 1.5;
          edgeParticles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 0.15,
            vy: (Math.random() - 0.5) * 0.15,
            size: baseSize,
            baseSize,
            color: "rgba(255, 255, 255, 0.8)",
            type: "prism",
          });
        }
        return edgeParticles;
      };

      const depth = prismSize * 0.15;
      const perspective = 0.3;
      const triangleTopY = centerY - triangleHeight / 2;
      const triangleBottomY = centerY + triangleHeight / 2;
      const triangleLeftX = centerX - triangleWidth / 2;
      const triangleRightX = centerX + triangleWidth / 2;
      
      const backLeftX = triangleLeftX - depth * 0.5;
      const backRightX = triangleRightX - depth * 0.5;
      const backBottomY = triangleBottomY + depth * perspective;

      const leftEdgeParticles = Math.floor(triangleHeight / density);
      const rightEdgeParticles = Math.floor(triangleHeight / density);
      const bottomEdgeParticles = Math.floor(triangleWidth / density);
      const backLeftEdgeParticles = Math.floor(triangleHeight / density);
      const backRightEdgeParticles = Math.floor(triangleHeight / density);
      const backBottomEdgeParticles = Math.floor(triangleWidth / density);

      particles.push(...createEdgeParticles(centerX, triangleTopY, triangleLeftX, triangleBottomY, leftEdgeParticles));
      particles.push(...createEdgeParticles(centerX, triangleTopY, triangleRightX, triangleBottomY, rightEdgeParticles));
      particles.push(...createEdgeParticles(triangleLeftX, triangleBottomY, triangleRightX, triangleBottomY, bottomEdgeParticles));
      
      for (let i = 0; i < backLeftEdgeParticles; i++) {
        const t = i / backLeftEdgeParticles;
        const y = triangleTopY + triangleHeight * t;
        const baseSize = 2 + Math.random() * 1.5;
        particles.push({
          x: centerX + (backLeftX - centerX) * t,
          y: y + depth * perspective * t,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: baseSize,
          baseSize,
          color: "rgba(255, 255, 255, 0.6)",
          type: "prism",
        });
      }
      
      for (let i = 0; i < backRightEdgeParticles; i++) {
        const t = i / backRightEdgeParticles;
        const y = triangleTopY + triangleHeight * t;
        const baseSize = 2 + Math.random() * 1.5;
        particles.push({
          x: centerX + (backRightX - centerX) * t,
          y: y + depth * perspective * t,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: baseSize,
          baseSize,
          color: "rgba(255, 255, 255, 0.6)",
          type: "prism",
        });
      }
      
      particles.push(...createEdgeParticles(backLeftX, backBottomY, backRightX, backBottomY, backBottomEdgeParticles));
      
      for (let i = 0; i < leftEdgeParticles; i++) {
        const t = i / leftEdgeParticles;
        const y = triangleTopY + triangleHeight * t;
        const baseSize = 2 + Math.random() * 1.5;
        particles.push({
          x: triangleLeftX,
          y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: baseSize,
          baseSize,
          color: "rgba(255, 255, 255, 0.7)",
          type: "prism",
        });
      }
      
      for (let i = 0; i < rightEdgeParticles; i++) {
        const t = i / rightEdgeParticles;
        const y = triangleTopY + triangleHeight * t;
        const baseSize = 2 + Math.random() * 1.5;
        particles.push({
          x: triangleRightX,
          y,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          size: baseSize,
          baseSize,
          color: "rgba(255, 255, 255, 0.7)",
          type: "prism",
        });
      }

      return particles;
    };

    const createBeamParticles = (): Particle[] => {
      return [];
    };

    const createRainbowParticles = (): Particle[] => {
      const particles: Particle[] = [];
      const rainbowStartX = centerX + prismSize * 0.35;
      const rainbowStartY = centerY - prismSize * 0.3;
      const numBands = colors.length;
      const bandHeight = prismSize * 0.6 / numBands;
      
      for (let band = 0; band < numBands; band++) {
        const bandY = rainbowStartY + band * bandHeight;
        const color = colors[band];
        const particlesPerBand = 180;
        const maxSpread = canvas.width - rainbowStartX;
        
        for (let i = 0; i < particlesPerBand; i++) {
          const spreadX = (i / particlesPerBand) * maxSpread;
          const fanAngle = (band / numBands - 0.5) * 0.5;
          const x = rainbowStartX + Math.cos(fanAngle) * spreadX;
          const y = bandY + Math.sin(fanAngle) * spreadX + (Math.random() - 0.5) * bandHeight * 0.5;
          
          const baseSize = 2 + Math.random() * 2;
          const originalVx = Math.cos(fanAngle) * (0.4 + Math.random() * 0.5);
          const originalVy = Math.sin(fanAngle) * (0.4 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.15;
          particles.push({
            x,
            y,
            vx: originalVx,
            vy: originalVy,
            originalVx,
            originalVy,
            size: baseSize,
            baseSize,
            color,
            type: "rainbow",
            rainbowColor: color,
          });
        }
      }
      return particles;
    };

    particlesRef.current = [
      ...createPrismParticles(),
      ...createBeamParticles(),
      ...createRainbowParticles(),
    ];

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      timeRef.current += 0.02;

      const triangleHeight = prismSize * 0.8;
      const triangleWidth = prismSize * 1.1;
      const depth = prismSize * 0.15;
      const triangleTopY = centerY - triangleHeight / 2;
      const triangleBottomY = centerY + triangleHeight / 2;
      const triangleLeftX = centerX - triangleWidth / 2;
      const triangleRightX = centerX + triangleWidth / 2;

      const beamStartX = 0;
      const beamStartY = centerY - prismSize * 0.2;
      const beamEndX = triangleLeftX;
      const beamWidth = 8;

      ctx.save();
      
      const beamGradient = ctx.createLinearGradient(beamStartX, beamStartY - beamWidth / 2, beamStartX, beamStartY + beamWidth / 2);
      beamGradient.addColorStop(0, "rgba(255, 255, 255, 0.3)");
      beamGradient.addColorStop(0.5, "rgba(255, 255, 255, 1)");
      beamGradient.addColorStop(1, "rgba(255, 255, 255, 0.3)");
      ctx.fillStyle = beamGradient;
      ctx.fillRect(beamStartX, beamStartY - beamWidth / 2, beamEndX - beamStartX, beamWidth);
      
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(255, 255, 255, 0.6)";
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(beamStartX, beamStartY);
      ctx.lineTo(beamEndX, beamStartY);
      ctx.stroke();
      
      ctx.restore();

      const perspective = 0.3;
      const backLeftX = triangleLeftX - depth * 0.5;
      const backRightX = triangleRightX - depth * 0.5;
      const backTopY = triangleTopY + depth * perspective * 0.3;
      const backBottomY = triangleBottomY + depth * perspective;

      ctx.save();
      ctx.globalAlpha = 0.3;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
      ctx.lineWidth = 1;
      
      ctx.beginPath();
      ctx.moveTo(triangleLeftX, triangleBottomY);
      ctx.lineTo(backLeftX, backBottomY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(triangleRightX, triangleBottomY);
      ctx.lineTo(backRightX, backBottomY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX, triangleTopY);
      ctx.lineTo(centerX + (backLeftX - centerX) * 0.3, backTopY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX, triangleTopY);
      ctx.lineTo(centerX + (backRightX - centerX) * 0.3, backTopY);
      ctx.stroke();
      
      ctx.restore();

      particlesRef.current.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        const triangleHeight = prismSize * 0.8;
        const triangleWidth = prismSize * 1.1;
        const triangleTopY = centerY - triangleHeight / 2;
        const triangleBottomY = centerY + triangleHeight / 2;
        const triangleLeftX = centerX - triangleWidth / 2;
        const triangleRightX = centerX + triangleWidth / 2;

        if (particle.type === "prism") {
          const depth = prismSize * 0.15;
          const perspective = 0.3;
          const backLeftX = triangleLeftX - depth * 0.5;
          const backRightX = triangleRightX - depth * 0.5;
          const backBottomY = triangleBottomY + depth * perspective;

          const pointOnLeftEdge = (py: number) => {
            const t = (py - triangleTopY) / triangleHeight;
            return { x: centerX + (triangleLeftX - centerX) * t, y: py };
          };

          const pointOnRightEdge = (py: number) => {
            const t = (py - triangleTopY) / triangleHeight;
            return { x: centerX + (triangleRightX - centerX) * t, y: py };
          };

          const pointOnBackLeftEdge = (py: number) => {
            const t = (py - triangleTopY) / triangleHeight;
            return { x: centerX + (backLeftX - centerX) * t, y: py + depth * perspective * t };
          };

          const pointOnBackRightEdge = (py: number) => {
            const t = (py - triangleTopY) / triangleHeight;
            return { x: centerX + (backRightX - centerX) * t, y: py + depth * perspective * t };
          };

          const distToLeftEdge = (() => {
            const p = pointOnLeftEdge(particle.y);
            return Math.hypot(particle.x - p.x, particle.y - p.y);
          })();
          const distToRightEdge = (() => {
            const p = pointOnRightEdge(particle.y);
            return Math.hypot(particle.x - p.x, particle.y - p.y);
          })();
          const distToTop = Math.hypot(particle.x - centerX, particle.y - triangleTopY);
          const distToBottom = Math.abs(particle.y - triangleBottomY);
          const distToBackLeftEdge = (() => {
            const p = pointOnBackLeftEdge(particle.y);
            return Math.hypot(particle.x - p.x, particle.y - p.y);
          })();
          const distToBackRightEdge = (() => {
            const p = pointOnBackRightEdge(particle.y);
            return Math.hypot(particle.x - p.x, particle.y - p.y);
          })();
          const distToBackBottom = Math.abs(particle.y - backBottomY);

          const edgeThreshold = 6;
          const minDist = Math.min(
            distToLeftEdge,
            distToRightEdge,
            distToTop,
            distToBottom,
            distToBackLeftEdge,
            distToBackRightEdge,
            distToBackBottom
          );

          if (minDist > edgeThreshold) {
            if (distToLeftEdge === minDist) {
              const p = pointOnLeftEdge(particle.y);
              particle.x = p.x;
              particle.y = p.y;
            } else if (distToRightEdge === minDist) {
              const p = pointOnRightEdge(particle.y);
              particle.x = p.x;
              particle.y = p.y;
            } else if (distToTop === minDist) {
              particle.x = centerX;
              particle.y = triangleTopY;
            } else if (distToBottom === minDist) {
              const t = (particle.x - triangleLeftX) / (triangleRightX - triangleLeftX);
              particle.x = triangleLeftX + (triangleRightX - triangleLeftX) * Math.max(0, Math.min(1, t));
              particle.y = triangleBottomY;
            } else if (distToBackLeftEdge === minDist) {
              const p = pointOnBackLeftEdge(particle.y);
              particle.x = p.x;
              particle.y = p.y;
            } else if (distToBackRightEdge === minDist) {
              const p = pointOnBackRightEdge(particle.y);
              particle.x = p.x;
              particle.y = p.y;
            } else {
              particle.y = backBottomY;
            }
            particle.vx = (Math.random() - 0.5) * 0.15;
            particle.vy = (Math.random() - 0.5) * 0.15;
          }
        } else if (particle.type === "rainbow") {
          if (particle.x > canvas.width + 10) {
            particle.x = centerX + prismSize * 0.35;
            const bandIndex = Math.floor(Math.random() * colors.length);
            particle.y = centerY - prismSize * 0.3 + bandIndex * (prismSize * 0.6 / colors.length);
            particle.color = colors[bandIndex];
            particle.rainbowColor = colors[bandIndex];
            
            const fanAngle = (bandIndex / colors.length - 0.5) * 0.5;
            particle.originalVx = Math.cos(fanAngle) * (0.4 + Math.random() * 0.5);
            particle.originalVy = Math.sin(fanAngle) * (0.4 + Math.random() * 0.5) + (Math.random() - 0.5) * 0.15;
            particle.vx = particle.originalVx;
            particle.vy = particle.originalVy;
          }

          const restoreSpeed = 0.05;
          const damping = 0.98;
          
          if (mousePosRef.current.x >= 0 && mousePosRef.current.y >= 0) {
            const dx = particle.x - mousePosRef.current.x;
            const dy = particle.y - mousePosRef.current.y;
            const dist = Math.hypot(dx, dy);
            const influenceRadius = 100;
            const repulsionStrength = 0.5;

            if (dist < influenceRadius && dist > 0) {
              const normalizedDist = dist / influenceRadius;
              const force = repulsionStrength * (1 - normalizedDist) * (1 - normalizedDist);
              const angle = Math.atan2(dy, dx);
              particle.vx += Math.cos(angle) * force * 0.05;
              particle.vy += Math.sin(angle) * force * 0.05;
              
              const sizeBoost = 1 + (1 - normalizedDist) * 0.2;
              particle.size = Math.min(particle.baseSize * sizeBoost, particle.baseSize * 1.5);
            } else {
              particle.size = particle.baseSize;
              particle.vx += (particle.originalVx - particle.vx) * restoreSpeed;
              particle.vy += (particle.originalVy - particle.vy) * restoreSpeed;
            }
          } else {
            particle.size = particle.baseSize;
            particle.vx += (particle.originalVx - particle.vx) * restoreSpeed;
            particle.vy += (particle.originalVy - particle.vy) * restoreSpeed;
          }

          particle.vx *= damping;
          particle.vy *= damping;

          ctx.fillStyle = particle.color;
          ctx.beginPath();
          if (Math.random() > 0.3) {
            ctx.rect(particle.x - particle.size / 2, particle.y - particle.size / 2, particle.size, particle.size);
          } else {
            ctx.arc(particle.x, particle.y, particle.size / 1.5, 0, Math.PI * 2);
          }
          ctx.fill();
        } else if (particle.type === "prism") {
          ctx.fillStyle = particle.color;
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

