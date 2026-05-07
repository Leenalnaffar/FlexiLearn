import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";
import { MotionDiv } from "@/components/motion-wrapper";
import { ChatMessage as ApiChatMessage } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ApiChatMessage;
  mermaidCode?: string;
}

function renderContent(text: string): React.ReactNode[] {
  const segments = text.split(/(https?:\/\/[^\s\n,;>)"'\]]+|\[[^\]]+\]\(https?:\/\/[^)]+\))/g);
  return segments.map((seg, i) => {
    const mdLink = seg.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (mdLink) {
      return (
        <a key={i} href={mdLink[2]} target="_blank" rel="noreferrer noopener"
          className="underline underline-offset-2 font-medium" style={{ color: "#E56B6F" }}>
          {mdLink[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(seg)) {
      return (
        <a key={i} href={seg} target="_blank" rel="noreferrer noopener"
          className="underline underline-offset-2 font-medium break-all" style={{ color: "#E56B6F" }}>
          {seg}
        </a>
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

function prepareTextForSpeech(raw: string): string {
  let t = raw;
  t = t.replace(/```mermaid[\s\S]*?```/gi, "");
  t = t.replace(/```[\s\S]*?```/g, "");
  t = t.replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1");
  t = t.replace(/https?:\/\/\S+/g, "");
  t = t.replace(/^Listen\s*&\s*watch\s*$/gim, "Here are some resources to explore.");
  t = t.replace(/^Read\s*further\s*$/gim, "For further reading, consider these sources.");
  t = t.replace(/^-\s+/gm, "");
  t = t.replace(/^#{1,6}\s+/gm, "");
  t = t.replace(/\n{3,}/g, "\n\n").trim();
  return t;
}

function pickVoice(): SpeechSynthesisVoice | null {
  const voices = window.speechSynthesis.getVoices();
  const preferred = [
    "Google UK English Female",
    "Google US English",
    "Microsoft Zira - English (United States)",
    "Samantha",
    "Karen",
    "Moira",
    "Fiona",
    "Victoria",
  ];
  for (const name of preferred) {
    const match = voices.find((v) => v.name === name && v.lang.startsWith("en"));
    if (match) return match;
  }
  return voices.find((v) => v.lang.startsWith("en") && !v.name.toLowerCase().includes("male")) ??
    voices.find((v) => v.lang.startsWith("en")) ??
    null;
}

function WaveformBars({ playing }: { playing: boolean }) {
  return (
    <span aria-hidden style={{ display: "inline-flex", alignItems: "flex-end", gap: "2px", height: "14px", marginRight: "4px" }}>
      {[0, 1, 2, 3].map((i) => (
        <span key={i} style={{
          display: "block",
          width: "3px",
          borderRadius: "2px",
          background: "#75C9A8",
          height: playing ? undefined : "4px",
          animation: playing ? `tts-bar ${0.7 + i * 0.15}s ease-in-out ${i * 0.1}s infinite alternate` : "none",
          minHeight: "3px",
          maxHeight: "13px",
        }} />
      ))}
      <style>{`@keyframes tts-bar { from { height: 3px; } to { height: 13px; } }`}</style>
    </span>
  );
}

export function ChatMessage({ message, mermaidCode }: ChatMessageProps) {
  const { learningStyle, neuroProfile } = usePreferences();
  const isUser = message.role === "user";
  const isDyslexia = neuroProfile === "dyslexia";
  const isVisual = learningStyle === "visual";
  const isReading = learningStyle === "reading";

  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const uttRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (isVisual && mermaidCode && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
      mermaid
        .render(`mermaid-${Math.random().toString(36).substring(2)}`, mermaidCode)
        .then((result) => { if (mermaidRef.current) mermaidRef.current.innerHTML = result.svg; })
        .catch(console.error);
    }
  }, [mermaidCode, isVisual]);

  useEffect(() => {
    return () => {
      if (isPlaying) window.speechSynthesis.cancel();
    };
  }, [isPlaying]);

  const handleSpeak = () => {
    if (!("speechSynthesis" in window)) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      uttRef.current = null;
      setIsPlaying(false);
      return;
    }

    window.speechSynthesis.cancel();

    const text = prepareTextForSpeech(message.content);
    if (!text) return;

    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = "en-US";
    utt.rate = 0.95;
    utt.pitch = 1.05;

    const trySetVoice = () => {
      const voice = pickVoice();
      if (voice) utt.voice = voice;
    };

    if (window.speechSynthesis.getVoices().length > 0) {
      trySetVoice();
    } else {
      window.speechSynthesis.addEventListener("voiceschanged", trySetVoice, { once: true });
    }

    utt.onstart = () => setIsPlaying(true);
    utt.onend = () => { setIsPlaying(false); uttRef.current = null; };
    utt.onerror = () => { setIsPlaying(false); uttRef.current = null; };

    uttRef.current = utt;
    window.speechSynthesis.speak(utt);
    setIsPlaying(true);
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
  const hasSpeech = typeof window !== "undefined" && "speechSynthesis" in window;

  return (
    <MotionDiv
      initial={isAutism ? false : { opacity: 0, y: 10 }}
      animate={isAutism ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={isAutism ? { duration: 0 } : undefined}
      className={cn("flex w-full mb-6", isUser ? "justify-end" : "justify-start")}
    >
      <div className={cn(
        "message-bubble max-w-[88%] sm:max-w-[78%] rounded-3xl px-6 py-4 relative group",
        isUser ? "rounded-tr-sm glass-bubble-user" : "rounded-tl-sm glass-bubble-bot",
        isDyslexia && !isUser && "dyslexia-mode",
        isReading && !isUser && "font-serif text-[1.05rem] leading-relaxed",
      )}>
        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.attachments.map((a, i) => {
              const isImg = a.mimeType.startsWith("image/");
              return isImg ? (
                <a key={i} href={a.dataUrl} target="_blank" rel="noreferrer" className="block">
                  <img src={a.dataUrl} alt={a.name}
                    className="max-h-48 max-w-full rounded-xl border border-border object-cover" />
                </a>
              ) : (
                <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-muted border border-border text-xs">
                  <FileText className="w-4 h-4 shrink-0" />
                  <span className="truncate max-w-[200px]">{a.name}</span>
                </div>
              );
            })}
          </div>
        )}

        <div className="whitespace-pre-wrap leading-relaxed">{renderContent(message.content)}</div>

        {isVisual && mermaidCode && !isUser && (
          <div className="mt-4 p-4 bg-white/80 border border-border rounded-xl overflow-hidden flex justify-center">
            <div ref={mermaidRef} className="max-w-full overflow-x-auto" />
          </div>
        )}

        {!isUser && hasSpeech && (
          <div className={cn("mt-3 flex items-center gap-2", isReading ? "justify-between" : "justify-start")}>
            <button
              type="button"
              onClick={handleSpeak}
              aria-label={isPlaying ? "Stop audio" : "Listen to this response"}
              title={isPlaying ? "Stop" : "Listen"}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.72rem",
                fontWeight: 500,
                letterSpacing: "0.01em",
                padding: "4px 10px 4px 8px",
                borderRadius: "999px",
                border: isPlaying ? "1px solid rgba(117,201,168,0.45)" : "1px solid rgba(122,139,153,0.25)",
                background: isPlaying ? "rgba(117,201,168,0.12)" : "rgba(122,139,153,0.08)",
                color: isPlaying ? "#75C9A8" : "#7A8B99",
                cursor: "pointer",
                transition: "all 0.2s ease",
                userSelect: "none",
              }}
            >
              <WaveformBars playing={isPlaying} />
              <span>{isPlaying ? "Stop" : "Listen"}</span>
            </button>

            {isReading && (
              <Button variant="outline" size="sm" onClick={handleDownloadMd} className="gap-2 rounded-lg">
                <Download className="w-4 h-4" /> Download Note
              </Button>
            )}
          </div>
        )}
      </div>
    </MotionDiv>
  );
}
