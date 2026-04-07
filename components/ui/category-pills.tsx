import { ShortcutCategory } from "@/types/shortcut";
import { cn } from "@/lib/utils";

type CategoryPillsProps = {
  categories: Array<ShortcutCategory | "All">;
  activeCategory: ShortcutCategory | "All";
  onSelect: (category: ShortcutCategory | "All") => void;
};

export function CategoryPills({
  categories,
  activeCategory,
  onSelect,
}: CategoryPillsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {categories.map((category) => {
        const active = category === activeCategory;

        return (
          <button
            key={category}
            type="button"
            onClick={() => onSelect(category)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-medium transition duration-200",
              active
                ? "border-electric/70 bg-electric text-white shadow-[0_0_0_1px_rgba(0,122,204,0.3)]"
                : "border-line bg-panel text-muted hover:border-electric/40 hover:bg-[#2d2d30] hover:text-white",
            )}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
