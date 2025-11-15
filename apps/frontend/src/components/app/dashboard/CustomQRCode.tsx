"use client";

import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";

interface CustomQRCodeProps {
  value: string;
  size: number;
  fgColor: string;
  bgColor: string;
  dotStyle: "square" | "rounded" | "dots";
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

export function CustomQRCode({
  value,
  size,
  fgColor,
  bgColor,
  errorCorrectionLevel,
}: CustomQRCodeProps) {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey(prev => prev + 1);
  }, [value, fgColor, bgColor, errorCorrectionLevel]);

  return (
    <div className="w-full h-full max-w-full max-h-full">
      <QRCodeSVG
        key={key}
        value={value}
        size={size}
        level={errorCorrectionLevel}
        includeMargin={false}
        fgColor={fgColor}
        bgColor={bgColor}
        className="w-full h-full max-w-full max-h-full"
      />
    </div>
  );
}
