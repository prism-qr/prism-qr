"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { RefreshCw, ExternalLink, Check, LogOut, Copy, Key, Eye, EyeOff, Download } from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Link, getLinks, createLink, updateLink, getApiKey } from "@/lib/api/links";

export function DashboardPage() {
  const loginStore = useAuthStore();
  const router = useRouter();
  const [qrLink, setQrLink] = useState<Link | null>(null);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [testLinkName, setTestLinkName] = useState<string>("");
  const [isMounted, setIsMounted] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [apiKey, setApiKey] = useState<string>("");
  const [apiKeyLoading, setApiKeyLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const checkmarkTimer = useRef<NodeJS.Timeout | null>(null);
  const copyTimer = useRef<NodeJS.Timeout | null>(null);
  const qrLinkRef = useRef<Link | null>(null);
  const qrCodeRef = useRef<HTMLDivElement | null>(null);

  const generateLinkName = () => {
    return Math.random().toString(36).substring(2, 10);
  };

  useEffect(() => {
    setIsMounted(true);
    setTestLinkName(generateLinkName());

    const fetchUserLinks = async () => {
      try {
        const links = await getLinks();
        if (links && links.length > 0) {
          const mostRecentLink = links[links.length - 1];
          setQrLink(mostRecentLink);
          qrLinkRef.current = mostRecentLink;
          setDestinationUrl(mostRecentLink.destination);
          
          if (typeof window !== 'undefined') {
            const storedApiKey = localStorage.getItem(`apiKey_${mostRecentLink.id}`);
            if (storedApiKey) {
              setApiKey(storedApiKey);
              setShowApiKey(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch user links:", err);
      } finally {
        setIsInitialLoad(false);
      }
    };

    fetchUserLinks();

    return () => {
      if (checkmarkTimer.current) {
        clearTimeout(checkmarkTimer.current);
      }
    };
  }, []);

  const getQrCodeUrl = () => {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL || "https://devprismqr.bieda.it";
    const baseUrl = apiUrl.replace("/api", "").replace(":3000", "");
    if (qrLink) {
      return `${baseUrl}/${qrLink.name}`;
    }
    if (!isMounted || !testLinkName) {
      return `${baseUrl}/loading`;
    }
    return `${baseUrl}/${testLinkName}`;
  };

  const handleLogout = () => {
    loginStore.logout();
    router.push("/auth/login");
  };

  const createOrUpdateLink = useCallback(async (
    destination: string,
    showSuccess = false
  ) => {
    if (!destination.trim()) return;

    setLoading(true);
    setError("");

    try {
      const currentLink = qrLinkRef.current;
      if (currentLink) {
        const updatedLink = await updateLink(currentLink.id, destination.trim());
        setQrLink(updatedLink);
        qrLinkRef.current = updatedLink;
      } else {
        const linkName = generateLinkName();
        const link = await createLink(linkName, destination.trim());
        setQrLink(link);
        qrLinkRef.current = link;
      }

      if (showSuccess) {
        setShowCheckmark(true);
        if (checkmarkTimer.current) {
          clearTimeout(checkmarkTimer.current);
        }
        checkmarkTimer.current = setTimeout(() => {
          setShowCheckmark(false);
        }, 2000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to create/update link");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    qrLinkRef.current = qrLink;
  }, [qrLink]);

  useEffect(() => {
    if (isInitialLoad) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    const timer = setTimeout(() => {
      if (destinationUrl.trim()) {
        createOrUpdateLink(destinationUrl, false);
      }
    }, 1000);

    debounceTimer.current = timer;

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [destinationUrl, isInitialLoad, createOrUpdateLink]);

  const handleRefresh = async () => {
    if (!destinationUrl.trim() || !qrLink) return;

    setInputKey((prev) => prev + 1);
    setLoading(true);
    setError("");

    try {
      const updatedLink = await updateLink(qrLink.id, destinationUrl.trim());
      setQrLink(updatedLink);
      qrLinkRef.current = updatedLink;
      
      setShowCheckmark(true);
      if (checkmarkTimer.current) {
        clearTimeout(checkmarkTimer.current);
      }
      checkmarkTimer.current = setTimeout(() => {
        setShowCheckmark(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Failed to refresh link");
    } finally {
      setLoading(false);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const handleGenerateApiKey = async () => {
    if (!qrLink) return;

    setApiKeyLoading(true);
    setError("");

    try {
      const response = await getApiKey(qrLink.id);
      setApiKey(response.apiKey);
      setShowApiKey(true);
      if (typeof window !== 'undefined') {
        localStorage.setItem(`apiKey_${qrLink.id}`, response.apiKey);
      }
    } catch (err: any) {
      setError(err.message || "Failed to generate API key");
    } finally {
      setApiKeyLoading(false);
    }
  };

  const maskApiKey = (key: string) => {
    if (!key) return "";
    if (key.length <= 18) return "•".repeat(key.length);
    const prefix = key.substring(0, 18);
    return `${prefix}${"•".repeat(Math.max(key.length - 18, 12))}`;
  };

  const handleCopyApiKey = () => {
    if (!apiKey) return;
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    if (copyTimer.current) {
      clearTimeout(copyTimer.current);
    }
    copyTimer.current = setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (copyTimer.current) {
        clearTimeout(copyTimer.current);
      }
    };
  }, []);

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) return;

    const svgElement = qrCodeRef.current.querySelector('svg');
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${qrLink?.name || 'qr'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black px-4 py-8 sm:px-6 sm:py-12 flex flex-col">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-row items-center justify-between gap-4 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 sm:px-4 sm:py-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white font-semibold hover:bg-neutral-800/50 transition-all w-auto flex items-center justify-center flex-shrink-0"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          </div>

        <div className="flex-1 flex items-center">
          <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full md:flex-1 space-y-6 min-w-0"
            >
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                  Destination URL
                </label>
                <div className="relative rounded-2xl border border-neutral-800/80 p-3 md:rounded-3xl md:p-4">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <div className="relative flex items-center gap-2">
                    <motion.div
                      key={inputKey}
                      initial={{ scale: 1 }}
                      animate={{ scale: [1, 1.01, 1] }}
                      transition={{ duration: 0.3 }}
                      className="flex-1"
                    >
                      <input
                        type="text"
                        value={destinationUrl}
                        onChange={(e) => setDestinationUrl(e.target.value)}
                        placeholder="Enter destination URL"
                        className="relative w-full px-5 py-3.5 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-white placeholder-neutral-500 focus:outline-none focus:ring-0 transition-all text-base"
                        disabled={loading}
                      />
                    </motion.div>
                    <button
                      onClick={handleRefresh}
                      disabled={loading || !destinationUrl.trim()}
                      className={`group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full backdrop-blur border px-4 py-3.5 font-semibold transition-all flex-shrink-0 ${
                        showCheckmark
                          ? "bg-green-500/20 border-green-500/50 text-green-400"
                          : "bg-neutral-900/50 border-neutral-700 text-white hover:bg-neutral-800/50"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {showCheckmark ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                  QR Code Link
                </label>
                <div className="relative rounded-2xl border border-neutral-800/80 p-3 md:rounded-3xl md:p-4">
                  <GlowingEffect
                    spread={40}
                    glow={true}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <a
                    href={getQrCodeUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex-1 px-5 py-3.5 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-neutral-300 hover:text-white text-sm sm:text-base truncate flex items-center gap-2 min-w-0 transition-colors"
                  >
                    <span className="truncate">
                      {truncateUrl(getQrCodeUrl(), 40)}
                    </span>
                    <ExternalLink className="h-4 w-4 flex-shrink-0 opacity-50 group-hover:opacity-100 transition-opacity" />
                  </a>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                    API Key
                  </label>
                  <button
                    onClick={handleGenerateApiKey}
                    disabled={!qrLink || apiKeyLoading}
                    className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white px-4 py-2 font-semibold transition-all hover:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                  >
                    <Key className="h-4 w-4" />
                    <span>{apiKeyLoading ? "Generating..." : "Generate"}</span>
                  </button>
                </div>
                {apiKey && (
                  <div className="relative rounded-2xl border border-neutral-800/80 p-3 md:rounded-3xl md:p-4">
                    <GlowingEffect
                      spread={40}
                      glow={true}
                      disabled={false}
                      proximity={64}
                      inactiveZone={0.01}
                    />
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-1 px-5 py-3.5 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-neutral-300 text-sm sm:text-base font-mono truncate select-all">
                        {showApiKey ? apiKey : maskApiKey(apiKey)}
                      </div>
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white px-4 py-3.5 font-semibold transition-all hover:bg-neutral-800/50 flex-shrink-0"
                        title={showApiKey ? "Hide API key" : "Show API key"}
                      >
                        {showApiKey ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={handleCopyApiKey}
                        className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white px-4 py-3.5 font-semibold transition-all hover:bg-neutral-800/50 flex-shrink-0"
                        title="Copy API key"
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4 transition-transform group-hover:scale-110" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm"
                >
                  {error}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col justify-center md:justify-start w-full md:w-auto md:flex-shrink-0 gap-4 md:mt-[40px] items-center md:items-start"
            >
              <div className="relative rounded-2xl border border-neutral-800/80 p-4 md:p-6 lg:p-8 w-full md:w-auto md:min-w-[280px] max-w-[320px]">
                <GlowingEffect
                  spread={40}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div ref={qrCodeRef} className="relative p-4 bg-neutral-900/50 backdrop-blur rounded-xl aspect-square flex items-center justify-center">
                  <QRCodeSVG
                    value={getQrCodeUrl()}
                    size={280}
                    level="H"
                    includeMargin={false}
                    className="w-full h-full max-w-full max-h-full"
                  />
                </div>
              </div>
              <button
                onClick={handleDownloadQR}
                className="w-full md:w-auto px-6 py-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white font-semibold hover:bg-neutral-800/50 transition-all flex items-center justify-center gap-2"
              >
                <Download className="h-5 w-5" />
                <span>Download QR Code</span>
              </button>
            </motion.div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
