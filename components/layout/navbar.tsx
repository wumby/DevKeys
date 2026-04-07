import Link from "next/link";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/80 bg-[#181818]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-electric/40 bg-electric/15 font-mono text-sm text-[#9cdcfe] shadow-[0_0_20px_rgba(0,122,204,0.2)]">
            DK
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-white">
              DevKeys
            </p>
            <p className="text-xs uppercase tracking-[0.24em] text-muted">
              Shortcut training arena
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/#how-it-works"
            className="text-sm text-muted transition hover:text-white"
          >
            How it works
          </Link>
          <Link
            href="/#categories"
            className="text-sm text-muted transition hover:text-white"
          >
            Categories
          </Link>
          <Link
            href="/practice"
            className="rounded-md border border-electric/50 bg-electric px-4 py-2 text-sm text-white transition hover:bg-cyan"
          >
            Practice
          </Link>
        </nav>
      </div>
    </header>
  );
}
