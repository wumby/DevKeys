"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { PracticeCard } from "@/components/practice/practice-card";
import { PlatformToggle } from "@/components/practice/platform-toggle";
import { SessionStats } from "@/components/practice/session-stats";
import { CategoryPills } from "@/components/ui/category-pills";
import { shortcutCategories, shortcuts } from "@/data/shortcuts";
import { Platform } from "@/lib/shortcut-utils";
import { ShortcutCategory } from "@/types/shortcut";

type ResultState = "correct" | "missed";

export default function PracticePage() {
  const [platform, setPlatform] = useState<Platform>("mac");
  const [activeCategory, setActiveCategory] = useState<ShortcutCategory | "All">(
    "All",
  );
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [streak, setStreak] = useState(0);
  const [results, setResults] = useState<Record<string, ResultState>>({});

  const filteredShortcuts = useMemo(() => {
    if (activeCategory === "All") {
      return shortcuts;
    }

    return shortcuts.filter((shortcut) => shortcut.category === activeCategory);
  }, [activeCategory]);

  const currentShortcut = filteredShortcuts[currentIndex] ?? null;
  const correctCount = Object.values(results).filter(
    (result) => result === "correct",
  ).length;

  useEffect(() => {
    setCurrentIndex(0);
    setShowAnswer(false);
  }, [activeCategory]);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex, platform]);

  function handleSelectCategory(category: ShortcutCategory | "All") {
    setActiveCategory(category);
  }

  function handleMark(result: ResultState) {
    if (!currentShortcut) {
      return;
    }

    if (result === "correct" && results[currentShortcut.id]) {
      return;
    }

    if (result === "correct") {
      setResults((previous) => ({
        ...previous,
        [currentShortcut.id]: "correct",
      }));
      setStreak((previous) => previous + 1);
      setCurrentIndex((previous) =>
        Math.min(previous + 1, filteredShortcuts.length - 1),
      );
      return;
    }

    setStreak(0);
  }

  function goToPrevious() {
    setCurrentIndex((previous) => Math.max(previous - 1, 0));
  }

  function goToNext() {
    setCurrentIndex((previous) =>
      Math.min(previous + 1, filteredShortcuts.length - 1),
    );
  }

  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9cdcfe]">
              Practice mode
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Train one shortcut at a time.
            </h1>
            <p className="text-base leading-7 text-slate-300">
              Use the current session as a quick recall run. Switch platform,
              narrow the category, reveal the combo only when needed, and keep
              your streak honest.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <PlatformToggle value={platform} onChange={setPlatform} />
            <Link
              href="/"
              className="text-sm text-muted transition hover:text-white"
            >
              Back to landing page
            </Link>
          </div>
        </div>

        <SessionStats
          current={filteredShortcuts.length === 0 ? 0 : currentIndex + 1}
          total={filteredShortcuts.length}
          correct={correctCount}
          streak={streak}
        />

        <div className="rounded-[20px] border border-line bg-panel/95 p-4 sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                Filter the drill set
              </p>
              <CategoryPills
                categories={["All", ...shortcutCategories]}
                activeCategory={activeCategory}
                onSelect={handleSelectCategory}
              />
            </div>
            <p className="text-sm text-muted">
              {filteredShortcuts.length} prompts in this run
            </p>
          </div>
        </div>

        {currentShortcut ? (
          <PracticeCard
            shortcut={currentShortcut}
            platform={platform}
            showAnswer={showAnswer}
            onToggleAnswer={() => setShowAnswer((previous) => !previous)}
            onMarkCorrect={() => handleMark("correct")}
            onMarkMissed={() => handleMark("missed")}
            onNext={goToNext}
            onPrevious={goToPrevious}
            canGoPrevious={currentIndex > 0}
            canGoNext={currentIndex < filteredShortcuts.length - 1}
            result={results[currentShortcut.id]}
          />
        ) : (
          <div className="rounded-[24px] border border-dashed border-line bg-panel/70 px-6 py-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
              Empty practice set
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white">
              No shortcuts match this filter.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-slate-300">
              Switch back to another category to keep the session going. The
              first version uses only the in-memory starter dataset.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
