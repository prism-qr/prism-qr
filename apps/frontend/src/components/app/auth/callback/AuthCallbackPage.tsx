import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { loginWithGoogle } from "@/lib/auth";

export function AuthCallbackPage() {
  const router = useRouter();
  const { login: setAuthToken } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!router.isReady) return;

    const code = router.query.code as string;
    const errorParam = router.query.error as string;

    if (errorParam) {
      setError("Authentication failed");
      setLoading(false);
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }

    if (!code) {
      setError("No authorization code received");
      setLoading(false);
      setTimeout(() => router.push("/auth/login"), 2000);
      return;
    }

    const handleGoogleAuth = async () => {
      try {
        const response = await loginWithGoogle({
          googleCode: code,
          termsAccepted: true,
          emailAccepted: true,
        });
        setAuthToken(response.token);
        router.push("/dashboard");
      } catch (err: any) {
        setError(err.message || "Failed to authenticate");
        setLoading(false);
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    };

    handleGoogleAuth();
  }, [router, setAuthToken]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="text-center">
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white">Authenticating...</p>
          </>
        ) : (
          <>
            <p className="text-red-500 mb-4">{error || "Authentication failed"}</p>
            <p className="text-neutral-400">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}
