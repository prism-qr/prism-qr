"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, AlertTriangle, Palette } from "lucide-react";

export interface QRCodeCustomization {
  fgColor: string;
  bgColor: string;
  dotStyle: "square" | "rounded" | "dots";
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

interface QRCodeCustomizerProps {
  customization: QRCodeCustomization;
  onChange: (customization: QRCodeCustomization) => void;
}

export function QRCodeCustomizer({ customization, onChange }: QRCodeCustomizerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const dotStyles: Array<{ value: QRCodeCustomization["dotStyle"]; label: string; description: string }> = [
    { value: "square", label: "Square", description: "Classic sharp edges" },
    { value: "rounded", label: "Rounded", description: "Smooth corners" },
    { value: "dots", label: "Dots", description: "Circular dots" },
  ];

  const errorLevels: Array<{ value: QRCodeCustomization["errorCorrectionLevel"]; label: string; description: string }> = [
    { value: "L", label: "Low (7%)", description: "Faster scanning" },
    { value: "M", label: "Medium (15%)", description: "Balanced" },
    { value: "Q", label: "Quartile (25%)", description: "Recommended" },
    { value: "H", label: "High (30%)", description: "Best for logos" },
  ];

  const presetColors = [
    { fg: "#000000", bg: "#FFFFFF", name: "Classic" },
    { fg: "#FFFFFF", bg: "#000000", name: "Inverted" },
    { fg: "#8B5CF6", bg: "#FFFFFF", name: "Purple" },
    { fg: "#EC4899", bg: "#FFFFFF", name: "Pink" },
    { fg: "#3B82F6", bg: "#FFFFFF", name: "Blue" },
    { fg: "#10B981", bg: "#FFFFFF", name: "Green" },
  ];

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white hover:bg-neutral-800/50 transition-all"
      >
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4 text-purple-400" />
          <span className="font-semibold text-sm">Customize QR Code</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-neutral-400" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 p-4 rounded-xl bg-neutral-900/30 border border-neutral-800/50">
              <div className="relative rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-yellow-400 text-xs font-semibold mb-0.5">
                      Preview Only
                    </p>
                    <p className="text-yellow-500/80 text-xs">
                      Customizations are temporary and won&apos;t be saved. Download the QR code to keep your design.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                  Color Presets
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {presetColors.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => onChange({
                        ...customization,
                        fgColor: preset.fg,
                        bgColor: preset.bg,
                      })}
                      className={`p-2 rounded-lg border transition-all ${
                        customization.fgColor === preset.fg && customization.bgColor === preset.bg
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-neutral-700 hover:border-neutral-600"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5">
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.fg }}
                          />
                          <div
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: preset.bg }}
                          />
                        </div>
                        <span className="text-xs text-neutral-300">{preset.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2 min-w-0">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                    Foreground
                  </label>
                  <div className="flex gap-2 min-w-0">
                    <input
                      type="color"
                      value={customization.fgColor}
                      onChange={(e) => onChange({ ...customization, fgColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer bg-neutral-800 border border-neutral-700 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={customization.fgColor}
                      onChange={(e) => onChange({ ...customization, fgColor: e.target.value })}
                      className="flex-1 min-w-[80px] px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-mono"
                      placeholder="#000000"
                    />
                  </div>
                </div>

                <div className="space-y-2 min-w-0">
                  <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                    Background
                  </label>
                  <div className="flex gap-2 min-w-0">
                    <input
                      type="color"
                      value={customization.bgColor}
                      onChange={(e) => onChange({ ...customization, bgColor: e.target.value })}
                      className="w-12 h-10 rounded-lg cursor-pointer bg-neutral-800 border border-neutral-700 flex-shrink-0"
                    />
                    <input
                      type="text"
                      value={customization.bgColor}
                      onChange={(e) => onChange({ ...customization, bgColor: e.target.value })}
                      className="flex-1 min-w-[80px] px-3 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm font-mono"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                  Dot Style
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {dotStyles.map((style) => (
                    <button
                      key={style.value}
                      onClick={() => onChange({ ...customization, dotStyle: style.value })}
                      disabled={style.value !== "square"}
                      className={`p-3 rounded-lg border transition-all text-left ${
                        customization.dotStyle === style.value
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-neutral-700 hover:border-neutral-600"
                      } ${style.value !== "square" ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <div className="text-sm font-semibold text-white mb-0.5">
                        {style.label}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300 uppercase tracking-wide">
                  Error Correction
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {errorLevels.map((level) => (
                    <button
                      key={level.value}
                      onClick={() => onChange({ ...customization, errorCorrectionLevel: level.value })}
                      className={`p-2 rounded-lg border transition-all text-left ${
                        customization.errorCorrectionLevel === level.value
                          ? "border-purple-500 bg-purple-500/10"
                          : "border-neutral-700 hover:border-neutral-600"
                      }`}
                    >
                      <div className="text-xs font-semibold text-white mb-0.5">
                        {level.label}
                      </div>
                      <div className="text-xs text-neutral-400">
                        {level.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onChange({
                  fgColor: "#000000",
                  bgColor: "#FFFFFF",
                  dotStyle: "square",
                  errorCorrectionLevel: "H",
                })}
                className="w-full px-4 py-2 rounded-lg bg-neutral-800 border border-neutral-700 text-neutral-300 text-sm hover:bg-neutral-700 transition-all"
              >
                Reset to Default
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
