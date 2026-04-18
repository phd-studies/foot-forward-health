import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";
import { Camera, LineChart, ShieldCheck, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FootHealth — Track foot ulcer healing with AI" },
      {
        name: "description",
        content:
          "FootHealth helps patients and clinicians monitor diabetic foot ulcers day-to-day with photo-based AI insights.",
      },
      { property: "og:title", content: "FootHealth — Track foot ulcer healing with AI" },
      {
        property: "og:description",
        content:
          "Daily photo tracking and AI-powered healing predictions for diabetic foot ulcers.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-[image:var(--gradient-soft)]">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Built for diabetic foot care
            </span>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
              See your wound{" "}
              <span className="bg-[image:var(--gradient-hero)] bg-clip-text text-transparent">
                heal, day by day
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Snap a daily photo of your foot ulcer. FootHealth securely tracks changes over
              time and predicts whether it&apos;s healing — so you and your clinician can act
              early.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/signup">Start tracking free</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link to="/login">I already have an account</Link>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Prototype — not a medical device. Always consult your clinician.
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-4 pb-24">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: Camera,
                title: "Daily photo capture",
                body: "Take consistent, well-framed photos right from your phone in seconds.",
              },
              {
                icon: LineChart,
                title: "Healing trajectory",
                body: "AI compares today's image with your history to flag healing or worsening.",
              },
              {
                icon: ShieldCheck,
                title: "Private & secure",
                body: "Images are encrypted in transit and stored in HIPAA-grade cloud storage.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
                  <f.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FootHealth · Hackathon prototype
        </div>
      </footer>
    </div>
  );
}
