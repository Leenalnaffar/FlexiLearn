import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Download, Volume2, VolumeX, FileText } from "lucide-react";
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
        <a
          key={i}
          href={mdLink[2]}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 font-medium"
          style={{ color: "#E56B6F" }}
        >
          {mdLink[1]}
        </a>
      );
    }
    if (/^https?:\/\//.test(seg)) {
      return (
        <a
          key={i}
          href={seg}
          target="_blank"
          rel="noreferrer noopener"
          className="underline underline-offset-2 font-medium break-all"
          style={{ color: "#E56B6F" }}
        >
          {seg}
        </a>
      );
    }
    return <span key={i}>{seg}</span>;
  });
}

export function ChatMessage({ message, mermaidCode }: ChatMessageProps) {
  const { learningStyle, neuroProfile } = usePreferences();
  const isUser = message.role === "user";

  const isDyslexia = neuroProfile === "dyslexia";
  const isVisual = learningStyle === "visual";
  const isReading = learningStyle === "reading";

  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoadingTTS, setIsLoadingTTS] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isVisual && mermaidCode && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
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

  const handlePlayTTS = async () => {
    // Stop current playback if already playing
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
      return;
    }

    setIsLoadingTTS(true);
    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: message.content }),
      });
      if (!res.ok) throw new Error(`TTS request failed: ${res.status}`);

      // Use MediaSource for streaming playback so audio begins on first chunk
      const supportsStreaming =
        res.body &&
        typeof window.MediaSource !== "undefined" &&
        MediaSource.isTypeSupported("audio/mpeg");

      if (supportsStreaming) {
        const mediaSource = new MediaSource();
        const audioUrl = URL.createObjectURL(mediaSource);
        const audio = new Audio(audioUrl);
        audioRef.current = audio;

        const cleanup = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(audioUrl);
          audioRef.current = null;
        };
        audio.onended = cleanup;
        audio.onerror = cleanup;

        // Begin playing as soon as the browser has buffered enough to start
        audio.addEventListener(
          "canplay",
          () => {
            setIsLoadingTTS(false);
            audio.play().then(() => setIsPlaying(true)).catch(cleanup);
          },
          { once: true },
        );

        mediaSource.addEventListener("sourceopen", () => {
          const sourceBuffer = mediaSource.addSourceBuffer("audio/mpeg");
          const reader = res.body!.getReader();
          const queue: Uint8Array[] = [];
          let appending = false;
          let streamDone = false;

          const tryFlush = () => {
            if (appending || queue.length === 0) {
              if (streamDone && !appending && queue.length === 0) {
                try { mediaSource.endOfStream(); } catch { /* already closed */ }
              }
              return;
            }
            appending = true;
            sourceBuffer.appendBuffer(queue.shift()!);
          };

          sourceBuffer.addEventListener("updateend", () => {
            appending = false;
            tryFlush();
          });

          const pump = (): void => {
            reader.read().then(({ done, value }) => {
              if (done) {
                streamDone = true;
                tryFlush();
                return;
              }
              queue.push(value);
              tryFlush();
              pump();
            }).catch(cleanup);
          };
          pump();
        });
      } else {
        // Fallback: buffer full response then play
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audioRef.current = audio;

        const cleanup = () => {
          setIsPlaying(false);
          URL.revokeObjectURL(url);
          audioRef.current = null;
        };
        audio.onended = cleanup;
        audio.onerror = cleanup;
        setIsLoadingTTS(false);
        await audio.play();
        setIsPlaying(true);
      }
    } catch {
      setIsPlaying(false);
      setIsLoadingTTS(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    }
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
        {!isUser && (
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute -right-12 top-0 h-9 w-9 rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
              isPlaying && "opacity-100",
            )}
            style={{
              background: isPlaying ? "hsl(158 44% 62% / 0.15)" : undefined,
              color: isPlaying ? "#75C9A8" : "#7A8B99",
            }}
            onClick={handlePlayTTS}
            disabled={isLoadingTTS}
            aria-label={isPlaying ? "Stop playback" : "Listen to this response"}
            title={isPlaying ? "Stop" : "Listen"}
          >
            {isPlaying ? (
              <VolumeX className="w-4 h-4 animate-pulse" />
            ) : (
              <Volume2 className={cn("w-4 h-4", isLoadingTTS && "animate-pulse opacity-50")} />
            )}
          </Button>
        )}

        {isUser && message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.attachments.map((a, i) => {
              const isImg = a.mimeType.startsWith("image/");
              return isImg ? (
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

        <div className="whitespace-pre-wrap leading-relaxed">{renderContent(message.content)}</div>

        {isVisual && mermaidCode && !isUser && (
          <div className="mt-4 p-4 bg-white/80 border border-border rounded-xl overflow-hidden flex justify-center">
            <div ref={mermaidRef} className="max-w-full overflow-x-auto" />
          </div>
        )}

        {!isUser && isReading && (
          <div className="mt-4 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
            <Button variant="outline" size="sm" onClick={handleDownloadMd} className="gap-2 rounded-lg">
              <Download className="w-4 h-4" /> Download Note
            </Button>
          </div>
        )}
      </div>
    </MotionDiv>
  );
}
