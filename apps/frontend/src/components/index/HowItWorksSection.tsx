"use client";

import { motion } from "motion/react";
import { Fingerprint, Server, Terminal } from "lucide-react";
import { GridItem } from "./GridItem";

interface Step {
  icon: React.ComponentType<{ className?: string }>;
  number: string;
  title: string;
  description: string;
  area: string;
  iconColor: string;
  iconBgColor: string;
  iconBorderColor: string;
}

const steps: Step[] = [
  {
    icon: Fingerprint,
    number: "1",
    title: "Create your dynamic QR",
    description:
      "Sign up free and generate your first QR code instantly. Point it to any URL - website, menu, social profile, or landing page. Download and start using immediately.",
    area: "md:[grid-area:1/1/2/5]",
    iconColor: "text-green-600",
    iconBgColor: "bg-green-600/10",
    iconBorderColor: "border-green-900/80",
  },
  {
    icon: Terminal,
    number: "2",
    title: "Update anytime you want",
    description:
      "Change the destination URL whenever needed from your dashboard or API. No reprinting, no waiting. Found a typo? Fixed instantly. Campaign pivot? Updated in seconds.",
    area: "md:[grid-area:1/5/2/9]",
    iconColor: "text-blue-600",
    iconBgColor: "bg-blue-600/10",
    iconBorderColor: "border-blue-900/80",
  },
  {
    icon: Server,
    number: "3",
    title: "Scale & automate",
    description:
      "Track performance with analytics (coming soon). Connect IoT devices via API keys. Build smart systems where sensors dynamically control QR destinations in real-time.",
    area: "md:[grid-area:1/9/2/13]",
    iconColor: "text-purple-600",
    iconBgColor: "bg-purple-600/10",
    iconBorderColor: "border-purple-900/80",
  },
];

export function HowItWorksSection() {
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
            How it works
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            From creation to automation in three simple steps
          </p>
        </motion.div>

        <ul className="grid grid-cols-1 grid-rows-none gap-4 md:grid-cols-12 md:grid-rows-1 lg:gap-4">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <GridItem
                key={index}
                area={step.area}
                icon={<IconComponent className={`h-5 w-5 ${step.iconColor}`} />}
                title={`${step.number}. ${step.title}`}
                description={step.description}
                iconBgColor={step.iconBgColor}
                iconBorderColor={step.iconBorderColor}
              />
            );
          })}
        </ul>
      </div>
    </section>
  );
}

