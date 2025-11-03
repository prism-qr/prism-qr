"use client";

import { motion } from "motion/react";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

interface PrismAnimationProps {
  qrValue?: string;
}

export function PrismAnimation({ qrValue = "https://prism-qr.dev" }: PrismAnimationProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="whiteLight" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(255,255,255,0)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="70%" stopColor="rgba(255,255,255,1)" />
            <stop offset="100%" stopColor="rgba(255,255,255,1)" />
          </linearGradient>

          <linearGradient id="rainbowGradient" x1="0%" y1="0%" x2="100%" y2="100%" gradientTransform="rotate(45)">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.95" />
            <stop offset="14.28%" stopColor="#f97316" stopOpacity="0.95" />
            <stop offset="28.56%" stopColor="#eab308" stopOpacity="0.95" />
            <stop offset="42.84%" stopColor="#22c55e" stopOpacity="0.95" />
            <stop offset="57.12%" stopColor="#3b82f6" stopOpacity="0.95" />
            <stop offset="71.4%" stopColor="#6366f1" stopOpacity="0.95" />
            <stop offset="85.68%" stopColor="#8b5cf6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0.95" />
          </linearGradient>

          <filter id="lightGlow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="spectrumGlow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="prismGlass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
            <stop offset="50%" stopColor="rgba(255,255,255,0.08)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
          </linearGradient>
        </defs>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: isMounted ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <motion.line
            x1="80"
            y1="250"
            x2="420"
            y2="250"
            stroke="url(#whiteLight)"
            strokeWidth="10"
            strokeLinecap="round"
            filter="url(#lightGlow)"
            initial={{ x1: -100, opacity: 0 }}
            animate={{ 
              x1: isMounted ? 80 : -100,
              opacity: isMounted ? 1 : 0,
            }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />

          <motion.circle
            cx="80"
            cy="250"
            r="8"
            fill="white"
            filter="url(#lightGlow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isMounted ? 1 : 0,
              scale: isMounted ? 1 : 0,
            }}
            transition={{ duration: 0.8, delay: 0.7 }}
          />

          <motion.path
            d="M 420 180 L 570 180 L 495 320 L 345 320 Z"
            fill="url(#prismGlass)"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ 
              opacity: isMounted ? 1 : 0,
              scale: isMounted ? 1 : 0.85,
            }}
            transition={{ duration: 1.2, delay: 0.8 }}
          />

          <motion.path
            d="M 570 180 L 800 120 L 800 280 L 570 320 Z"
            fill="url(#rainbowGradient)"
            opacity={0}
            initial={{ opacity: 0, pathLength: 0 }}
            animate={{ 
              opacity: isMounted ? 0.85 : 0,
              pathLength: isMounted ? 1 : 0,
            }}
            transition={{ duration: 2.5, delay: 1.8, ease: "easeOut" }}
            filter="url(#spectrumGlow)"
          />

          <motion.circle
            cx="420"
            cy="250"
            r="12"
            fill="white"
            filter="url(#lightGlow)"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: isMounted ? [0, 1, 0.7] : 0,
              scale: isMounted ? [0, 1.5, 1] : 0,
            }}
            transition={{ 
              duration: 1.5, 
              delay: 1.2,
              times: [0, 0.3, 1]
            }}
          />
        </motion.g>
      </svg>

      <div className="relative z-10">
        <motion.div
          className="relative"
          style={{
            perspective: "1000px",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: isMounted ? 1 : 0 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <motion.div
            className="relative w-[140px] h-[140px] md:w-[170px] md:h-[170px]"
            style={{
              transform: "translateZ(0)",
            }}
            initial={{ opacity: 0, scale: 0.6, rotateY: -45, rotateX: 10 }}
            animate={{ 
              opacity: isMounted ? 1 : 0,
              scale: isMounted ? 1 : 0.6,
              rotateY: isMounted ? -15 : -45,
              rotateX: isMounted ? 5 : 10,
            }}
            transition={{ duration: 1.8, delay: 2.2, type: "spring", stiffness: 100 }}
          >
            <div
              className="absolute inset-0 bg-black/90 backdrop-blur-sm rounded-md p-2.5 md:p-3 border border-white/25 shadow-[0_0_30px_rgba(255,255,255,0.3)]"
              style={{
                transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg)",
                transformStyle: "preserve-3d",
              }}
            >
              {isMounted && (
                <QRCodeSVG
                  value={qrValue}
                  size={170}
                  level="H"
                  includeMargin={false}
                  className="w-full h-full"
                />
              )}
            </div>

            <div
              className="absolute inset-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 50%, rgba(255,255,255,0.1) 100%)",
                transform: "perspective(1000px) rotateY(-15deg) rotateX(5deg)",
                transformStyle: "preserve-3d",
                borderRadius: "0.375rem",
                pointerEvents: "none",
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}

