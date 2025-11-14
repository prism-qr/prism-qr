import React from "react";
import dynamic from "next/dynamic";
import { motion } from "motion/react";
import { ArrowRight, Check, Zap } from "lucide-react";
import { ComplianceSection } from "@/components/index/ComplianceSection";
import { HowItWorksSection } from "@/components/index/HowItWorksSection";
import { WhyPrismQRSection } from "@/components/index/WhyPrismQRSection";
import { useRouter } from "next/router";
import Link from "next/link";

const DynamicQRScene = dynamic(
  () => import("@/components/index/DynamicQRScene").then((mod) => ({ default: mod.DynamicQRScene })),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();

  const handleDashboardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-black tracking-wide overflow-visible relative">
      <section className="relative flex h-screen w-full flex-col items-center justify-center overflow-visible bg-black pb-12" style={{ zIndex: 10, position: 'relative' }}>

        <div className="absolute inset-0 z-0 overflow-visible" style={{ zIndex: 100 }}>
          <DynamicQRScene />
        </div>

        <motion.div
          className="absolute top-20 left-0 right-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-center pointer-events-none"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold text-white md:text-7xl lg:text-8xl px-8 py-4"
              style={{
                textShadow: "0 0 40px rgba(0, 0, 0, 0.9), 0 0 80px rgba(0, 0, 0, 0.8), 0 4px 20px rgba(0, 0, 0, 1), 0 8px 40px rgba(0, 0, 0, 0.9)",
                WebkitTextStroke: "1px rgba(0, 0, 0, 0.3)",
              }}
            >
              <span className="">Prism QR</span>
            </h1>
          </motion.div>
        </motion.div>

        <motion.div
          className="relative z-10 mt-auto mb-4 flex flex-col items-center justify-center gap-8"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-white max-w-3xl mx-auto px-6 font-medium text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              textShadow: "0 0 30px rgba(0, 0, 0, 0.95), 0 4px 15px rgba(0, 0, 0, 1), 0 8px 30px rgba(0, 0, 0, 0.9)",
            }}
          >
            Update destinations instantly without reprinting.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
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
          </div>
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

      <div style={{ position: 'relative', zIndex: 1 }}>
        <ComplianceSection />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <HowItWorksSection />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <WhyPrismQRSection />
      </div>

      <section className="relative py-32 px-6">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold text-white md:text-5xl">
              <span className="">Ready to transform your QR experience?</span>
            </h2>
            <p className="mt-6 text-lg text-neutral-400">
              Join thousands using dynamic QR codes for marketing, IoT, and beyond. Start free today.
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
                <span>No Credit Card</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ">
                <Check className="h-4 w-4 text-green-600" />
                <span>Open Source</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 ">
                <Check className="h-4 w-4 text-green-600" />
                <span>IoT Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            © 2025 Prism QR. Making QR codes smarter, one scan at a time.
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <a
              href="https://github.com/prism-qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              GitHub
            </a>
            <Link
              href="/auth/login"
              className="hover:text-neutral-300 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
