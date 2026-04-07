"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { ShortcutCombo } from "@/components/ui/shortcut-combo";

const floatingCombos = [
  ["Cmd", "Shift", "P"],
  ["Ctrl", "`"],
  ["Cmd", "D"],
  ["Cmd", "P"],
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-12 sm:px-6 lg:px-8 lg:pb-28 lg:pt-20">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-md border border-electric/40 bg-electric/10 px-4 py-2 text-sm text-[#9cdcfe]">
            <span className="h-2 w-2 rounded-full bg-electric animate-pulseGlow" />
            Practice shortcuts like a skill, not a checklist
          </div>
          <div className="space-y-6">
            <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] text-white sm:text-6xl lg:text-7xl">
              <span className="text-gradient">DevKeys</span> turns VS Code
              shortcuts into muscle memory.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
              Drill the commands you actually use, build streaks, and train your
              fingers to react before your brain reaches for the mouse.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/practice"
              className="inline-flex items-center justify-center rounded-md bg-electric px-6 py-3.5 text-base font-semibold text-white transition hover:bg-cyan"
            >
              Start Practicing
            </Link>
            <Link
              href="/#categories"
              className="inline-flex items-center justify-center rounded-md border border-line bg-panel px-6 py-3.5 text-base font-semibold text-white transition hover:border-electric/40 hover:bg-[#2d2d30]"
            >
              Browse Shortcuts
            </Link>
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-muted">
            <span className="rounded-md border border-line bg-panel px-3 py-2">
              Built for fast reps
            </span>
            <span className="rounded-md border border-line bg-panel px-3 py-2">
              Mac and Windows combos
            </span>
            <span className="rounded-md border border-line bg-panel px-3 py-2">
              Session resets on refresh
            </span>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,122,204,0.16),transparent_55%)] blur-3xl" />
          <div className="relative overflow-hidden rounded-[24px] border border-line bg-[linear-gradient(180deg,rgba(37,37,38,0.98),rgba(30,30,30,0.98))] p-4 shadow-glow sm:p-6">
            <div className="flex items-center justify-between rounded-[14px] border border-line bg-[#252526] px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-[#f14c4c]" />
                <span className="h-3 w-3 rounded-full bg-[#cca700]" />
                <span className="h-3 w-3 rounded-full bg-[#89d185]" />
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted">
                Practice Arena
              </p>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[16px] border border-line bg-[#1f1f1f] p-5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                    Current Drill
                  </p>
                  <span className="rounded-md border border-electric/40 bg-electric/10 px-3 py-1 text-xs text-[#9cdcfe]">
                    streak x7
                  </span>
                </div>
                <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
                  Open Command Palette
                </h2>
                <div className="mt-8">
                  <ShortcutCombo keys={["Cmd", "Shift", "P"]} size="lg" />
                </div>
              </div>

              <div className="space-y-4">
                {floatingCombos.map((combo, index) => (
                  <motion.div
                    key={combo.join("-")}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 * index, duration: 0.45 }}
                    className="rounded-[16px] border border-line bg-[#2d2d30] p-4"
                  >
                    <p className="mb-3 text-xs uppercase tracking-[0.24em] text-muted">
                      Combo {index + 1}
                    </p>
                    <ShortcutCombo keys={combo} />
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-4 rounded-[18px] border border-line bg-[linear-gradient(90deg,rgba(0,122,204,0.1),rgba(37,37,38,0.96))] p-5">
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-200">
                <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.24em]">
                  mastery
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.24em]">
                  speed
                </span>
                <span className="rounded-full bg-black/20 px-3 py-1 font-mono text-xs uppercase tracking-[0.24em]">
                  focus
                </span>
              </div>
              <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
                The interface feels like a training room instead of a cheat
                sheet: one prompt, one combo, one rep at a time.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
