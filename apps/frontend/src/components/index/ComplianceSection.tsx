"use client";

import { motion } from "motion/react";
import { Activity, Lock, Plug, Zap } from "lucide-react";

interface Advantage {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  badge?: string;
}

const advantages: Advantage[] = [
  {
    icon: Zap,
    title: "Update instantly, from anywhere",
    description:
      "Change your QR code destination in seconds. Fix typos, pivot campaigns, or update content without reprinting a single code.",
  },
  {
    icon: Lock,
    title: "Security & Control",
    description:
      "Maintain full control over your QR codes. Disable compromised links instantly, set expiration dates, and protect your brand with secure, manageable destinations.",
  },
  {
    icon: Activity,
    title: "Track performance in real-time",
    description:
      "See exactly which codes get scanned, where your audience is located, and what devices they use.",
    badge: "Coming Soon",
  },
  {
    icon: Plug,
    title: "API & IoT Integration",
    description:
      "Generate API keys per link. Connect your Arduino, Raspberry Pi, or smart sensors to dynamically update QR destinations.",
  },
];

export function ComplianceSection() {
  return (
    <section className="relative md:py-24 py-8 px-6 max-w-7xl mx-auto">
      <div className="mx-auto">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0, 1, 0, 1] }}
        >
          <h2 className="text-3xl font-bold text-white md:text-5xl mb-4">
            The{" "}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Power
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-lg -z-10" />
            </span>{" "}
            of Dynamic QR Codes
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Making QR codes smarter, one scan at a time
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {advantages.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={index}
                className="group relative rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900/50 to-neutral-900/30 p-6 backdrop-blur-sm transition-all duration-300 hover:border-neutral-700 hover:shadow-xl hover:shadow-purple-500/10"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur" />
                
                <div className="relative">
                  <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 p-3 ring-1 ring-inset ring-purple-500/20">
                    <IconComponent className="h-6 w-6 text-purple-400" />
                  </div>

                  {item.badge && (
                    <span className="absolute top-0 right-0 inline-flex items-center rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 px-3 py-1 text-xs font-medium text-purple-400 ring-1 ring-inset ring-purple-500/20">
                      {item.badge}
                    </span>
                  )}

                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-purple-300 transition-colors">
                    {item.title}
                  </h3>
                  
                  <p className="text-sm leading-relaxed text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

