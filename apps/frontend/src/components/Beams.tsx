"use client";

export default function Beams() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-900/20 to-transparent" />
      <div className="absolute top-0 left-1/4 h-full w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
      <div className="absolute top-0 left-2/4 h-full w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
      <div className="absolute top-0 left-3/4 h-full w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
    </div>
  );
}

