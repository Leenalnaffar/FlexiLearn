import { useState, useEffect, useRef, useMemo } from "react";
import { useLocation } from "wouter";
import { usePreferences } from "@/hooks/use-preferences";
import {
  useSendChatMessage,
  useGetSessionMap,
  ChatMessage as ApiChatMessage,
  ChatAttachment,
  ChatResponseAgent,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowUp,
  Sparkles,
  Map as MapIcon,
  GraduationCap,
  Medal,
  ArrowLeft,
  FilePlus,
  X,
  FileText,
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  Radio,
  Mic,
  MicOff,
  Star,
} from "lucide-react";
import type { ResourceLink } from "@/components/chat-message";
import { FocusTimer } from "@/components/focus-timer";
import { ChatMessage } from "@/components/chat-message";
import { MotionDiv } from "@/components/motion-wrapper";
import { AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { cn } from "@/lib/utils";

const MILESTONE_GOAL = 6; // messages to fill the progress ring

const CHAT_STORAGE_KEY = "flexilearn:chat:state:v1";

interface SessionFeedback {
  understanding: number;
  effectiveness: number;
}

interface FeedbackEntry extends SessionFeedback {
  at: number;
}

interface PersistedChat {
  learningStyle: string;
  neuroProfile: string;
  topic: string;
  history: ApiChatMessage[];
  points: number;
  mermaids: Record<number, string>;
  resourcesByIdx: Record<number, ResourceLink[]>;
  completedMilestones: number;
  lastFeedback: SessionFeedback | null;
  feedbackHistory: FeedbackEntry[];
}

function RatingRow({
  label,
  helper,
  value,
  onChange,
}: {
  label: string;
  helper: string;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">
          {value > 0 ? `${value} / 5` : "Not rated"}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5 mb-2">{helper}</p>
      <div className="flex items-center gap-1.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            aria-label={`${label} ${n} of 5`}
            onClick={() => onChange(n)}
            className="p-1 rounded-md hover:scale-110 transition-transform"
          >
            <Star
              className={cn(
                "w-7 h-7 transition-colors",
                n <= value
                  ? "text-[hsl(35_75%_50%)] fill-[hsl(35_75%_50%)]"
                  : "text-muted-foreground/40",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * Strip base64 dataUrls from attachments before persisting so we don't blow
 * past the ~5MB localStorage quota. The chip metadata (name, mime) is enough
 * to redraw the user bubble after a refresh.
 */
function stripAttachmentsForStorage(history: ApiChatMessage[]): ApiChatMessage[] {
  return history.map((m) => {
    if (!m.attachments || m.attachments.length === 0) return m;
    return {
      ...m,
      attachments: m.attachments.map((a) => ({
        name: a.name,
        mimeType: a.mimeType,
        dataUrl: "",
      })),
    };
  });
}

export default function Chat() {
  const [, setLocation] = useLocation();
  const { learningStyle, neuroProfile, topic, resetPreferences } = usePreferences();

  const [history, setHistory] = useState<ApiChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [points, setPoints] = useState(0);
  const [activeAgent, setActiveAgent] = useState<ChatResponseAgent | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mermaids, setMermaids] = useState<Record<number, string>>({});
  const [resourcesByIdx, setResourcesByIdx] = useState<Record<number, ResourceLink[]>>({});
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showChallenge, setShowChallenge] = useState(false);
  const [completedMilestones, setCompletedMilestones] = useState(0);

  // Persistence + restore
  const [hydrated, setHydrated] = useState(false);

  // Feedback (Session Health)
  const [lastFeedback, setLastFeedback] = useState<SessionFeedback | null>(null);
  const [feedbackHistory, setFeedbackHistory] = useState<FeedbackEntry[]>([]);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [understandingDraft, setUnderstandingDraft] = useState(0);
  const [effectivenessDraft, setEffectivenessDraft] = useState(0);

  // Speech-to-text
  const [isListening, setIsListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(true);
  const recognitionRef = useRef<unknown>(null);
  const inputBaselineRef = useRef<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useSendChatMessage();
  const getSessionMap = useGetSessionMap();

  // ---- Hydrate persisted chat session on mount ----
  useEffect(() => {
    if (!learningStyle || !neuroProfile) {
      setHydrated(true);
      return;
    }
    try {
      const raw = localStorage.getItem(CHAT_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as PersistedChat;
        // Only restore if the saved session matches current preferences.
        if (
          saved.learningStyle === learningStyle &&
          saved.neuroProfile === neuroProfile &&
          (saved.topic ?? "") === (topic ?? "")
        ) {
          setHistory(saved.history ?? []);
          setPoints(saved.points ?? 0);
          setMermaids(saved.mermaids ?? {});
          setResourcesByIdx(saved.resourcesByIdx ?? {});
          setCompletedMilestones(saved.completedMilestones ?? 0);
          setLastFeedback(saved.lastFeedback ?? null);
          setFeedbackHistory(saved.feedbackHistory ?? []);
        } else {
          localStorage.removeItem(CHAT_STORAGE_KEY);
        }
      }
    } catch {
      localStorage.removeItem(CHAT_STORAGE_KEY);
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Persist chat state on every change (after hydration) ----
  useEffect(() => {
    if (!hydrated || !learningStyle || !neuroProfile) return;
    try {
      const payload: PersistedChat = {
        learningStyle,
        neuroProfile,
        topic: topic ?? "",
        history: stripAttachmentsForStorage(history),
        points,
        mermaids,
        resourcesByIdx,
        completedMilestones,
        lastFeedback,
        feedbackHistory,
      };
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // Quota or serialization issue — fail silently rather than crash the chat.
    }
  }, [
    hydrated,
    learningStyle,
    neuroProfile,
    topic,
    history,
    points,
    mermaids,
    resourcesByIdx,
    completedMilestones,
    lastFeedback,
    feedbackHistory,
  ]);

  // ---- Speech-to-Text setup (Web Speech API) ----
  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => unknown;
      webkitSpeechRecognition?: new () => unknown;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSttSupported(false);
      return;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const recognition: any = new (Ctor as any)();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = navigator.language || "en-US";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recognition.onresult = (event: any) => {
      let finalText = "";
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += transcript;
        else interimText += transcript;
      }
      const baseline = inputBaselineRef.current;
      const sep = baseline && !baseline.endsWith(" ") ? " " : "";
      setInput((baseline + sep + finalText + interimText).trimStart());
      if (finalText) {
        inputBaselineRef.current = (baseline + sep + finalText).trimStart();
      }
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.stop();
      } catch {
        // ignore
      }
    };
  }, []);

  const toggleListening = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rec = recognitionRef.current as any;
    if (!rec) return;
    if (isListening) {
      try {
        rec.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    } else {
      inputBaselineRef.current = input;
      try {
        rec.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const openFeedback = () => {
    setUnderstandingDraft(lastFeedback?.understanding ?? 0);
    setEffectivenessDraft(lastFeedback?.effectiveness ?? 0);
    setFeedbackOpen(true);
  };

  const submitFeedback = () => {
    if (understandingDraft < 1 || effectivenessDraft < 1) return;
    const entry: FeedbackEntry = {
      understanding: understandingDraft,
      effectiveness: effectivenessDraft,
      at: Date.now(),
    };
    setLastFeedback({
      understanding: understandingDraft,
      effectiveness: effectivenessDraft,
    });
    setFeedbackHistory((prev) => [...prev, entry]);
    setFeedbackOpen(false);
  };

  useEffect(() => {
    if (!learningStyle || !neuroProfile) {
      setLocation("/");
    }
  }, [learningStyle, neuroProfile, setLocation]);

  useEffect(() => {
    if (neuroProfile === "autism" && (topic || history.length > 0) && !getSessionMap.data) {
      getSessionMap.mutate({
        data: {
          topic: topic || "Current topic",
          learningStyle: learningStyle!,
          neuroProfile: neuroProfile,
        },
      });
    }
  }, [neuroProfile, topic, history.length, getSessionMap.data, learningStyle]);

  useEffect(() => {
    if (scrollRef.current) {
      const node = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
      if (node) (node as HTMLElement).scrollTop = (node as HTMLElement).scrollHeight;
    }
  }, [history, sendMessage.isPending]);

  // Apply sensory-safe theme on root for autism
  useEffect(() => {
    const root = document.documentElement;
    if (neuroProfile === "autism") root.classList.add("theme-sensory-safe");
    else root.classList.remove("theme-sensory-safe");
    return () => root.classList.remove("theme-sensory-safe");
  }, [neuroProfile]);

  const userMessageCount = useMemo(() => history.filter((m) => m.role === "user").length, [history]);
  const progressPct = Math.min(100, ((userMessageCount % MILESTONE_GOAL) / MILESTONE_GOAL) * 100);
  const justFilled = userMessageCount > 0 && userMessageCount % MILESTONE_GOAL === 0;

  // Milestone effects: confetti for standard/adhd, breaking-news challenge for adhd
  useEffect(() => {
    const reached = Math.floor(userMessageCount / MILESTONE_GOAL);
    if (reached > completedMilestones) {
      setCompletedMilestones(reached);
      if (neuroProfile === "standard" || neuroProfile === "adhd") {
        // Particle confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.2 },
          colors: ["#8b5cf6", "#a78bfa", "#22d3ee", "#f472b6", "#ffffff"],
          scalar: 0.8,
          ticks: 120,
        });
      }
      if (neuroProfile === "adhd") {
        setShowChallenge(true);
        setTimeout(() => setShowChallenge(false), 5000);
      }
    }
  }, [userMessageCount, completedMilestones, neuroProfile]);

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = () => reject(r.error);
      r.readAsDataURL(file);
    });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    const files = Array.from(e.target.files ?? []);
    if (files.length > 0) {
      console.log("[Add Files] Selected:", files.map((f) => f.name));
    }
    if (e.target) e.target.value = "";
    const next: ChatAttachment[] = [];
    for (const file of files) {
      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`${file.name} is larger than 10MB.`);
        continue;
      }
      try {
        const dataUrl = await readFileAsDataUrl(file);
        next.push({
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          dataUrl,
        });
      } catch {
        setUploadError(`Could not read ${file.name}.`);
      }
    }
    if (next.length) setPendingAttachments((prev) => [...prev, ...next]);
  };

  const removeAttachment = (idx: number) =>
    setPendingAttachments((prev) => prev.filter((_, i) => i !== idx));

  const handleSend = () => {
    if (sendMessage.isPending) return;
    if (!learningStyle || !neuroProfile) return;
    const trimmed = input.trim();
    if (!trimmed && pendingAttachments.length === 0) return;

    const messageText =
      trimmed ||
      (pendingAttachments.length === 1
        ? `Please look at this ${pendingAttachments[0].mimeType.startsWith("image/") ? "image" : "file"}.`
        : "Please look at these attachments.");

    const attachmentsForMsg = pendingAttachments.length ? pendingAttachments : undefined;
    const userMsg: ApiChatMessage = {
      role: "user",
      content: messageText,
      ...(attachmentsForMsg ? { attachments: attachmentsForMsg } : {}),
    };
    const currentHistory = [...history, userMsg];
    setHistory(currentHistory);
    setInput("");
    setPendingAttachments([]);

    sendMessage.mutate(
      {
        data: {
          learningStyle,
          neuroProfile,
          topic,
          history,
          message: messageText,
          ...(attachmentsForMsg ? { attachments: attachmentsForMsg } : {}),
          ...(lastFeedback ? { lastFeedback } : {}),
        },
      },
      {
        onSuccess: (data) => {
          const assistantMsg: ApiChatMessage = { role: "assistant", content: data.reply };
          setHistory((prev) => [...prev, assistantMsg]);
          setActiveAgent(data.agent);

          if (data.mermaid) {
            setMermaids((prev) => ({ ...prev, [currentHistory.length]: data.mermaid! }));
          }
          if (data.resources && data.resources.length > 0) {
            setResourcesByIdx((prev) => ({
              ...prev,
              [currentHistory.length]: data.resources as ResourceLink[],
            }));
          }

          if (neuroProfile === "adhd") {
            const awarded = data.rewardPoints || 10;
            setPoints((prev) => prev + awarded);
            setShowCelebration(true);
            setTimeout(() => setShowCelebration(false), 2000);
          }
        },
      },
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleBack = () => {
    resetPreferences();
    setLocation("/");
  };

  const isKinesthetic = learningStyle === "kinesthetic";
  const isAutism = neuroProfile === "autism";

  const getAgentDisplay = () => {
    if (!activeAgent) return { name: "Manager", icon: Sparkles };
    switch (activeAgent) {
      case "visualizer":
        return { name: "Visualizer", icon: Sparkles };
      case "narrator":
        return { name: "Narrator", icon: Sparkles };
      case "scrivener":
        return { name: "Scrivener", icon: Sparkles };
      case "protege":
        return { name: "Protégé", icon: GraduationCap };
      default:
        return { name: "Manager", icon: Sparkles };
    }
  };

  const agentDisplay = getAgentDisplay();
  const AgentIcon = agentDisplay.icon;

  // Skill-tree active node (autism mode session map)
  const stepCount = getSessionMap.data?.steps.length ?? 0;
  const activeStepIdx = stepCount === 0 ? 0 : Math.min(Math.floor(userMessageCount / 2), stepCount - 1);

  if (!learningStyle || !neuroProfile) return null;

  // Progress ring math (small circle in header)
  const ringR = 18;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC - (progressPct / 100) * ringC;

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45 }}
      className="flex h-[100dvh] relative"
    >
      {/* Session Skill-Tree Sidebar (Autism Mode) */}
      {isAutism && (
        <MotionDiv
          initial={{ x: -40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-80 border-r border-border bg-sidebar/80 backdrop-blur-xl shrink-0 hidden md:flex flex-col"
        >
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2 text-sidebar-foreground">
              <MapIcon className="w-5 h-5 text-sidebar-primary" />
              Learning Map
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Predictable, step-by-step flow</p>
          </div>
          <ScrollArea className="flex-1 p-6">
            {getSessionMap.isPending && (
              <div className="text-sm text-muted-foreground">Loading map...</div>
            )}
            <div className="relative pl-2">
              {/* Glowing connecting track */}
              {stepCount > 1 && (
                <div className="absolute left-[18px] top-3 bottom-3 w-[3px] rounded-full node-track" />
              )}
              {getSessionMap.data?.steps.map((step, idx) => {
                const isActive = idx === activeStepIdx;
                const isDone = idx < activeStepIdx;
                return (
                  <MotionDiv
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    className="mb-6 relative flex gap-4 items-start"
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-full flex items-center justify-center shrink-0 z-10 font-semibold text-xs border transition-all",
                        isActive && "node-glow-active border-transparent",
                        isDone && "node-glow-completed border-transparent",
                        !isActive && !isDone && "bg-muted text-muted-foreground border-border",
                      )}
                    >
                      {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>
                    <div className={cn("flex-1 pt-1", !isActive && !isDone && "opacity-70")}>
                      <h4 className="font-medium text-sm text-foreground leading-tight">{step.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 mb-2">{step.description}</p>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium">
                        {step.durationMinutes} min
                      </span>
                    </div>
                  </MotionDiv>
                );
              })}
            </div>
          </ScrollArea>
        </MotionDiv>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/30 backdrop-blur-xl z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="gap-2 rounded-xl glass px-3 h-10"
              onClick={handleBack}
              title="Back to home"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Home</span>
            </Button>

            {/* Progress Ring */}
            <MotionDiv
              animate={justFilled ? { scale: [1, 1.15, 1] } : { scale: 1 }}
              transition={{ duration: 0.6 }}
              className="relative w-11 h-11"
              title={`${userMessageCount % MILESTONE_GOAL}/${MILESTONE_GOAL} messages`}
            >
              <svg className="absolute inset-0 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r={ringR} stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground/15" />
                <circle
                  cx="22"
                  cy="22"
                  r={ringR}
                  stroke="url(#progressGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringOffset}
                  className="transition-all duration-700 ease-out"
                  style={{ filter: "drop-shadow(0 0 6px hsl(250 90% 65% / 0.6))" }}
                />
                <defs>
                  <linearGradient id="progressGrad" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(250 90% 70%)" />
                    <stop offset="50%" stopColor="hsl(280 80% 70%)" />
                    <stop offset="100%" stopColor="hsl(195 90% 60%)" />
                  </linearGradient>
                </defs>
              </svg>
              <AgentIcon className="absolute inset-0 m-auto w-4 h-4 text-primary" />
            </MotionDiv>

            <div>
              <h1 className="font-semibold text-foreground leading-tight">{agentDisplay.name}</h1>
              <p className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                {learningStyle} • {neuroProfile}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isKinesthetic && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 glass rounded-full text-xs font-medium">
                <GraduationCap className="w-3.5 h-3.5 text-primary" />
                You are the teacher
              </div>
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl glass w-10 h-10 relative"
              onClick={openFeedback}
              title="Session Health: rate your session"
              aria-label="Session Health"
            >
              <Star
                className={cn(
                  "w-4 h-4",
                  lastFeedback ? "text-[hsl(35_75%_50%)] fill-[hsl(35_75%_50%)]" : "text-primary",
                )}
              />
              {lastFeedback && (
                <span className="absolute -bottom-1 -right-1 text-[9px] font-semibold px-1 rounded-full bg-card border border-border">
                  {Math.round(((lastFeedback.understanding + lastFeedback.effectiveness) / 2) * 10) / 10}
                </span>
              )}
            </Button>
            <FocusTimer />
            {neuroProfile === "adhd" && (
              <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-full font-medium relative">
                <Medal className="w-4 h-4 text-yellow-400" />
                <span>{points} pts</span>
                {showCelebration && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: -22, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-6 text-yellow-400 font-bold pointer-events-none"
                  >
                    +10!
                  </MotionDiv>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4 sm:p-6" ref={scrollRef}>
          <div
            className={cn(
              "max-w-3xl mx-auto flex flex-col justify-end min-h-full pb-4",
              isAutism ? "message-list" : "",
            )}
          >
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground my-20">
                <div className="w-20 h-20 glass rounded-full flex items-center justify-center">
                  <Sparkles className="w-9 h-9 text-primary" />
                </div>
                <p className="opacity-80">Start your customized learning session.</p>
              </div>
            ) : (
              history.map((msg, i) => (
                <ChatMessage
                  key={i}
                  message={msg}
                  mermaidCode={mermaids[i]}
                  resources={resourcesByIdx[i]}
                />
              ))
            )}
            {sendMessage.isPending && (
              <div className="flex justify-start mb-6">
                <div className="glass-bubble-bot rounded-3xl rounded-tl-sm px-6 py-4 flex gap-2 items-center text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 sm:p-6 border-t border-border bg-card/30 backdrop-blur-xl shrink-0">
          <div className="max-w-3xl mx-auto">
            {pendingAttachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {pendingAttachments.map((a, idx) => {
                  const isImage = a.mimeType.startsWith("image/");
                  return (
                    <div
                      key={idx}
                      className="group relative flex items-center gap-2 pl-2 pr-8 py-2 glass rounded-xl text-xs"
                    >
                      {isImage ? (
                        <img src={a.dataUrl} alt={a.name} className="w-10 h-10 object-cover rounded-md" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                          <FileText className="w-5 h-5 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex flex-col max-w-[140px]">
                        <span className="truncate font-medium text-foreground">{a.name}</span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          {isImage ? <ImageIcon className="w-3 h-3" /> : <FileText className="w-3 h-3" />}
                          {a.mimeType || "file"}
                        </span>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${a.name}`}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center"
                        onClick={() => removeAttachment(idx)}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {uploadError && <div className="mb-2 text-xs text-destructive">{uploadError}</div>}
            <div className="relative flex items-center">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*,.txt,.md,.csv,.json,.html,.js,.ts,.tsx,.jsx,.css,.py,.java,.c,.cpp,.go,.rb,.rs,.yaml,.yml,.xml,.log"
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute left-2 w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground"
                onClick={() => fileInputRef.current?.click()}
                disabled={sendMessage.isPending}
                aria-label="Add Files"
                title="Add Files"
              >
                <FilePlus className="w-5 h-5" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute left-12 w-10 h-10 rounded-xl text-muted-foreground hover:text-foreground",
                  isListening && "text-[hsl(13_67%_55%)]",
                  !sttSupported && "opacity-40 cursor-not-allowed",
                )}
                onClick={toggleListening}
                disabled={sendMessage.isPending || !sttSupported}
                aria-label={isListening ? "Stop dictation" : "Start dictation"}
                title={
                  !sttSupported
                    ? "Voice dictation isn't supported in this browser"
                    : isListening
                      ? "Stop dictation"
                      : "Dictate with your voice"
                }
              >
                {isListening ? (
                  <MicOff className="w-5 h-5 animate-pulse" />
                ) : (
                  <Mic className="w-5 h-5" />
                )}
              </Button>
              <Input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  inputBaselineRef.current = e.target.value;
                }}
                onKeyDown={handleKeyDown}
                placeholder={
                  isListening
                    ? "Listening... speak now"
                    : isKinesthetic
                      ? "Teach your student..."
                      : "Type your message..."
                }
                className="h-14 pl-24 pr-14 rounded-2xl bg-card border-border shadow-sm text-base placeholder:text-muted-foreground"
                disabled={sendMessage.isPending}
              />
              <Button
                size="icon"
                className="absolute right-2 w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_8px_24px_hsl(208_25%_30%_/_0.25)]"
                disabled={(!input.trim() && pendingAttachments.length === 0) || sendMessage.isPending}
                onClick={handleSend}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="max-w-3xl mx-auto text-center mt-2">
            <p className="text-[10px] text-muted-foreground">
              FlexiLearn AI is adapting to your {learningStyle} style. Attach images or text files for richer lessons.
            </p>
          </div>
        </div>
      </div>

      {/* Session Health Feedback Modal */}
      <AnimatePresence>
        {feedbackOpen && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
            onClick={() => setFeedbackOpen(false)}
          >
            <MotionDiv
              initial={{ scale: 0.92, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 16, opacity: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 22 }}
              className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-6"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Session Health</h3>
                  <p className="text-xs text-muted-foreground">
                    Your rating reshapes how the AI teaches the next reply.
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-5">
                <RatingRow
                  label="Understanding"
                  helper="How well do you understand what was just taught?"
                  value={understandingDraft}
                  onChange={setUnderstandingDraft}
                />
                <RatingRow
                  label="Effectiveness"
                  helper="How effective was the teaching style for you?"
                  value={effectivenessDraft}
                  onChange={setEffectivenessDraft}
                />
              </div>

              <div className="mt-6 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setFeedbackOpen(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-gradient-to-br from-primary to-accent text-primary-foreground"
                  disabled={understandingDraft < 1 || effectivenessDraft < 1}
                  onClick={submitFeedback}
                >
                  Save Feedback
                </Button>
              </div>

              {feedbackHistory.length > 0 && (
                <p className="mt-4 text-[11px] text-muted-foreground text-center">
                  {feedbackHistory.length} previous rating{feedbackHistory.length === 1 ? "" : "s"} saved this session.
                </p>
              )}
            </MotionDiv>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Lightning Challenge — Breaking-news popup (ADHD only) */}
      <AnimatePresence>
        {showChallenge && neuroProfile === "adhd" && (
          <MotionDiv
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%]"
          >
            <div className="breaking-news relative overflow-hidden rounded-2xl border border-[hsl(13_67%_50%_/_0.5)] bg-gradient-to-br from-[hsl(13_67%_60%)] to-[hsl(13_67%_48%)] text-white shadow-2xl">
              <div className="relative z-10 flex items-center gap-3 px-5 py-4">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/25 backdrop-blur-sm border border-white/40 text-[10px] font-bold uppercase tracking-widest">
                  <Radio className="w-3 h-3 animate-pulse" />
                  Live
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Zap className="w-4 h-4 text-yellow-300" />
                    Lightning Challenge!
                  </div>
                  <p className="text-xs opacity-95 mt-0.5">
                    You hit a {MILESTONE_GOAL}-message streak. Quick: ask the trickiest question you have.
                  </p>
                </div>
                <button
                  aria-label="Dismiss"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  onClick={() => setShowChallenge(false)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
}
