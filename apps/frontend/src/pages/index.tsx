import React, { useState } from "react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "motion/react";
import { ArrowRight, Check, RefreshCw } from "lucide-react";
import { ComplianceSection } from "@/components/index/ComplianceSection";
import { HowItWorksSection } from "@/components/index/HowItWorksSection";
import { WhyCryptlySection } from "@/components/index/WhyCryptlySection";
import { IntegrationsSection } from "@/components/index/IntegrationsSection";
import { ReviewsSection } from "@/components/index/ReviewsSection";
import { QRCodeSVG } from "qrcode.react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Home() {
  const [qrValue, setQrValue] = useState("https://prism-qr.dev");
  const [inputValue, setInputValue] = useState("https://prism-qr.dev");
  const router = useRouter();

  const handleDashboardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  const handleGenerate = () => {
    if (inputValue.trim()) {
      setQrValue(inputValue.trim());
    }
  };

  const handleRefresh = () => {
    setQrValue((prev) => prev + "?t=" + Date.now());
  };

  return (
    <div className="min-h-screen bg-black tracking-wide">
      <section className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-black">

        <motion.div
          className="relative z-10 mt-0 md:mt-20 w-full max-w-7xl mx-auto px-6 py-12 sm:px-8 md:px-12 lg:px-16"
          initial={{ opacity: 0, y: 100, scale: 0.5 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 2, ease: [0, 1, 0, 1] }}
        >
          <h1 className="text-center text-4xl font-bold text-neutral-100 mb-12 md:text-6xl lg:text-7xl">
            <span className="">Prism QR</span>
          </h1>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-center justify-center mt-12">
            <motion.div
              className="flex justify-center lg:justify-end order-1 lg:order-2 w-full lg:w-auto"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0, 0.55, 0.45, 1], delay: 0.4 }}
            >
              <div className="relative rounded-2xl border border-neutral-800/80 p-6 md:rounded-3xl md:p-8 min-w-[320px] max-w-[320px]">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative p-4 bg-neutral-900/50 backdrop-blur rounded-xl">
                  <QRCodeSVG
                    value={qrValue}
                    size={280}
                    level="H"
                    includeMargin={false}
                    className="w-full h-full"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="flex flex-col gap-4 order-2 lg:order-1 w-full max-w-[500px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0, 0.55, 0.45, 1], delay: 0.2 }}
            >
              <div className="relative rounded-2xl border border-neutral-800/80 p-3 md:rounded-3xl md:p-4">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Enter URL or text"
                  className="relative w-full px-5 py-3.5 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-white placeholder-neutral-500 focus:outline-none focus:ring-0 transition-all text-base"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleGenerate}
                  className="group relative flex-1 inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-6 py-3.5 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25 text-base"
                >
                  <span>Generate QR</span>
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleRefresh}
                  className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white px-5 py-3.5 font-semibold transition-all hover:bg-neutral-800/50"
                >
                  <RefreshCw className="h-5 w-5 transition-transform group-hover:rotate-180" />
                </button>
              </div>
            </motion.div>
          </div>

          <motion.div
            className="mt-12 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0, 0.55, 0.45, 1], delay: 0.8 }}
          >
            <button
              onClick={handleDashboardClick}
              className="cursor-pointer group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>

                  <Link
                    href="/auth/login"
                    className="group inline-flex items-center justify-center gap-2 rounded-full border border-neutral-700 bg-neutral-900/70 px-8 py-3 font-semibold text-white transition-all hover:border-neutral-600 hover:bg-neutral-800/70"
                  >
                    <span>Sign in</span>
                  </Link>
          </motion.div>
        </motion.div>

        <motion.div
          className="absolute bottom-10 text-neutral-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          <p
            className="text-sm cursor-pointer hover:text-neutral-400 transition-colors"
            onClick={() => {
              const featuresSection = document.querySelector(
                "section:nth-of-type(2)"
              );
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Scroll to explore
          </p>
        </motion.div>

      </section>

      <ComplianceSection />

      <IntegrationsSection />

      <HowItWorksSection />

      <WhyCryptlySection />

      <ReviewsSection />

      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              <span className="">Stop wrestling with QR codes</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Create QR codes instantly. No complexity, no third-party tracking.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={handleDashboardClick}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
              >
                <span>Get started - it&apos;s free</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <div className="mt-12 flex items-center justify-center gap-2 sm:gap-8 text-xs sm:text-sm text-neutral-500">
              <div className="flex items-center gap-1 sm:gap-2 ">
                <Check className="h-4 w-4 text-green-600 " />
                <span>Free Forever</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ">
                <Check className="h-4 w-4 text-green-600" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ">
                <Check className="h-4 w-4 text-green-600" />
                <span>E2E Encrypted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            © 2025 Prism QR. Create QR codes instantly.
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
