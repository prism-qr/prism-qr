"use client";

import { motion } from "motion/react";
import { CloudUpload, Lock, Plug, Shield, Terminal, Zap } from "lucide-react";
import { GridItem } from "./GridItem";

interface PainPoint {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

interface Solution {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const painPoints: PainPoint[] = [
  {
    icon: Terminal,
    title: 'Printed 5,000 QR codes. Typo in the URL.',
    description:
      "Static QR codes are permanent. One mistake means reprinting everything. Thousands of dollars down the drain.",
  },
  {
    icon: CloudUpload,
    title: "Which QR code is working? No idea.",
    description:
      "You've placed codes everywhere - flyers, business cards, product packaging. But you have zero visibility into which ones are actually being scanned.",
  },
  {
    icon: Zap,
    title: "Campaign ended, QR code didn't",
    description: "Your promotion is over but those QR codes are still out there, pointing to an outdated landing page. Can't update them now.",
  },
];

const solutions: Solution[] = [
  {
    icon: Lock,
    title: "Update anytime, anywhere",
    description:
      "Change your QR code destination instantly without reprinting. Made a mistake? Fix it in seconds. Campaign ended? Point to something new.",
  },
  {
    icon: Plug,
    title: "Analytics coming soon",
    description:
      "See exactly how many scans each code gets, where they're coming from, and when. Make data-driven decisions about your marketing.",
  },
  {
    icon: Shield,
    title: "IoT & API integration",
    description:
      "Create API keys per link. Let your Arduino or Raspberry Pi update QR destinations based on sensor data. Perfect for smart environments.",
  },
];

export function ComplianceSection() {
  return (
    <section className="relative md:py-24 py-8 px-6 max-w-5xl mx-auto">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0, 1, 0, 1] }}
        >
          <h2 className="text-3xl font-bold text-white md:text-5xl mb-4">
            Stop{" "}
            <span className="relative inline-block">
              <span className=" decoration-red-600 decoration-2 underline-offset-4">
                wasting money
              </span>
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 to-red-600/10 blur-sm -z-10" />
            </span>{" "}
            on static QR codes
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Dynamic QR codes save time, money, and headaches
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-1 lg:gap-4">
          <GridItem
            area="md:[grid-area:1/1/2/7]"
            title="Using static QR codes"
            description={
              <div className="space-y-4 mt-4">
                {painPoints.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 rounded-lg bg-red-600/10 border border-red-600/20 p-2">
                        <IconComponent className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <h4 className="text-foreground text-lg mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm font-light text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          />

          <GridItem
            area="md:[grid-area:1/7/2/13]"
            title="Using Prism QR"
            description={
              <div className="space-y-4 mt-4">
                {solutions.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <div key={index} className="flex items-start gap-4">
                      <div className="mt-1 rounded-lg bg-green-600/10 border border-green-600/20 p-2">
                        <IconComponent className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <h4 className="text-foreground text-lg mb-1">
                          {item.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            }
          />
        </ul>
      </div>
    </section>
  );
}

