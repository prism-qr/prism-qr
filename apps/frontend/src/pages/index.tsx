import React from "react";
import dynamic from "next/dynamic";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { ComplianceSection } from "@/components/index/ComplianceSection";
import { HowItWorksSection } from "@/components/index/HowItWorksSection";
import { WhyCryptlySection } from "@/components/index/WhyCryptlySection";
import { IntegrationsSection } from "@/components/index/IntegrationsSection";
import { ReviewsSection } from "@/components/index/ReviewsSection";
import { useRouter } from "next/router";
import Link from "next/link";

const GeometricScene = dynamic(
  () => import("@/components/index/GeometricScene").then((mod) => ({ default: mod.GeometricScene })),
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
          <GeometricScene />
        </div>

        <motion.div
          className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-center text-4xl font-bold text-neutral-100 md:text-6xl lg:text-7xl pointer-events-none"
            style={{
              textShadow: "0 4px 20px rgba(0, 0, 0, 0.8), 0 8px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(139, 92, 246, 0.6), 0 0 60px rgba(139, 92, 246, 0.4), 0 0 90px rgba(139, 92, 246, 0.2)",
            }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="">Prism QR</span>
          </motion.h1>
        </motion.div>

        <motion.div
          className="relative z-10 mt-auto mb-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
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
        <IntegrationsSection />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <HowItWorksSection />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <WhyCryptlySection />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <ReviewsSection />
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
