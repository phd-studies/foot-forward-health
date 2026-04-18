import { Link } from "@tanstack/react-router";
import { Activity } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-hero)] text-primary-foreground shadow-[var(--shadow-soft)]">
            <Activity className="h-5 w-5" strokeWidth={2.5} />
          </span>
          <span className="text-lg">FootHealth</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link
            to="/login"
            className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-md bg-primary px-4 py-2 font-medium text-primary-foreground shadow-[var(--shadow-soft)] transition-opacity hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </div>
    </header>
  );
}
