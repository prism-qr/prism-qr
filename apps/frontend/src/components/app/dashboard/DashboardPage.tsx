"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAuthStore } from "@/lib/store/auth-store";
import { motion } from "motion/react";
import { useRouter } from "next/router";
import { QRCodeSVG } from "qrcode.react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import {
  RefreshCw,
  ExternalLink,
  Check,
  LogOut,
  Download,
  Plus,
  Trash2,
} from "lucide-react";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import {
  Link,
  getLinks,
  createLink,
  updateLink,
  deleteLink,
  generateRandomLinkName,
} from "@/lib/api/links";
import { ApiKeyManagement } from "./ApiKeyManagement";
import { UserInfoBox } from "./UserInfoBox";
import { getCurrentUser, User } from "@/lib/api/user";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";

export function DashboardPage() {
  const loginStore = useAuthStore();
  const router = useRouter();
  const [links, setLinks] = useState<Link[]>([]);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [destinationUrl, setDestinationUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isMounted, setIsMounted] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const checkmarkTimer = useRef<NodeJS.Timeout | null>(null);
  const qrCodeRef = useRef<HTMLDivElement | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState<string | null>(null);

  const selectedLink = links.find((link) => link.id === selectedLinkId);

  useEffect(() => {
    setIsMounted(true);
    fetchUserLinks();
    fetchUser();

    return () => {
      if (checkmarkTimer.current) {
        clearTimeout(checkmarkTimer.current);
      }
    };
  }, []);

  const fetchUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setUserLoading(false);
    }
  };

  const fetchUserLinks = async () => {
    try {
      const fetchedLinks = await getLinks();
      setLinks(fetchedLinks);
      if (fetchedLinks.length > 0 && !selectedLinkId) {
        setSelectedLinkId(fetchedLinks[0].id);
        setDestinationUrl(fetchedLinks[0].destination);
      }
    } catch (err) {
      console.error("Failed to fetch user links:", err);
    } finally {
      setIsInitialLoad(false);
    }
  };

  useEffect(() => {
    if (selectedLink) {
      setDestinationUrl(selectedLink.destination);
    }
  }, [selectedLinkId]);

  const getQrCodeUrl = () => {
    const frontendUrl = process.env.NEXT_PUBLIC_FRONTEND_URL 
      || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000');
    
    if (selectedLink) {
      return `${frontendUrl}/r/${selectedLink.name}`;
    }
    return `${frontendUrl}/r/loading`;
  };

  const handleLogout = () => {
    loginStore.logout();
    router.push("/auth/login");
  };

  const updateLinkDestination = useCallback(
    async (linkId: string, destination: string, showSuccess = false) => {
      if (!destination.trim()) return;

      setLoading(true);
      setError("");

      try {
        const updatedLink = await updateLink(linkId, destination.trim());
        setLinks((prevLinks) =>
          prevLinks.map((link) => (link.id === linkId ? updatedLink : link))
        );

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
        setError(err.message || "Failed to update link");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleDeleteLink = async () => {
    if (!linkToDelete) return;

    setError("");

    try {
      await deleteLink(linkToDelete);
      setLinks((prevLinks) => prevLinks.filter((link) => link.id !== linkToDelete));
      
      if (selectedLinkId === linkToDelete) {
        const remainingLinks = links.filter((link) => link.id !== linkToDelete);
        if (remainingLinks.length > 0) {
          setSelectedLinkId(remainingLinks[0].id);
          setDestinationUrl(remainingLinks[0].destination);
        } else {
          setSelectedLinkId(null);
          setDestinationUrl("");
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to delete link");
    } finally {
      setDeleteConfirmOpen(false);
      setLinkToDelete(null);
    }
  };

  const openDeleteConfirmation = (linkId: string) => {
    setLinkToDelete(linkId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmOpen(false);
    setLinkToDelete(null);
  };

  const handleRefresh = async () => {
    if (!destinationUrl.trim() || !selectedLinkId) return;

    setInputKey((prev) => prev + 1);
    await updateLinkDestination(selectedLinkId, destinationUrl, true);
  };

  const handleCreateNewLink = async () => {
    if (links.length >= 3) {
      setError("Maximum of 3 links reached");
      return;
    }

    setIsCreating(true);
    setError("");

    try {
      const name = generateRandomLinkName(5);
      const newLink = await createLink(name, "https://example.com");
      setLinks((prevLinks) => [...prevLinks, newLink]);
      setSelectedLinkId(newLink.id);
      setDestinationUrl(newLink.destination);
    } catch (err: any) {
      setError(err.message || "Failed to create link");
    } finally {
      setIsCreating(false);
    }
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  const handleDownloadQR = () => {
    if (!qrCodeRef.current) return;

    const svgElement = qrCodeRef.current.querySelector("svg");
    if (!svgElement) return;

    const svgData = new XMLSerializer().serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `qr-code-${selectedLink?.name || "qr"}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      });
    };

    img.src =
      "data:image/svg+xml;base64," +
      btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-black px-4 py-8 sm:px-6 sm:py-12 flex flex-col">
        <div className="max-w-6xl mx-auto w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              Dashboard
            </h1>
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <div className="flex-1 sm:flex-initial min-w-0">
                <UserInfoBox user={currentUser} loading={userLoading} />
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 sm:px-4 sm:py-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white font-semibold hover:bg-neutral-800/50 transition-all flex items-center justify-center flex-shrink-0"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide mb-4">
              Your Links ({links.length}/3)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {links.map((link) => (
                <motion.div
                  key={link.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`group relative rounded-2xl border p-4 transition-all ${
                    selectedLinkId === link.id
                      ? "border-white/30 bg-neutral-900/80"
                      : "border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700"
                  }`}
                >
                  <GlowingEffect
                    spread={40}
                    glow={selectedLinkId === link.id}
                    disabled={false}
                    proximity={64}
                    inactiveZone={0.01}
                  />
                  <button
                    onClick={() => setSelectedLinkId(link.id)}
                    className="relative w-full text-left"
                  >
                    <div className="text-white font-semibold mb-1 font-mono">
                      {link.name}
                    </div>
                    <div className="text-neutral-400 text-sm truncate">
                      {truncateUrl(link.destination, 30)}
                    </div>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openDeleteConfirmation(link.id);
                    }}
                    className="absolute top-3 right-3 p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all opacity-0 group-hover:opacity-100"
                    title="Delete link"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}

              {links.length < 3 && (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleCreateNewLink}
                  disabled={isCreating}
                  className="relative rounded-2xl border border-dashed border-neutral-700 bg-neutral-900/30 p-4 text-left transition-all hover:border-neutral-600 hover:bg-neutral-900/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-h-[80px]"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Plus className="h-8 w-8 text-neutral-500" />
                    <span className="text-neutral-500 text-sm font-semibold">
                      {isCreating ? "Creating..." : "Create New Link"}
                    </span>
                  </div>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {selectedLink && (
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
                            <>
                              <Check className="h-4 w-4" />
                              <span className="hidden sm:inline">Updated</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180" />
                              <span className="hidden sm:inline">Update</span>
                            </>
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

                  <ApiKeyManagement linkId={selectedLink.id} />

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
                    <div
                      ref={qrCodeRef}
                      className="relative p-4 bg-neutral-900/50 backdrop-blur rounded-xl aspect-square flex items-center justify-center"
                    >
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
        )}

        <ConfirmDialog
          isOpen={deleteConfirmOpen}
          title="Delete Link"
          message="Are you sure you want to delete this link? This action cannot be undone. All associated API keys will also be deleted."
          confirmLabel="Delete"
          cancelLabel="Cancel"
          onConfirm={handleDeleteLink}
          onCancel={closeDeleteConfirmation}
          variant="danger"
        />
      </div>
    </ProtectedRoute>
  );
}
