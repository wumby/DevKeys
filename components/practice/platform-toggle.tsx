import { cn } from "@/lib/utils";

type Platform = "mac" | "windows";

type PlatformToggleProps = {
  value: Platform;
  onChange: (value: Platform) => void;
};

const options: Array<{ value: Platform; label: string }> = [
  { value: "mac", label: "Mac" },
  { value: "windows", label: "Windows" },
];

export function PlatformToggle({
  value,
  onChange,
}: PlatformToggleProps) {
  return (
    <div className="inline-flex rounded-md border border-line bg-panel p-1">
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded px-4 py-2 text-sm transition",
              active ? "bg-electric text-white" : "text-muted hover:text-white",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
