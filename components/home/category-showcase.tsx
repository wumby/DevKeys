import { shortcutCategories, shortcuts } from "@/data/shortcuts";

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
  return (
    <section id="categories" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
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
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shortcutCategories.map((category, index) => (
            <div
              key={category}
              className="group relative overflow-hidden rounded-[20px] border border-line bg-[linear-gradient(180deg,rgba(37,37,38,0.98),rgba(30,30,30,0.98))] p-6 transition hover:-translate-y-1 hover:border-electric/50"
            >
              <div className="absolute right-4 top-4 font-mono text-5xl text-white/[0.04]">
                0{index + 1}
              </div>
              <p className="font-mono text-xs uppercase tracking-[0.24em] text-muted">
                {category}
              </p>
              <h3 className="mt-5 text-2xl font-semibold text-white">
                {category}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-slate-300">
                {categoryHighlights[category]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
