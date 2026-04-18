import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Loader2, RefreshCw, Upload } from "lucide-react";

export const Route = createFileRoute("/capture")({
  head: () => ({
    meta: [
      { title: "Capture photo — FootHealth" },
      { name: "description", content: "Take a daily photo of your foot ulcer." },
    ],
  }),
  component: Capture,
});

type Phase = "idle" | "ready" | "captured" | "uploading" | "done" | "error";

function Capture() {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [error, setError] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<string | null>(null);

  async function startCamera() {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase("ready");
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Unable to access camera. Please check permissions.",
      );
      setPhase("error");
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }

  useEffect(() => {
    return () => stopCamera();
  }, []);

  function takePhoto() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(video, 0, 0);
    setSnapshot(canvas.toDataURL("image/jpeg", 0.9));
    stopCamera();
    setPhase("captured");
  }

  function retake() {
    setSnapshot(null);
    void startCamera();
  }

  async function upload() {
    setPhase("uploading");
    // TODO: POST snapshot to backend, which forwards to Azure Blob Storage
    await new Promise((r) => setTimeout(r, 1800));
    setPhase("done");
    setTimeout(() => navigate({ to: "/dashboard" }), 700);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
        <h1 className="text-sm font-medium">Daily photo</h1>
        <span className="w-12" />
      </header>

      <main className="flex flex-1 flex-col">
        {/* Viewport */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
          {phase === "idle" && (
            <div className="px-6 text-center text-white">
              <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                <Camera className="h-7 w-7" />
              </span>
              <h2 className="mt-4 text-xl font-semibold">Capture your foot</h2>
              <p className="mt-2 text-sm text-white/70">
                Hold your phone steady, ~30 cm from the wound, with good lighting.
              </p>
              <Button onClick={startCamera} size="lg" className="mt-6">
                Open camera
              </Button>
            </div>
          )}

          {phase === "error" && (
            <div className="px-6 text-center text-white">
              <p className="text-sm text-destructive-foreground/90">{error}</p>
              <Button onClick={startCamera} variant="secondary" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Try again
              </Button>
            </div>
          )}

          <video
            ref={videoRef}
            playsInline
            muted
            className={`h-full w-full object-cover ${
              phase === "ready" ? "block" : "hidden"
            }`}
          />

          {snapshot && (phase === "captured" || phase === "uploading" || phase === "done") && (
            <img src={snapshot} alt="Captured foot" className="h-full w-full object-cover" />
          )}

          {phase === "uploading" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm">
              <Loader2 className="h-10 w-10 animate-spin" />
              <p className="mt-3 text-sm">Uploading securely…</p>
            </div>
          )}

          {phase === "done" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white backdrop-blur-sm">
              <p className="text-base font-medium">Uploaded ✓</p>
              <p className="mt-1 text-xs text-white/70">Redirecting to your timeline…</p>
            </div>
          )}

          {/* Framing guide */}
          {phase === "ready" && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-64 w-64 rounded-3xl border-2 border-white/70 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
            </div>
          )}

          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Controls */}
        <div className="border-t border-border/60 bg-card px-4 py-5">
          {phase === "ready" && (
            <div className="flex justify-center">
              <button
                onClick={takePhoto}
                aria-label="Take photo"
                className="h-16 w-16 rounded-full border-4 border-primary bg-background ring-4 ring-primary/30 transition-transform active:scale-95"
              />
            </div>
          )}

          {phase === "captured" && (
            <div className="mx-auto flex max-w-sm gap-3">
              <Button onClick={retake} variant="outline" className="flex-1">
                <RefreshCw className="mr-2 h-4 w-4" /> Retake
              </Button>
              <Button onClick={upload} className="flex-1">
                <Upload className="mr-2 h-4 w-4" /> Upload
              </Button>
            </div>
          )}

          {(phase === "idle" || phase === "error") && (
            <p className="text-center text-xs text-muted-foreground">
              Photos are sent to Azure Blob Storage via your backend API.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
