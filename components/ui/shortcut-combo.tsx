import { ShortcutKeycap } from "@/components/ui/shortcut-keycap";

type ShortcutComboProps = {
  keys?: string[];
  steps?: string[][];
  size?: "sm" | "md" | "lg";
};

export function ShortcutCombo({
  keys,
  steps,
  size = "md",
}: ShortcutComboProps) {
  const comboSteps = steps ?? (keys ? [keys] : []);

  return (
    <div className="flex flex-wrap items-center gap-3">
      {comboSteps.map((step, stepIndex) => (
        <div key={stepIndex} className="flex flex-wrap items-center gap-2">
          {step.map((key, index) => (
            <div key={`${stepIndex}-${key}-${index}`} className="flex items-center gap-2">
              <ShortcutKeycap label={key} size={size} />
              {index < step.length - 1 ? (
                <span className="font-mono text-sm text-muted">+</span>
              ) : null}
            </div>
          ))}
          {stepIndex < comboSteps.length - 1 ? (
            <span className="font-mono text-sm uppercase tracking-[0.2em] text-[#9cdcfe]/80">
              then
            </span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
