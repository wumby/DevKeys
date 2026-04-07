"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/home/section-heading";

const steps = [
  {
    title: "Pick a lane",
    description:
      "Jump into a mixed set or narrow your reps to editing, search, terminal, navigation, or file flow.",
  },
  {
    title: "Recall before reveal",
    description:
      "See the action first, test yourself, then flip the answer when you need it. No passive reading.",
  },
  {
    title: "Track the run",
    description:
      "Keep your streak alive, mark misses honestly, and repeat until the combo feels automatic.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-10">
        <SectionHeading
          eyebrow="How it works"
          title="Three simple steps. Built for repetition."
          description="DevKeys strips the practice loop down to the part that matters: fast recall, clear feedback, and enough momentum to keep going."
        />

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
              className="rounded-[20px] border border-line bg-panel/90 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]"
            >
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                Step 0{index + 1}
              </p>
              <h3 className="mt-6 text-2xl font-semibold text-white">
                {step.title}
              </h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
