import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Camera, TrendingDown, TrendingUp, Minus } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — FootHealth" },
      { name: "description", content: "Your foot ulcer healing timeline." },
    ],
  }),
  component: Dashboard,
});

type Status = "healing" | "worsening" | "stable";

const mockEntries: Array<{ id: string; date: string; status: Status; note: string }> = [
  { id: "1", date: "2025-04-17", status: "healing", note: "Granulation tissue visible" },
  { id: "2", date: "2025-04-16", status: "healing", note: "Reduced redness" },
  { id: "3", date: "2025-04-15", status: "stable", note: "No major change" },
  { id: "4", date: "2025-04-14", status: "worsening", note: "Slight swelling detected" },
  { id: "5", date: "2025-04-13", status: "stable", note: "Baseline" },
];

const statusStyles: Record<Status, { label: string; cls: string; Icon: typeof TrendingUp }> = {
  healing: {
    label: "Healing",
    cls: "bg-success/10 text-success border-success/20",
    Icon: TrendingUp,
  },
  worsening: {
    label: "Worsening",
    cls: "bg-destructive/10 text-destructive border-destructive/20",
    Icon: TrendingDown,
  },
  stable: {
    label: "Stable",
    cls: "bg-muted text-muted-foreground border-border",
    Icon: Minus,
  },
};

function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-4xl px-4 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Your timeline</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Photos and AI assessments from the past days.
            </p>
          </div>
          <Button asChild size="lg">
            <Link to="/capture">
              <Camera className="mr-2 h-4 w-4" /> New photo
            </Link>
          </Button>
        </div>

        {/* Summary card */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard label="Days tracked" value="5" />
          <SummaryCard label="Trend (7d)" value="Healing" tone="success" />
          <SummaryCard label="Next check-in" value="Tomorrow" />
        </div>

        {/* Timeline */}
        <ol className="mt-10 space-y-3">
          {mockEntries.map((entry) => {
            const s = statusStyles[entry.status];
            return (
              <li
                key={entry.id}
                className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-card)]"
              >
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Camera className="h-5 w-5" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">
                    {new Date(entry.date).toLocaleDateString(undefined, {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="truncate text-sm text-muted-foreground">{entry.note}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${s.cls}`}
                >
                  <s.Icon className="h-3.5 w-3.5" />
                  {s.label}
                </span>
              </li>
            );
          })}
        </ol>
      </main>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "success";
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p
        className={`mt-2 text-2xl font-semibold ${
          tone === "success" ? "text-success" : "text-foreground"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
