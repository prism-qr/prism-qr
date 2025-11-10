"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Key, Trash2, AlertTriangle, Copy, Check } from "lucide-react";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  ApiKey,
  listApiKeys,
  getApiKey,
  deleteApiKey,
} from "@/lib/api/links";

interface ApiKeyManagementProps {
  linkId: string;
}

export function ApiKeyManagement({ linkId }: ApiKeyManagementProps) {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchApiKeys();
  }, [linkId]);

  const fetchApiKeys = async () => {
    try {
      const keys = await listApiKeys(linkId);
      setApiKeys(keys);
      setError("");
    } catch (err: any) {
      console.error("Failed to fetch API keys:", err);
    }
  };

  const handleGenerateApiKey = async () => {
    setLoading(true);
    setError("");
    setNewApiKey("");

    try {
      const response = await getApiKey(linkId);
      setNewApiKey(response.apiKey);
      await fetchApiKeys();
    } catch (err: any) {
      if (err.message && err.message.includes("Maximum limit reached")) {
        setError("Cannot create more API keys. Maximum limit of 5 keys reached.");
      } else {
        setError(err.message || "Failed to generate API key");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteApiKey = async () => {
    if (!keyToDelete) return;

    try {
      await deleteApiKey(linkId, keyToDelete);
      await fetchApiKeys();
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to delete API key");
    } finally {
      setDeleteConfirmOpen(false);
      setKeyToDelete(null);
    }
  };

  const openDeleteConfirmation = (keyId: string) => {
    setKeyToDelete(keyId);
    setDeleteConfirmOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmOpen(false);
    setKeyToDelete(null);
  };

  const handleCopyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return "Unknown";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-neutral-300 uppercase tracking-wide">
          API Keys ({apiKeys.length}/5)
        </label>
        <button
          onClick={handleGenerateApiKey}
          disabled={loading || apiKeys.length >= 5}
          className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white px-4 py-2 font-semibold transition-all hover:bg-neutral-800/50 disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
        >
          <Key className="h-4 w-4" />
          <span>{loading ? "Generating..." : "Generate New Key"}</span>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {newApiKey && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-3"
          >
            <div className="relative rounded-2xl border border-yellow-500/30 bg-yellow-500/5 p-3 md:rounded-3xl md:p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-yellow-400 text-sm font-semibold mb-1">
                    Save this API key now
                  </p>
                  <p className="text-yellow-500/80 text-xs">
                    You can only view this key once. Make sure to copy it before
                    generating another key or refreshing the page.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative rounded-2xl border border-neutral-800/80 p-3 md:rounded-3xl md:p-4">
              <GlowingEffect
                spread={40}
                glow={true}
                disabled={false}
                proximity={64}
                inactiveZone={0.01}
              />
              <div className="relative flex items-center gap-2">
                <div className="flex-1 px-5 py-3.5 rounded-xl bg-neutral-900/50 backdrop-blur border-0 text-white text-sm sm:text-base font-mono break-all select-all">
                  {newApiKey}
                </div>
                <button
                  onClick={() => handleCopyToClipboard(newApiKey, "new-key")}
                  className="p-3 rounded-xl bg-neutral-900/50 backdrop-blur border border-neutral-700 text-white hover:bg-neutral-800/50 transition-all flex-shrink-0"
                  title="Copy to clipboard"
                >
                  {copiedId === "new-key" ? (
                    <Check className="h-5 w-5 text-green-400" />
                  ) : (
                    <Copy className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {apiKeys.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-neutral-400 uppercase tracking-wide text-xs">
            Active Keys
          </label>
          <div className="space-y-2">
            {apiKeys.map((key) => (
              <motion.div
                key={key.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="relative rounded-xl border border-neutral-800/80 bg-neutral-900/30 p-4"
              >
                <GlowingEffect
                  spread={30}
                  glow={false}
                  disabled={false}
                  proximity={48}
                  inactiveZone={0.01}
                />
                <div className="relative flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-white font-mono text-sm">
                        {key.prefix}...
                      </code>
                      <button
                        onClick={() =>
                          handleCopyToClipboard(key.prefix, key.id)
                        }
                        className="p-1 hover:bg-neutral-800/50 rounded transition-colors"
                        title="Copy prefix"
                      >
                        {copiedId === key.id ? (
                          <Check className="h-3 w-3 text-green-400" />
                        ) : (
                          <Copy className="h-3 w-3 text-neutral-500" />
                        )}
                      </button>
                    </div>
                    <p className="text-neutral-500 text-xs">
                      Created {formatDate(key.createdAt)}
                    </p>
                  </div>
                  <button
                    onClick={() => openDeleteConfirmation(key.id)}
                    className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition-all flex-shrink-0"
                    title="Delete API key"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {apiKeys.length === 0 && !newApiKey && (
        <div className="text-center py-8">
          <Key className="h-12 w-12 text-neutral-700 mx-auto mb-3" />
          <p className="text-neutral-500 text-sm">
            No API keys yet. Generate your first key to get started.
          </p>
        </div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-sm"
        >
          {error}
        </motion.div>
      )}

      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        title="Delete API Key"
        message="Are you sure you want to delete this API key? This action cannot be undone and any applications using this key will lose access."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={handleDeleteApiKey}
        onCancel={closeDeleteConfirmation}
        variant="danger"
      />
    </div>
  );
}
