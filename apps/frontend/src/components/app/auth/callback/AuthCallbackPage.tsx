"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/lib/store/auth-store";
import { loginWithGoogle } from "@/lib/auth";
import { motion } from "motion/react";
import { CheckCircle, ArrowRight } from "lucide-react";

export function AuthCallbackPage() {
  const router = useRouter();
  const loginStore = useAuthStore();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const hasProcessedRef = useRef(false);

  useEffect(() => {
    if (!router.isReady) {
      return;
    }

    if (hasProcessedRef.current) {
      return;
    }

    const code = router.query.code as string;
    const errorParam = router.query.error as string;

    if (errorParam) {
      hasProcessedRef.current = true;
      let errorMessage = `Authentication failed: ${errorParam}`;
      
      if (errorParam === 'redirect_uri_mismatch') {
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
        const expectedRedirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
          (currentOrigin ? `${currentOrigin}/auth/google/callback` : '');
        
        errorMessage = `Redirect URI mismatch. The redirect URI used was: ${expectedRedirectUri}. Please ensure this exact URI is registered in Google OAuth Console.`;
      }
      
      setError(errorMessage);
      setLoading(false);
      return;
    }

    if (!code) {
      hasProcessedRef.current = true;
      setError("No authorization code received from Google");
      setLoading(false);
      return;
    }

    const handleGoogleAuth = async () => {
      if (hasProcessedRef.current) {
        return;
      }
      
      hasProcessedRef.current = true;
      
      try {
        setLoading(true);
        const isLocalhost = typeof window !== 'undefined' && 
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
        
        const response = await loginWithGoogle({
          googleCode: code,
          termsAccepted: true,
          emailAccepted: true,
          forceLocalLogin: isLocalhost,
        });
        
        loginStore.login(response.token);
        setSuccess(true);
        setLoading(false);
      } catch (err: any) {
        const errorMessage = err?.data?.message || err?.data?.error || err?.message || "Failed to authenticate with Google";
        setError(errorMessage);
        setLoading(false);
      }
    };

    handleGoogleAuth();
  }, [router.isReady, router.query.code, router.query.error, loginStore]);

  const handleGoToDashboard = () => {
    router.push("/dashboard");
  };

  if (!router.isReady) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Authenticating...</p>
          </>
        ) : success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white">Success!</h1>
            <p className="text-neutral-400">You have been successfully authenticated.</p>
            <button
              onClick={handleGoToDashboard}
              className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </motion.div>
        ) : (
          <>
            <p className="text-red-500 mb-4">{error || "Authentication failed"}</p>
            <button
              onClick={() => router.push("/auth/login")}
              className="text-neutral-400 hover:text-white transition-colors"
            >
              Go back to login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
