import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight, Check, Zap, Loader2 } from "lucide-react";
import { ComplianceSection } from "@/components/index/ComplianceSection";
import { HowItWorksSection } from "@/components/index/HowItWorksSection";
import { WhyPrismQRSection } from "@/components/index/WhyPrismQRSection";
import { useRouter } from "next/router";
import { useAuthStore } from "@/lib/store/auth-store";
import { getTotalScans } from "@/lib/api/stats";

const DynamicQRScene = dynamic(
  () => import("@/components/index/DynamicQRScene").then((mod) => ({ default: mod.DynamicQRScene })),
  { ssr: false }
);

export default function Home() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [scanCount, setScanCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTotalScans = async () => {
      try {
        const total = await getTotalScans();
        setScanCount(total);
        setDisplayCount(total);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch total scans:', error);
        setIsLoading(false);
      }
    };

    fetchTotalScans();

    const interval = setInterval(async () => {
      try {
        const total = await getTotalScans();
        setScanCount(total);
        setIsAnimating(true);
      } catch (error) {
        console.error('Failed to fetch total scans:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const duration = 800;
    const steps = 30;
    const stepDuration = duration / steps;
    const startCount = displayCount;
    const increment = (scanCount - startCount) / steps;
    
    let currentStep = 0;
    const animationInterval = setInterval(() => {
      currentStep++;
      if (currentStep <= steps) {
        setDisplayCount(Math.floor(startCount + increment * currentStep));
      } else {
        setDisplayCount(scanCount);
        setIsAnimating(false);
        clearInterval(animationInterval);
      }
    }, stepDuration);

    return () => clearInterval(animationInterval);
  }, [scanCount, displayCount]);

  const handleDashboardClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/auth/login");
    }
  };

  const formatNumber = (num: number): string => {
    return num.toLocaleString("en-US");
  };

  return (
    <div className="min-h-screen bg-black tracking-wide overflow-x-hidden relative max-w-full">
      <section className="relative flex h-screen w-full flex-col items-center justify-center bg-black overflow-hidden" style={{ zIndex: 10, position: 'relative' }}>

        <motion.div
          className="w-full flex items-center justify-center pointer-events-none pt-20 md:pt-24 pb-2 md:pb-3"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            className="text-center pointer-events-none w-full"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="text-6xl font-black md:text-7xl lg:text-8xl px-8 py-4 tracking-tight bg-gradient-to-r from-white via-purple-200 to-white bg-clip-text text-transparent"
              style={{
                textShadow: "0 0 60px rgba(168, 85, 247, 0.4), 0 0 120px rgba(168, 85, 247, 0.2)",
                letterSpacing: "-0.02em",
                filter: "drop-shadow(0 0 30px rgba(168, 85, 247, 0.3)) drop-shadow(0 0 60px rgba(236, 72, 153, 0.2))",
              }}
            >
              Prism QR
            </h1>
          </motion.div>
        </motion.div>

        <div className="w-full flex items-center justify-center py-3" style={{ zIndex: 100 }}>
          <div style={{ maxWidth: '500px', width: '100%', padding: '0 32px' }}>
            <DynamicQRScene />
          </div>
        </div>

        <motion.div
          className="w-full flex flex-col items-center justify-center gap-6 py-4 md:py-6 pb-12 md:pb-16"
          style={{ zIndex: 200 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-white max-w-3xl mx-auto px-6 font-medium text-center w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              textShadow: "0 0 30px rgba(0, 0, 0, 0.95), 0 4px 15px rgba(0, 0, 0, 1), 0 8px 30px rgba(0, 0, 0, 0.9)",
            }}
          >
            One QR Code, infinite destinations.
          </motion.p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full">
            {isAuthenticated ? (
              <button
                onClick={handleDashboardClick}
                className="cursor-pointer group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-purple-500/50 hover:from-purple-600 hover:to-pink-600"
              >
                <span>Dashboard</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            ) : (
              <button
                onClick={handleDashboardClick}
                className="cursor-pointer group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-4 text-lg font-bold shadow-2xl transition-all hover:scale-105 hover:shadow-purple-500/50 hover:from-purple-600 hover:to-pink-600"
              >
                <Zap className="h-5 w-5" />
                <span>Try for Free</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          <motion.div
            className="text-center px-6 w-full overflow-visible"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div className="inline-block relative overflow-visible">
              <motion.div 
                className="absolute -inset-2 bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-xl rounded-full"
                animate={isAnimating ? {
                  scale: [1, 1.1, 1],
                  opacity: [0.3, 0.5, 0.3]
                } : {}}
                transition={{ duration: 0.8 }}
              />
              <motion.div 
                className="relative bg-black/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-purple-500/30 overflow-visible"
                animate={isAnimating ? {
                  borderColor: ["rgba(168, 85, 247, 0.3)", "rgba(168, 85, 247, 0.8)", "rgba(168, 85, 247, 0.3)"]
                } : {}}
                transition={{ duration: 0.8 }}
              >
                <p className="text-[10px] md:text-xs text-neutral-300 uppercase tracking-wider mb-0.5 font-semibold">
                  Total Scans
                </p>
                {isLoading ? (
                  <div className="flex items-center justify-center py-2">
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 text-purple-400 animate-spin" />
                  </div>
                ) : (
                  <motion.p 
                    className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent whitespace-nowrap"
                    animate={isAnimating ? {
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0 0 0px rgba(168, 85, 247, 0)",
                        "0 0 20px rgba(168, 85, 247, 0.8)",
                        "0 0 0px rgba(168, 85, 247, 0)"
                      ]
                    } : {}}
                    transition={{ duration: 0.8 }}
                  >
                    {formatNumber(displayCount)}
                  </motion.p>
                )}
              </motion.div>
            </div>
          </motion.div>
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
              Join thousands using dynamic QR codes for marketing, IoT, and beyond. Get started today.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button
                onClick={handleDashboardClick}
                className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
              >
                <span>Get started - no credit card</span>
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
                <span>Self-Hostable</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-neutral-800 py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-neutral-500">
            © 2025 Prism QR. Making QR codes smarter, one scan at a time.
            <div className="mt-1 text-xs text-neutral-600">
              Software provided &quot;AS IS&quot; under MIT License. Service terms may change.
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm text-neutral-500">
            <Link
              href="/api-docs"
              className="hover:text-neutral-300 transition-colors"
            >
              API Documentation
            </Link>
            <a
              href="https://github.com/prism-qr/prism-qr"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-neutral-300 transition-colors"
            >
              Source Code
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
