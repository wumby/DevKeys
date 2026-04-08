"use client";

import { useState } from "react";
import { motion } from "framer-motion";

import { ShortcutCombo } from "@/components/ui/shortcut-combo";
import { shortcutCategories, shortcuts } from "@/data/shortcuts";
import { getShortcutSteps } from "@/lib/shortcut-utils";
import { cn } from "@/lib/utils";

const categoryHighlights = {
  "Must know": "Start with the shortcuts you need every day before branching out.",
  Editing: "Comment, duplicate, and move lines without breaking flow.",
  Navigation: "Jump to commands, symbols, and exact lines with intent.",
  Search: "Move from find to global search without leaving the keyboard.",
  "Multi-cursor": "Train the combos that unlock the editor's real power.",
  Refactor: "Rename, fix, and inspect code without breaking concentration.",
  Terminal: "Open, split, and manage your shell faster than menus ever could.",
  UI: "Move through panels and views without reaching for the mouse.",
} as const;

export function CategoryShowcase() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const activeShortcuts = shortcuts.filter(
    (shortcut) => shortcut.category === openCategory,
  );

  return (
    <section id="categories" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-2xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9cdcfe]">
              Shortcut library
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Practice by category, not by endless reference table.
            </h2>
            <p className="text-base leading-7 text-slate-300">
              Start with the commands you hit every day, then widen the pool as
              your recall gets faster.
            </p>
          </div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
            {shortcuts.length} starter shortcuts seeded
          </p>
        </motion.div>

        <div className="mt-10 grid gap-6 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-1">
            {shortcutCategories.map((category, index) => (
              <motion.button
                key={category}
                type="button"
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: index * 0.06, duration: 0.45, ease: "easeOut" }}
                onClick={() =>
                  setOpenCategory((current) =>
                    current === category ? null : category,
                  )
                }
                className={cn(
                  "group relative overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(180deg,rgba(37,37,38,0.98),rgba(30,30,30,0.98))] p-6 text-left transition hover:-translate-y-1 hover:border-electric/50",
                  openCategory === category &&
                    "border-electric/70 bg-[linear-gradient(180deg,rgba(18,51,72,0.98),rgba(30,30,30,0.98))] shadow-[0_0_0_1px_rgba(156,220,254,0.15),0_20px_50px_rgba(0,122,204,0.14)]",
                )}
                aria-expanded={openCategory === category}
                aria-controls="category-command-list"
              >
                <div className="absolute right-4 top-4 font-mono text-5xl text-white/[0.04]">
                  0{index + 1}
                </div>
                <div
                  className={cn(
                    "absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(156,220,254,0.75),transparent)] opacity-0 transition group-hover:opacity-100",
                    openCategory === category && "opacity-100",
                  )}
                />
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                  {category}
                </p>
                <h3 className="mt-5 text-2xl font-semibold text-white">
                  {category}
                </h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                  {categoryHighlights[category]}
                </p>

                <div className="mt-6 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-[#9cdcfe]">
                  <span>
                    {shortcuts.filter((shortcut) => shortcut.category === category).length} commands
                  </span>
                  <span className="flex items-center gap-2">
                    {openCategory === category ? "Hide panel" : "Open panel"}
                    <span
                      className={cn(
                        "text-base leading-none transition-transform",
                        openCategory === category && "rotate-90",
                      )}
                    >
                      →
                    </span>
                  </span>
                </div>
              </motion.button>
            ))}
          </div>

          <motion.div
            id="category-command-list"
            key={openCategory ?? "none"}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="rounded-[24px] border-2 border-electric/60 bg-[linear-gradient(180deg,rgba(24,49,67,0.98),rgba(24,24,24,0.98))] p-6 shadow-[0_0_0_1px_rgba(156,220,254,0.16),0_24px_70px_rgba(0,122,204,0.16)] sm:p-8 xl:sticky xl:top-28 xl:max-h-[72vh] xl:overflow-auto"
          >
            {openCategory ? (
              <>
                <div className="mb-4 inline-flex items-center gap-3 rounded-full border border-electric/40 bg-electric/10 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-[#9cdcfe]">
                  <span className="h-2 w-2 rounded-full bg-electric animate-pulseGlow" />
                  {openCategory} selected
                </div>

                <div className="flex flex-col gap-3 border-b border-line/80 pb-6">
                  <div>
                    <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9cdcfe]">
                      {openCategory}
                    </p>
                    <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white">
                      Every shortcut in this category
                    </h3>
                  </div>
                  <p className="text-sm leading-7 text-slate-300">
                    The command list now stays in this panel instead of opening farther down the page.
                  </p>
                </div>

                <div className="mt-6 grid gap-4">
                  {activeShortcuts.map((shortcut, shortcutIndex) => (
                    <motion.div
                      key={shortcut.id}
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: shortcutIndex * 0.03,
                        duration: 0.3,
                        ease: "easeOut",
                      }}
                      className="rounded-[18px] border border-line bg-[#202022] p-5"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="max-w-xl">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-xl font-semibold text-white">
                              {shortcut.action}
                            </h4>
                            <span className="rounded-full border border-electric/30 bg-electric/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.22em] text-[#9cdcfe]">
                              {shortcut.difficulty}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-7 text-slate-300">
                            {shortcut.description}
                          </p>
                        </div>

                        <div className="grid gap-4 lg:min-w-[320px]">
                          <div>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                              Mac
                            </p>
                            <ShortcutCombo
                              steps={getShortcutSteps(shortcut, "mac")}
                              size="sm"
                            />
                          </div>
                          <div>
                            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.24em] text-muted">
                              Windows
                            </p>
                            <ShortcutCombo
                              steps={getShortcutSteps(shortcut, "windows")}
                              size="sm"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-muted">
                  Command panel idle
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-white">
                  Choose a category to inspect the shortcuts.
                </h3>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
                  The selected category opens here in place, so the home page keeps its position when you come back to it.
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
