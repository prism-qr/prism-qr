"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthStore } from "@/lib/store/auth-store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const checkAuth = () => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
          useAuthStore.setState({ token: storedToken, isAuthenticated: true });
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
  }, []);

  useEffect(() => {
    if (!isChecking && !isAuthenticated && !token) {
      router.push("/auth/login");
    }
  }, [isChecking, isAuthenticated, token, router]);

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

  if (!isAuthenticated && !token) {
    return null;
  }

  return <>{children}</>;
}
