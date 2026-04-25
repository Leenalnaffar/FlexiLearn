import { useState } from "react";
import { useLocation } from "wouter";
import { usePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LearningStyle, NeuroProfile } from "@workspace/api-client-react";
import { MotionDiv } from "@/components/motion-wrapper";
import { AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Activity,
  Eye,
  Headphones,
  BookOpen,
  Hand,
  Compass,
  Zap,
  Heart,
  Type,
  BookText,
  ArrowRight,
} from "lucide-react";

const learningOptions: { value: LearningStyle; label: string; icon: typeof Eye; desc: string }[] = [
  { value: "visual", label: "Visual", icon: Eye, desc: "Diagrams & charts" },
  { value: "auditory", label: "Auditory", icon: Headphones, desc: "Listen & speak" },
  { value: "reading", label: "Reading / Writing", icon: BookOpen, desc: "Notes & text" },
  { value: "kinesthetic", label: "Kinesthetic", icon: Hand, desc: "Teach to learn" },
];

const neuroOptions: { value: NeuroProfile; label: string; icon: typeof Compass; desc: string }[] = [
  { value: "standard", label: "General / Standard", icon: Compass, desc: "Balanced experience" },
  { value: "adhd", label: "ADHD (Focus Sprint)", icon: Zap, desc: "Sprints & rewards" },
  { value: "autism", label: "Autism (Sensory-Safe)", icon: Heart, desc: "Calm & predictable" },
  { value: "dyslexia", label: "Dyslexia (Decoding)", icon: Type, desc: "Readable typography" },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const { learningStyle, neuroProfile, topic, setPreferences } = usePreferences();

  const [localStyle, setLocalStyle] = useState<LearningStyle | null>(learningStyle);
  const [localNeuro, setLocalNeuro] = useState<NeuroProfile | null>(neuroProfile);
  const [localTopic, setLocalTopic] = useState<string>(topic);
  const [leaving, setLeaving] = useState(false);

  const handleStart = () => {
    if (!localStyle || !localNeuro) return;
    setPreferences({
      learningStyle: localStyle,
      neuroProfile: localNeuro,
      topic: localTopic,
    });
    setLeaving(true);
    setTimeout(() => setLocation("/chat"), 420);
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden">
      {/* Animated decorative orbs - extra vibrant */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.55, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut" }}
        className="absolute top-[-15%] right-[-10%] w-[55vw] h-[55vw] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(358 70% 55% / 0.40), transparent 70%)" }}
      />
      <MotionDiv
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 0.50, scale: 1 }}
        transition={{ duration: 1.6, ease: "easeOut", delay: 0.15 }}
        className="absolute bottom-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(158 44% 45% / 0.38), transparent 70%)" }}
      />
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.8, delay: 0.3 }}
        className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] rounded-full blur-[110px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(210 44% 38% / 0.40), transparent 70%)" }}
      />
      <MotionDiv
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.40 }}
        transition={{ duration: 1.8, delay: 0.45 }}
        className="absolute top-[55%] right-[20%] w-[30vw] h-[30vw] rounded-full blur-[100px] pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(158 55% 50% / 0.30), transparent 70%)" }}
      />

      <AnimatePresence mode="wait">
        {!leaving && (
          <MotionDiv
            key="hero"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.97 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="z-10 w-full max-w-xl"
          >
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center p-3.5 rounded-2xl mb-6 glass">
                <Sparkles className="w-7 h-7 text-primary" />
              </div>
              <h1 className="text-4xl sm:text-6xl font-extrabold mb-4 tracking-tight leading-[1.05]">
                <span className="block text-white">
                  Welcome to
                </span>
                <span
                  className="block bg-clip-text text-transparent drop-shadow-[0_2px_16px_rgba(229,107,111,0.35)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, #E56B6F 0%, #75C9A8 100%)",
                  }}
                >
                  FlexiLearn
                </span>
              </h1>
              <p className="text-base sm:text-lg max-w-md mx-auto" style={{ color: "#D0D6DC" }}>
                Your personalized learning companion. Tell us how you learn best, and we'll adapt to you.
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-6 sm:p-8">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Personalize Your Experience
              </h2>

              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <BookText className="w-4 h-4 text-primary/80" />
                    Topic <span className="text-muted-foreground text-xs ml-1">(optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="What do you want to learn?"
                    className="flex h-12 w-full rounded-xl border border-border bg-card px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-all"
                    value={localTopic}
                    onChange={(e) => setLocalTopic(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary/80" />
                    Learning Style
                  </label>
                  <Select value={localStyle || ""} onValueChange={(v) => setLocalStyle(v as LearningStyle)}>
                    <SelectTrigger className="h-12 rounded-xl bg-card border-border">
                      <SelectValue placeholder="Select how you learn" />
                    </SelectTrigger>
                    <SelectContent>
                      {learningOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span className="flex items-center gap-3 py-0.5">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="flex flex-col">
                                <span className="font-medium leading-tight">{opt.label}</span>
                                <span className="text-xs text-muted-foreground leading-tight">
                                  {opt.desc}
                                </span>
                              </span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Compass className="w-4 h-4 text-primary/80" />
                    Neuro-Profile
                  </label>
                  <Select value={localNeuro || ""} onValueChange={(v) => setLocalNeuro(v as NeuroProfile)}>
                    <SelectTrigger className="h-12 rounded-xl bg-card border-border">
                      <SelectValue placeholder="Select a profile" />
                    </SelectTrigger>
                    <SelectContent>
                      {neuroOptions.map((opt) => {
                        const Icon = opt.icon;
                        return (
                          <SelectItem key={opt.value} value={opt.value}>
                            <span className="flex items-center gap-3 py-0.5">
                              <Icon className="w-4 h-4 text-primary" />
                              <span className="flex flex-col">
                                <span className="font-medium leading-tight">{opt.label}</span>
                                <span className="text-xs text-muted-foreground leading-tight">
                                  {opt.desc}
                                </span>
                              </span>
                            </span>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  size="lg"
                  className="w-full h-14 text-base font-semibold rounded-xl mt-2 text-white hover:opacity-95 shadow-[0_8px_28px_hsl(358_70%_40%_/_0.35)] transition-all"
                  style={{
                    background: "linear-gradient(90deg, #E56B6F 0%, #75C9A8 100%)",
                  }}
                  disabled={!localStyle || !localNeuro}
                  onClick={handleStart}
                >
                  Launch My Lesson
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </div>

            <p className="text-center text-xs mt-6" style={{ color: "#7A8B99" }}>
              FlexiLearn adapts in real time — change anything later from the chat.
            </p>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}
