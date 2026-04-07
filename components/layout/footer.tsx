export function Footer() {
  return (
    <footer className="border-t border-line/80 bg-[#181818]/50">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-10 text-sm text-muted sm:px-6 lg:px-8 md:flex-row md:items-center md:justify-between">
        <p>DevKeys is built for repetition, rhythm, and shortcut recall.</p>
        <p className="font-mono text-xs uppercase tracking-[0.22em]">
          No auth. No backend. In-memory practice only.
        </p>
      </div>
    </footer>
  );
}
