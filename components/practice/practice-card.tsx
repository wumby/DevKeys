"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { ShortcutCombo } from "@/components/ui/shortcut-combo";
import {
  eventToStep,
  getShortcutDisplayText,
  getShortcutSteps,
  isStepPrefix,
  Platform,
  stepsMatch,
} from "@/lib/shortcut-utils";
import { Shortcut } from "@/types/shortcut";

type PracticeCardProps = {
  shortcut: Shortcut;
  platform: Platform;
  showAnswer: boolean;
  onToggleAnswer: () => void;
  onMarkCorrect: () => void;
  onMarkMissed: () => void;
  paused?: boolean;
  result?: "correct" | "missed";
};

export function PracticeCard({
  shortcut,
  platform,
  showAnswer,
  onToggleAnswer,
  onMarkCorrect,
  onMarkMissed,
  paused = false,
  result,
}: PracticeCardProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const resetTimerRef = useRef<number | null>(null);
  const refocusTimerRef = useRef<number | null>(null);
  const [attempt, setAttempt] = useState<string[][]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const expectedSteps = useMemo(
    () => getShortcutSteps(shortcut, platform),
    [platform, shortcut],
  );
  const answerLabel = useMemo(
    () => getShortcutDisplayText(shortcut, platform),
    [platform, shortcut],
  );
  const statusTone =
    result === "correct"
      ? "correct"
      : feedback?.includes("did not match")
        ? "missed"
        : "idle";

  const focusCaptureArea = useCallback(() => {
    window.requestAnimationFrame(() => {
      captureRef.current?.focus({ preventScroll: true });
    });

    if (refocusTimerRef.current) {
      window.clearTimeout(refocusTimerRef.current);
    }

    refocusTimerRef.current = window.setTimeout(() => {
      captureRef.current?.focus({ preventScroll: true });
    }, 60);
  }, []);

  useEffect(() => {
    focusCaptureArea();
    setAttempt([]);
    setFeedback(null);

    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
      resetTimerRef.current = null;
    }
  }, [focusCaptureArea, platform, shortcut.id]);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }

      if (refocusTimerRef.current) {
        window.clearTimeout(refocusTimerRef.current);
      }
    };
  }, []);

  function queueAttemptReset() {
    if (resetTimerRef.current) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setAttempt([]);
      setFeedback("Combo timed out. Start the shortcut again.");
    }, 1800);
  }

  const processStep = useCallback(
    (nextStep: string[]) => {
      if (paused || result === "correct") {
        return;
      }

      const nextAttempt = [...attempt, nextStep];
      setAttempt(nextAttempt);

      if (stepsMatch(nextAttempt, expectedSteps)) {
        if (resetTimerRef.current) {
          window.clearTimeout(resetTimerRef.current);
          resetTimerRef.current = null;
        }

        setFeedback("Matched. The shortcut was captured correctly.");
        onMarkCorrect();
        return;
      }

      if (isStepPrefix(nextAttempt, expectedSteps)) {
        setFeedback(
          expectedSteps.length > 1
            ? "First step captured. Finish the chord."
            : "Keep pressing the combo.",
        );

        if (expectedSteps.length > 1) {
          queueAttemptReset();
        }

        return;
      }

      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }

      setAttempt([]);
      setFeedback("That did not match the expected shortcut.");
      onMarkMissed();
    },
    [attempt, expectedSteps, onMarkCorrect, onMarkMissed, paused, result],
  );

  useEffect(() => {
    function handleWindowKeyDown(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;

      if (
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable
      ) {
        return;
      }

      if (document.activeElement === captureRef.current) {
        return;
      }

      if (paused) {
        return;
      }

      const nextStep = eventToStep(event, platform);

      if (!nextStep) {
        return;
      }

      event.preventDefault();
      focusCaptureArea();
      processStep(nextStep);
    }

    window.addEventListener("keydown", handleWindowKeyDown, true);

    return () => {
      window.removeEventListener("keydown", handleWindowKeyDown, true);
    };
  }, [focusCaptureArea, paused, platform, processStep]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    event.preventDefault();

    const nextStep = eventToStep(event.nativeEvent, platform);

    if (paused || !nextStep) {
      return;
    }

    processStep(nextStep);
  }

  return (
    <div className="relative overflow-hidden rounded-[24px] border border-line bg-[linear-gradient(180deg,rgba(37,37,38,0.98),rgba(30,30,30,0.98))] p-4 shadow-glow md:p-5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-electric/50 to-transparent" />
      <AnimatePresence mode="wait">
        <motion.div
          key={shortcut.id}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -18 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="space-y-5"
        >
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <span className="rounded-md border border-electric/40 bg-electric/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-[#9cdcfe]">
                {shortcut.category}
              </span>
              <span className="rounded-md border border-line bg-panel px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted">
                {shortcut.difficulty}
              </span>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.26em] text-muted">
                Recall the shortcut
              </p>
              <h2 className="mt-2 max-w-2xl text-2xl font-semibold tracking-tight text-white md:text-3xl">
                {shortcut.action}
              </h2>
            </div>
          </div>

          <div className="rounded-[18px] border border-line bg-[#1f1f1f] p-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-muted">
                {showAnswer
                  ? `${platform === "mac" ? "Mac" : "Windows"} combo`
                  : "Click the capture area and perform the shortcut"}
              </p>
              <button
                type="button"
                onClick={onToggleAnswer}
                disabled={paused}
                className="rounded-md border border-line bg-panel px-4 py-2 text-sm text-white transition hover:border-electric/40 hover:bg-[#2d2d30] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {showAnswer ? "Hide Answer" : "Show Answer"}
              </button>
            </div>
            <div className="mt-4 grid gap-3 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
              <div
                ref={captureRef}
                tabIndex={0}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onMouseDown={(event) => event.preventDefault()}
                onKeyDown={handleKeyDown}
                className={`rounded-[24px] p-3.5 outline-none transition ${
                  statusTone === "correct"
                    ? "border border-lime/60 bg-lime/10 shadow-[0_0_0_1px_rgba(151,242,137,0.18),0_18px_50px_rgba(151,242,137,0.12)]"
                    : statusTone === "missed"
                      ? "border border-rose-400/60 bg-rose-400/10 shadow-[0_0_0_1px_rgba(251,113,133,0.18),0_18px_50px_rgba(251,113,133,0.12)]"
                    : paused
                      ? "border border-line bg-panel/60 opacity-70"
                      : "border border-line bg-panel/60 focus:border-electric/60 focus:bg-electric/[0.08]"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p
                    className={`text-sm font-medium ${
                      statusTone === "correct"
                        ? "text-lime"
                        : statusTone === "missed"
                          ? "text-rose-200"
                          : "text-slate-200"
                    }`}
                  >
                    {result === "correct"
                      ? "Correct shortcut captured"
                      : statusTone === "missed"
                        ? "Wrong combo, try again"
                      : paused
                        ? "Shortcut capture is paused"
                        : "Shortcut capture is armed"}
                  </p>
                  <span className="rounded-md border border-line bg-[#252526] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.24em] text-muted">
                    {paused ? "paused" : isFocused ? "listening" : "click to focus"}
                  </span>
                </div>

                <div className="mt-3 min-h-14">
                  {attempt.length > 0 ? (
                    <ShortcutCombo steps={attempt} />
                  ) : (
                    <p
                      className={`text-sm ${
                        statusTone === "correct"
                          ? "text-lime/90"
                          : statusTone === "missed"
                            ? "text-rose-200"
                            : "text-muted"
                      }`}
                    >
                      {statusTone === "correct"
                        ? "Locked in. Moving forward on the correct rep."
                        : statusTone === "missed"
                          ? "That rep reset. Press the full shortcut again."
                        : paused
                          ? "Resume the run to capture the next shortcut."
                          : "Press the full combo here. Multi-step chords are captured in sequence."}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                <p
                  className={`rounded-2xl border px-4 py-3 text-sm ${
                    result === "correct"
                      ? "border-lime/30 bg-lime/10 text-lime"
                      : statusTone === "missed"
                        ? "border-rose-400/30 bg-rose-400/10 text-rose-100"
                        : "border-line bg-panel/70 text-muted"
                  }`}
                >
                  {feedback ?? "The app will check the combo automatically."}
                </p>

                {showAnswer ? (
                  <div
                    className={`space-y-3 rounded-[24px] border p-3.5 ${
                      result === "correct"
                        ? "border-lime/30 bg-lime/5"
                        : statusTone === "missed"
                          ? "border-rose-400/30 bg-rose-400/5"
                          : "border-line bg-panel/80"
                    }`}
                  >
                    <ShortcutCombo steps={expectedSteps} />
                    <p className="text-sm text-muted">{answerLabel}</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 rounded-[24px] border border-line bg-panel/80 p-3">
                    {expectedSteps.map((step, stepIndex) => (
                      <div key={stepIndex} className="flex items-center gap-2">
                        {step.map((_, keyIndex) => (
                          <div
                            key={`${stepIndex}-${keyIndex}`}
                            className={`h-10 min-w-10 rounded-xl border border-dashed ${
                              result === "correct"
                                ? "border-lime/35 bg-lime/[0.07]"
                                : statusTone === "missed"
                                  ? "border-rose-400/35 bg-rose-400/[0.07]"
                                  : "border-line bg-panel/60"
                            }`}
                          />
                        ))}
                        {stepIndex < expectedSteps.length - 1 ? (
                          <div
                            className={`h-10 w-12 rounded-xl border border-dashed ${
                              result === "correct"
                                ? "border-lime/35 bg-lime/[0.07]"
                                : statusTone === "missed"
                                  ? "border-rose-400/35 bg-rose-400/[0.07]"
                                  : "border-electric/20 bg-electric/[0.04]"
                            }`}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-line pt-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  setAttempt([]);
                  setFeedback("Capture cleared. Try the shortcut again.");
                  focusCaptureArea();
                }}
                className="rounded-md border border-line bg-panel px-4 py-2.5 text-sm font-semibold text-white transition hover:border-electric/40 hover:bg-[#2d2d30]"
              >
                Clear Capture
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
