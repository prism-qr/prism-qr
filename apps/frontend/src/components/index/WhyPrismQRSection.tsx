"use client";

import { motion } from "motion/react";
import { KeyRound, Lock, Shield, Users, Zap } from "lucide-react";
import { GridItem } from "./GridItem";

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  area: string;
}

const features: Feature[] = [
  {
    icon: Lock,
    title: "Dynamic destinations",
    description:
      "Update your QR code's target URL anytime without reprinting. Perfect for seasonal campaigns, rotating menus, event schedules, or any content that evolves.",
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
  },
  {
    icon: KeyRound,
    title: "IoT & API power",
    description:
      "Create dedicated API keys for each link. Let your IoT devices - Arduino, ESP32, Raspberry Pi - update destinations based on real-time data. Build truly smart experiences.",
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
  },
  {
    icon: Shield,
    title: "Analytics dashboard",
    description:
      "Coming soon: Track every scan with detailed analytics. See geographic distribution, device types, peak times, and conversion patterns to optimize your strategy.",
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
  },
  {
    icon: Users,
    title: "Clean short URLs",
    description:
      "Get memorable, branded short links for every QR code. Easy to type, professional-looking, and perfect for sharing across all channels.",
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
  },
  {
    icon: Zap,
    title: "Forever free & open",
    description:
      "100% free to use with no limits. Fully open source and transparent. No vendor lock-in, no surprise fees. Use it for passion projects or scale to enterprise.",
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
  },
];

export function WhyPrismQRSection() {
  return (
    <section className="relative md:py-24 py-8 px-6">
      <div className="mx-auto max-w-6xl">
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, ease: [0, 1, 0, 1] }}
        >
          <h2 className="text-4xl font-bold text-white md:text-5xl">
            Why Prism QR?
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Dynamic QR codes that grow with your ambitions
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-3 lg:gap-4 xl:max-h-[34rem] xl:grid-rows-2">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <GridItem
                key={index}
                area={feature.area}
                icon={<IconComponent className="h-5 w-5 text-green-600" />}
                title={feature.title}
                description={feature.description}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}

