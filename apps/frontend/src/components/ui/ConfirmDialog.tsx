"use client";

import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "warning";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  variant = "danger",
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const variantStyles =
    variant === "danger"
      ? "border-red-500/30 bg-red-500/10 text-red-400"
      : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400";

  const buttonStyles =
    variant === "danger"
      ? "bg-red-500/20 hover:bg-red-500/30 border-red-500/50 text-red-400"
      : "bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500/50 text-yellow-400";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 max-w-md w-full shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start gap-4 mb-6">
            <div
              className={`p-3 rounded-xl ${variantStyles} border flex-shrink-0`}
            >
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-2">
                {title}
              </h3>
              <p className="text-neutral-400 text-sm">{message}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl bg-neutral-800/50 hover:bg-neutral-800 border border-neutral-700 text-white font-semibold transition-all"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl border font-semibold transition-all ${buttonStyles}`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
