import { cn } from "@/lib/utils";

type ShortcutKeycapProps = {
  label: string;
  size?: "sm" | "md" | "lg";
};

export function ShortcutKeycap({
  label,
  size = "md",
}: ShortcutKeycapProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center rounded-md border border-line bg-[#2d2d30] font-mono uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04),0_10px_24px_rgba(0,0,0,0.28)]",
        size === "sm" && "min-w-9 px-2.5 py-2 text-[10px]",
        size === "md" && "min-w-11 px-3 py-2.5 text-xs",
        size === "lg" && "min-w-12 px-4 py-3 text-sm",
      )}
    >
      {label}
    </span>
  );
}
