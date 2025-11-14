"use client";

import { motion } from "motion/react";
import { ArrowRight, CloudUpload, Lock, Plug, Sparkles } from "lucide-react";
import { GitHubIcon } from "@/components/ui/GitHubIcon";

export function IntegrationsSection() {
  return (
    <section className="relative md:py-24 py-8 px-6 overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0, 1, 0, 1] }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-4 py-2 mb-6 backdrop-blur ring-1 ring-inset ring-purple-500/20">
            <Plug className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-purple-300">Integrations</span>
          </div>
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                One click sync
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg -z-10" />
            </span>
          </h2>
          <p className="mt-4 text-lg text-neutral-400 max-w-2xl mx-auto">
            Connect your tools and sync your secrets instantly. No manual
            copying, no hassle.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute inset-0 -top-32 flex items-center justify-center opacity-30">
            <div className="h-96 w-96 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-3xl" />
          </div>

          <motion.div
            className="relative rounded-3xl border border-purple-500/20 bg-gradient-to-br from-neutral-900/50 to-neutral-950 p-8 md:p-12 backdrop-blur-xl"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0, 0.55, 0.45, 1] }}
          >
            <div className="text-center py-12 space-y-6">
              <div className="inline-flex rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-4 ring-1 ring-inset ring-purple-500/20">
                <Sparkles className="h-12 w-12 text-purple-400" />
              </div>
              <div className="space-y-3 max-w-xl mx-auto">
                <h3 className="text-2xl font-bold text-white">
                  More integrations coming soon
                </h3>
                <p className="text-neutral-400 text-lg">
                  We&apos;re happy to add integrations for other platforms! Let us
                  know what you need and we&apos;ll prioritize it.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

