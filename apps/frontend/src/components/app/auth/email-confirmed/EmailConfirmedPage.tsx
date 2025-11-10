"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/lib/store/auth-store";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function EmailConfirmedPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  const { login } = useAuthStore();

  useEffect(() => {
    const confirmEmail = async () => {
      const { token, success } = router.query;

      if (!router.isReady) {
        return;
      }

      if (!token || typeof token !== "string") {
        setStatus("error");
        setErrorMessage("Invalid confirmation link. Please try again or contact support.");
        return;
      }

      if (success !== "true") {
        setStatus("error");
        setErrorMessage("Something went wrong during email confirmation. Please try again.");
        return;
      }

      try {
        login(token);
        setStatus("success");

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } catch (error) {
        setStatus("error");
        setErrorMessage("Failed to log you in. Please try logging in manually.");
      }
    };

    confirmEmail();
  }, [router.isReady, router.query, login, router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="relative rounded-2xl border border-neutral-800/80 p-6 md:rounded-3xl md:p-8">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative text-center space-y-6">
            {status === "loading" && (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto"></div>
                <h2 className="text-2xl font-bold text-white">Confirming your email...</h2>
                <p className="text-neutral-400">Please wait a moment</p>
              </>
            )}

            {status === "success" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Email confirmed!</h2>
                <p className="text-neutral-300">
                  Your email has been successfully verified. Redirecting to dashboard...
                </p>
              </>
            )}

            {status === "error" && (
              <>
                <div className="mx-auto w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg
                    className="w-8 h-8 text-red-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white">Something went wrong</h2>
                <p className="text-neutral-300">{errorMessage}</p>
                <div className="pt-4">
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
                  >
                    Go to login
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
