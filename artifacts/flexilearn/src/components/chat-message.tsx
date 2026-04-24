import { useEffect, useMemo, useRef, useState } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import {
  Download,
  FileText,
  Volume2,
  StopCircle,
  Youtube,
  Headphones,
  ExternalLink,
} from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";
import { MotionDiv } from "@/components/motion-wrapper";
import { ChatMessage as ApiChatMessage } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

export interface ResourceLink {
  kind: "video" | "podcast";
  label: string;
  url: string;
}

interface ChatMessageProps {
  message: ApiChatMessage;
  mermaidCode?: string;
  resources?: ResourceLink[];
}

/**
 * Pick the most "human-sounding" voice the browser exposes.
 * Filters for Premium / Natural / Neural / Studio / Enhanced voices and
 * prefers the user's current language.
 */
function pickHumanizedVoice(): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  const preferredKeywords = [
    "premium",
    "natural",
    "neural",
    "studio",
    "enhanced",
    "wavenet",
    "online",
  ];
  const lang = (navigator.language || "en-US").toLowerCase();
  const langPrefix = lang.split("-")[0];

  const score = (v: SpeechSynthesisVoice) => {
    let s = 0;
    const name = v.name.toLowerCase();
    for (const kw of preferredKeywords) if (name.includes(kw)) s += 5;
    if (v.lang?.toLowerCase() === lang) s += 3;
    else if (v.lang?.toLowerCase().startsWith(langPrefix)) s += 2;
    if (!v.localService) s += 1; // remote voices are usually richer
    return s;
  };

  return [...voices].sort((a, b) => score(b) - score(a))[0] ?? voices[0];
}

export function ChatMessage({ message, mermaidCode, resources }: ChatMessageProps) {
  const { learningStyle, neuroProfile } = usePreferences();
  const isUser = message.role === "user";

  const isDyslexia = neuroProfile === "dyslexia";
  const isVisual = learningStyle === "visual";
  const isReading = learningStyle === "reading";

  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (isVisual && mermaidCode && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: "default" });
      mermaid
        .render(`mermaid-${Math.random().toString(36).substring(2)}`, mermaidCode)
        .then((result) => {
          if (mermaidRef.current) {
            mermaidRef.current.innerHTML = result.svg;
          }
        })
        .catch(console.error);
    }
  }, [mermaidCode, isVisual]);

  // Stop any in-progress speech when this bubble unmounts.
  useEffect(() => {
    return () => {
      if (utteranceRef.current && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handlePlayTTS = () => {
    if (!window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(message.content);
    const voice = pickHumanizedVoice();
    if (voice) utterance.voice = voice;
    // Slightly off the robotic defaults for a warmer, more conversational feel.
    utterance.rate = 1.02;
    utterance.pitch = 1.05;
    utterance.volume = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    utteranceRef.current = utterance;
    setIsPlaying(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleDownloadMd = () => {
    const blob = new Blob([message.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "note.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const isAutism = neuroProfile === "autism";

  // Make sure voices are loaded (some browsers populate them async).
  useEffect(() => {
    if (window.speechSynthesis && window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        // No state change needed; pickHumanizedVoice reads on demand.
      };
    }
  }, []);

  const visibleResources = useMemo(
    () => (isUser ? [] : (resources ?? [])),
    [isUser, resources],
  );

  return (
    <MotionDiv
      initial={isAutism ? false : { opacity: 0, y: 10 }}
      animate={isAutism ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={isAutism ? { duration: 0 } : undefined}
      className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "message-bubble max-w-[88%] sm:max-w-[78%] rounded-3xl px-6 py-4 relative group",
          isUser ? "rounded-tr-sm glass-bubble-user" : "rounded-tl-sm glass-bubble-bot",
          isDyslexia && !isUser && "dyslexia-mode",
          isReading && !isUser && "font-serif text-[1.05rem] leading-relaxed",
        )}
      >
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.attachments.map((a, i) => {
              const isImg = a.mimeType.startsWith("image/");
              const hasData = a.dataUrl && a.dataUrl.length > 0;
              return isImg && hasData ? (
                <a key={i} href={a.dataUrl} target="_blank" rel="noreferrer" className="block">
                  <img
                    src={a.dataUrl}
                    alt={a.name}
                    className="max-h-48 max-w-full rounded-xl border border-border object-cover"
                  />
                </a>
              ) : (
                <div
                  key={i}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border text-xs"
                >
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-[200px]">{a.name}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="whitespace-pre-wrap leading-relaxed">{message.content}</div>

        {isVisual && mermaidCode && !isUser && (
          <div className="mt-4 p-4 bg-card border border-border rounded-xl overflow-hidden flex justify-center">
            <div ref={mermaidRef} className="max-w-full overflow-x-auto" />
          </div>
        )}

        {visibleResources.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {visibleResources.map((r, i) => {
              const Icon = r.kind === "video" ? Youtube : Headphones;
              return (
                <a
                  key={i}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors",
                    "border-border bg-card hover:bg-muted text-foreground",
                  )}
                  title={r.url}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="max-w-[220px] truncate">{r.label}</span>
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              );
            })}
          </div>
        )}

        {!isUser && (
          <div className="mt-3 flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlayTTS}
              className="gap-1.5 h-8 rounded-lg text-xs text-muted-foreground hover:text-foreground"
              title={isPlaying ? "Stop reading" : "Read aloud"}
              aria-label={isPlaying ? "Stop reading" : "Read aloud"}
            >
              {isPlaying ? (
                <>
                  <StopCircle className="w-3.5 h-3.5" /> Stop
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5" /> Listen
                </>
              )}
            </Button>
            {isReading && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadMd}
                className="gap-1.5 h-8 rounded-lg text-xs"
              >
                <Download className="w-3.5 h-3.5" /> Save Note
              </Button>
            )}
          </div>
        )}
      </div>
    </MotionDiv>
  );
}
