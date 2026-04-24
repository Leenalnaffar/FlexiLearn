import {
  Brain,
  BookOpen,
  Eye,
  ChevronDown,
  Network,
  Heart,
  Clock,
  Sparkles,
} from "lucide-react";

export function Landing() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden font-['Inter']">
      {/* Layer 1 — base midnight gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #191970 0%, #4B0082 38%, #708090 72%, #E0FFFF 100%)",
        }}
      />

      {/* Layer 2 — nebulous cloud blobs */}
      <div
        className="absolute -top-40 -left-40 h-[640px] w-[640px] rounded-full blur-[120px] opacity-60"
        style={{ background: "radial-gradient(circle, #4B0082 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/3 -right-32 h-[520px] w-[520px] rounded-full blur-[120px] opacity-50"
        style={{ background: "radial-gradient(circle, #708090 0%, transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 left-1/4 h-[480px] w-[480px] rounded-full blur-[110px] opacity-40"
        style={{ background: "radial-gradient(circle, #E0FFFF 0%, transparent 70%)" }}
      />
      <div
        className="absolute top-1/4 left-1/3 h-[360px] w-[360px] rounded-full blur-[100px] opacity-30"
        style={{ background: "radial-gradient(circle, #191970 0%, transparent 70%)" }}
      />

      {/* Subtle starfield grain */}
      <div
        className="absolute inset-0 opacity-[0.18] mix-blend-screen pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 20% 30%, #FFFFFF 50%, transparent 51%), radial-gradient(1px 1px at 70% 80%, #FFFFFF 50%, transparent 51%), radial-gradient(1.2px 1.2px at 45% 60%, #E0FFFF 50%, transparent 51%), radial-gradient(0.8px 0.8px at 85% 25%, #FFFFFF 50%, transparent 51%), radial-gradient(1px 1px at 15% 75%, #C5CAE9 50%, transparent 51%), radial-gradient(0.8px 0.8px at 60% 15%, #FFFFFF 50%, transparent 51%)",
          backgroundSize: "600px 600px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center px-6 py-14">
        {/* Brand mark */}
        <div className="mb-10 flex items-center justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-[0_8px_32px_rgba(212,175,55,0.45)]"
            style={{
              background:
                "linear-gradient(135deg, #FFE082 0%, #D4AF37 45%, #8B6914 100%)",
            }}
          >
            <Sparkles className="h-8 w-8 text-[#000033]" strokeWidth={2.4} />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-center text-[64px] font-extrabold leading-[1.05] tracking-tight">
          <span className="text-[#2F4F4F] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]">
            Welcome to
          </span>
          <br />
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #FFE9A8 0%, #D4AF37 35%, #B8860B 65%, #FFD96A 100%)",
              WebkitTextStroke: "0.5px rgba(0,0,0,0.05)",
              filter: "drop-shadow(0 4px 12px rgba(212,175,55,0.35))",
            }}
          >
            FlexiLearn
          </span>
        </h1>
        <p
          className="mt-5 max-w-2xl text-center text-lg leading-relaxed"
          style={{ color: "#C5CAE9" }}
        >
          Your personalized learning companion. Tell us how you learn best, and
          we&apos;ll adapt to you — across every subject, every style, every pace.
        </p>

        {/* Personalization Panel */}
        <div className="mt-12 w-full max-w-xl">
          <div
            className="rounded-3xl border p-7 shadow-[0_24px_64px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              background: "linear-gradient(180deg, #000033 0%, #050524 100%)",
              borderColor: "rgba(197,202,233,0.12)",
            }}
          >
            <div className="mb-6 flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "rgba(197,202,233,0.10)" }}
              >
                <Brain className="h-5 w-5" style={{ color: "#C5CAE9" }} />
              </div>
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: "#C5CAE9" }}>
                  Neural Profile
                </div>
                <div className="text-lg font-semibold text-white">
                  Personalize Your Experience
                </div>
              </div>
            </div>

            {/* Topic */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <BookOpen className="h-4 w-4" style={{ color: "#C5CAE9" }} />
                Topic
                <span className="ml-1 text-xs font-normal" style={{ color: "#D3D3D3" }}>
                  (optional)
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="What do you want to learn?"
                  className="h-12 w-full rounded-xl border-0 bg-white px-4 text-[15px] outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-[#D4AF37]/60 placeholder:text-[#000033]/55"
                  style={{ color: "#000033" }}
                />
              </div>
            </div>

            {/* Learning Style */}
            <div className="mt-5 space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-white">
                <Eye className="h-4 w-4" style={{ color: "#C5CAE9" }} />
                Learning Style
              </label>
              <div className="relative">
                <button
                  type="button"
                  className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 text-left text-[15px] outline-none ring-1 ring-white/10 transition hover:ring-2 hover:ring-[#D4AF37]/40"
                  style={{ color: "#000033" }}
                >
                  <span className="text-[#000033]/55">Select how you learn</span>
                  <ChevronDown className="h-4 w-4" style={{ color: "#000033" }} />
                </button>
              </div>
            </div>

            {/* Adaptive Learning Module + floating popup */}
            <div className="relative mt-7 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <Network className="h-5 w-5 text-white" />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Adaptive Learning
                  </div>
                  <div className="text-xs" style={{ color: "#C5CAE9" }}>
                    Your tutor evolves with every session
                  </div>
                </div>
              </div>

              {/* Floating popup */}
              <div
                className="flex items-center gap-2 rounded-xl border px-2 py-2 shadow-[0_12px_28px_rgba(0,0,0,0.55)]"
                style={{
                  background: "linear-gradient(180deg, #0A0A40 0%, #000033 100%)",
                  borderColor: "rgba(212,175,55,0.35)",
                }}
              >
                <button
                  type="button"
                  aria-label="Save to favorites"
                  className="flex h-9 w-9 items-center justify-center rounded-lg shadow-[0_4px_14px_rgba(212,175,55,0.55)] transition hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #FFE082 0%, #D4AF37 40%, #C0C0C0 100%)",
                  }}
                >
                  <Heart className="h-4 w-4 text-white" fill="white" />
                </button>
                <button
                  type="button"
                  aria-label="Schedule a session"
                  className="flex h-9 w-9 items-center justify-center rounded-lg transition hover:scale-105"
                  style={{ background: "#C5CAE9" }}
                >
                  <Clock className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              className="mt-7 flex h-12 w-full items-center justify-center rounded-xl text-[15px] font-semibold text-[#000033] shadow-[0_10px_30px_rgba(212,175,55,0.45)] transition hover:brightness-105"
              style={{
                background:
                  "linear-gradient(135deg, #FFE9A8 0%, #D4AF37 50%, #B8860B 100%)",
              }}
            >
              Begin Learning Journey
            </button>
          </div>

          {/* Foot caption */}
          <p className="mt-4 text-center text-xs" style={{ color: "#C5CAE9" }}>
            Your responses shape the AI tutor's tone, pace, and examples in real time.
          </p>
        </div>
      </div>

      {/* Bottom-right cyan-glow sparkle */}
      <div className="pointer-events-none absolute bottom-10 right-10 z-20">
        <div
          className="absolute inset-0 -m-12 rounded-full blur-3xl"
          style={{ background: "radial-gradient(circle, #E0FFFF 0%, transparent 70%)" }}
        />
        <div
          className="absolute inset-0 -m-6 rounded-full blur-xl opacity-80"
          style={{ background: "radial-gradient(circle, #FFFFFF 0%, transparent 70%)" }}
        />
        <Sparkles
          className="relative h-12 w-12 text-white"
          strokeWidth={1.4}
          style={{ filter: "drop-shadow(0 0 16px #E0FFFF) drop-shadow(0 0 32px #67e8f9)" }}
        />
      </div>
    </div>
  );
}
