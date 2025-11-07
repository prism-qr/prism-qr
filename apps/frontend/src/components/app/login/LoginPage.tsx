"use client";

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth-store";
import { login, loginWithGoogle } from "@/lib/auth";
import { useRouter } from "next/router";
import Link from "next/link";
import { GlowingEffect } from "@/components/ui/glowing-effect";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const { isAuthenticated, token, login: loginAction } = useAuthStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          useAuthStore.setState({ token: storedToken, isAuthenticated: true });
          router.push("/dashboard");
        }
        setIsChecking(false);
      };
      
      if (document.readyState === 'complete') {
        checkAuth();
      } else {
        window.addEventListener('load', checkAuth);
        return () => window.removeEventListener('load', checkAuth);
      }
    } else {
      setIsChecking(false);
    }
  }, [router]);

  useEffect(() => {
    if ((isAuthenticated || token) && !isChecking) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, token, isChecking, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login({ email, password });
      loginAction(response.token);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    
    if (!googleClientId) {
      setError("Google authentication is not configured. Please contact support.");
      return;
    }
    
    const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
      (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
        ? 'http://localhost:3000/auth/google/callback'
        : typeof window !== 'undefined' 
          ? `${window.location.origin}/auth/google/callback`
          : 'http://localhost:3000/auth/google/callback');
    
    if (!redirectUri) {
      setError("Unable to determine redirect URI");
      return;
    }
    
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=email profile&access_type=offline`;
    
    window.location.href = authUrl;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back</h1>
          <p className="text-neutral-400">Sign in to your account</p>
        </div>

        <div className="relative rounded-2xl border border-neutral-800/80 p-6 md:rounded-3xl md:p-8">
          <GlowingEffect
            spread={40}
            glow={true}
            disabled={false}
            proximity={64}
            inactiveZone={0.01}
          />
          <div className="relative space-y-6">
            <button
              onClick={handleGoogleLogin}
              className="relative w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white font-semibold hover:bg-neutral-800/50 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-black text-neutral-400">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-2">
                  Email
                </label>
                <div className="relative rounded-2xl border border-neutral-800/80 p-2">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="relative w-full px-4 py-3 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-white placeholder-neutral-500 focus:outline-none focus:ring-0 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-2">
                  Password
                </label>
                <div className="relative rounded-2xl border border-neutral-800/80 p-2">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="relative w-full px-4 py-3 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-white placeholder-neutral-500 focus:outline-none focus:ring-0 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-white text-black px-8 py-3 font-semibold shadow-2xl transition-all hover:scale-105 hover:shadow-white/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>{loading ? "Signing in..." : "Sign in"}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
            </form>

            <p className="text-center text-sm text-neutral-400">
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-white hover:text-neutral-300 transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
