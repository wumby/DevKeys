"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PracticeCard } from "@/components/practice/practice-card";
import { PlatformToggle } from "@/components/practice/platform-toggle";
import { SessionStats } from "@/components/practice/session-stats";
import { shortcuts } from "@/data/shortcuts";
import { Platform } from "@/lib/shortcut-utils";
import { Shortcut } from "@/types/shortcut";

type ResultState = "correct" | "missed";
type SessionStatus = "idle" | "running" | "paused" | "completed";

const RUN_SIZE = 10;

function formatElapsedTime(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const centiseconds = Math.floor((milliseconds % 1000) / 10);

  return `${minutes}:${seconds.toString().padStart(2, "0")}.${centiseconds
    .toString()
    .padStart(2, "0")}`;
}

function getRandomRun(pool: Shortcut[], size: number) {
  const shuffled = [...pool];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = current;
  }

  return shuffled.slice(0, Math.min(size, shuffled.length));
}

export default function PracticePage() {
  const [platform, setPlatform] = useState<Platform>("mac");
  const [showAnswer, setShowAnswer] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<Record<string, ResultState>>({});
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>("idle");
  const [sessionShortcuts, setSessionShortcuts] = useState<Shortcut[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [completedTime, setCompletedTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  const currentShortcut = sessionShortcuts[currentIndex] ?? null;
  const correctCount = Object.values(results).filter(
    (result) => result === "correct",
  ).length;

  useEffect(() => {
    if (sessionStatus !== "running" || startedAt === null) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedTime(Date.now() - startedAt);
    }, 50);

    return () => window.clearInterval(interval);
  }, [sessionStatus, startedAt]);

  useEffect(() => {
    setShowAnswer(false);
  }, [currentIndex, platform, sessionStatus]);

  function resetToStart() {
    setSessionStatus("idle");
    setSessionShortcuts([]);
    setResults({});
    setCurrentIndex(0);
    setElapsedTime(0);
    setCompletedTime(null);
    setStartedAt(null);
    setShowAnswer(false);
  }

  function startSession() {
    const now = Date.now();

    setSessionShortcuts(getRandomRun(shortcuts, RUN_SIZE));
    setResults({});
    setCurrentIndex(0);
    setElapsedTime(0);
    setCompletedTime(null);
    setStartedAt(now);
    setShowAnswer(false);
    setSessionStatus("running");
  }

  function pauseSession() {
    if (sessionStatus !== "running" || startedAt === null) {
      return;
    }

    setElapsedTime(Date.now() - startedAt);
    setStartedAt(null);
    setSessionStatus("paused");
  }

  function resumeSession() {
    if (sessionStatus !== "paused") {
      return;
    }

    setStartedAt(Date.now() - elapsedTime);
    setSessionStatus("running");
  }

  function handleMark(result: ResultState) {
    if (!currentShortcut) {
      return;
    }

    if (result === "correct" && results[currentShortcut.id]) {
      return;
    }

    if (result === "correct") {
      const nextIndex = currentIndex + 1;

      setResults((previous) => ({
        ...previous,
        [currentShortcut.id]: "correct",
      }));

      if (nextIndex >= sessionShortcuts.length) {
        const finishedTime = startedAt === null ? elapsedTime : Date.now() - startedAt;
        setCompletedTime(finishedTime);
        setElapsedTime(finishedTime);
        setSessionStatus("completed");
        return;
      }

      setCurrentIndex(nextIndex);
      return;
    }

    setResults((previous) => ({
      ...previous,
      [currentShortcut.id]: "missed",
    }));
  }

  return (
    <section className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-5">
        {sessionStatus === "running" || sessionStatus === "paused" ? (
          <div className="flex flex-col gap-4 rounded-[24px] border border-line bg-panel/70 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#9cdcfe]">
                Practice mode
              </p>
              <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Timed practice arena
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <PlatformToggle value={platform} onChange={setPlatform} />
              <Link
                href="/"
                className="text-sm text-muted transition hover:text-white"
              >
                Back to landing page
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9cdcfe]">
                Practice mode
              </p>
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                Timed practice arena.
              </h1>
              <p className="text-base leading-7 text-slate-300">
                Start a run to get 10 random shortcuts from the full library. The
                timer starts immediately and every retry rerolls a fresh set.
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
        )}

        {(sessionStatus === "running" || sessionStatus === "paused") &&
        currentShortcut ? (
          <>
            <div className="grid gap-3 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
              <SessionStats
                current={currentIndex + 1}
                total={sessionShortcuts.length}
                correct={correctCount}
                time={formatElapsedTime(elapsedTime)}
                compact
              />

              <div className="flex flex-wrap gap-3 xl:justify-end">
                <button
                  type="button"
                  onClick={sessionStatus === "paused" ? resumeSession : pauseSession}
                  className="rounded-md border border-line bg-panel px-4 py-3 text-sm font-semibold text-white transition hover:border-electric/40 hover:bg-[#2d2d30]"
                >
                  {sessionStatus === "paused" ? "Resume" : "Pause"}
                </button>
                <button
                  type="button"
                  onClick={startSession}
                  className="rounded-md border border-electric/50 bg-electric px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan"
                >
                  Restart Run
                </button>
              </div>
            </div>

            <PracticeCard
              shortcut={currentShortcut}
              platform={platform}
              showAnswer={showAnswer}
              onToggleAnswer={() => setShowAnswer((previous) => !previous)}
              onMarkCorrect={() => handleMark("correct")}
              onMarkMissed={() => handleMark("missed")}
              result={results[currentShortcut.id]}
              paused={sessionStatus === "paused"}
            />
          </>
        ) : sessionStatus === "completed" ? (
          <div className="space-y-6">
            <div className="rounded-[24px] border border-electric/50 bg-[linear-gradient(180deg,rgba(18,51,72,0.98),rgba(24,24,24,0.98))] p-8 shadow-glow">
              <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#9cdcfe]">
                Run complete
              </p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">
                Finished in {formatElapsedTime(completedTime ?? elapsedTime)}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300">
                You cleared all {sessionShortcuts.length} prompts in this run.
                Retry to get a completely new random ten from the full shortcut
                pool.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  type="button"
                  onClick={startSession}
                  className="rounded-md border border-electric/50 bg-electric px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan"
                >
                  Retry New Random 10
                </button>
                <button
                  type="button"
                  onClick={resetToStart}
                  className="rounded-md border border-line bg-panel px-6 py-3 text-sm font-semibold text-white transition hover:border-electric/40 hover:bg-[#2d2d30]"
                >
                  Back To Start
                </button>
              </div>
            </div>

            <SessionStats
              current={sessionShortcuts.length}
              total={sessionShortcuts.length}
              correct={correctCount}
              time={formatElapsedTime(completedTime ?? elapsedTime)}
            />
          </div>
        ) : (
          <div className="rounded-[24px] border border-line bg-[linear-gradient(180deg,rgba(37,37,38,0.98),rgba(24,24,24,0.98))] px-6 py-16 text-center shadow-glow">
            <p className="font-mono text-xs uppercase tracking-[0.24em] text-[#9cdcfe]">
              Timed practice run
            </p>
            <h2 className="mt-4 text-3xl font-semibold text-white sm:text-4xl">
              Start a 10-command sprint.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-300">
              The timer starts as soon as the run begins. You will get ten random
              shortcuts, one at a time, and each retry will reshuffle a brand-new
              set from the entire library.
            </p>
            <button
              type="button"
              onClick={startSession}
              className="mt-8 rounded-md border border-electric/50 bg-electric px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan"
            >
              Start Timed Run
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
