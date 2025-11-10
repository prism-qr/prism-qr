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
    title: "Dynamic destination links",
    description:
      "Update your QR code destination anytime without reprinting. Perfect for campaigns, menus, events, or any content that changes over time.",
    area: "md:[grid-area:1/1/2/7] xl:[grid-area:1/1/2/5]",
  },
  {
    icon: KeyRound,
    title: "IoT & API integration",
    description:
      "Create API keys per link. Control QR destinations from Arduino, Raspberry Pi, or any IoT device. Build smart, sensor-driven experiences.",
    area: "md:[grid-area:1/7/2/13] xl:[grid-area:2/1/3/5]",
  },
  {
    icon: Shield,
    title: "Analytics coming soon",
    description:
      "Track scans, locations, and device types. Understand your audience and optimize your QR code strategy with real data.",
    area: "md:[grid-area:2/1/3/7] xl:[grid-area:1/5/3/8]",
  },
  {
    icon: Users,
    title: "Custom short links",
    description:
      "Get clean, memorable short URLs for your QR codes. Easy to share and professional-looking for your brand.",
    area: "md:[grid-area:2/7/3/13] xl:[grid-area:1/8/2/13]",
  },
  {
    icon: Zap,
    title: "Free & open source",
    description:
      "Always free to use. Open source and transparent. No hidden costs, no vendor lock-in. Use it for hobby projects or business needs.",
    area: "md:[grid-area:3/1/4/13] xl:[grid-area:2/8/3/13]",
  },
];

export function WhyCryptlySection() {
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
            Why choose Prism QR?
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Dynamic QR codes with features that grow with your needs
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

