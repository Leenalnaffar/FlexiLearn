import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Button } from "@/components/ui/button";
import { Download, PlayCircle } from "lucide-react";
import { usePreferences } from "@/hooks/use-preferences";
import { MotionDiv } from "@/components/motion-wrapper";
import { ChatMessageRole, ChatMessage as ApiChatMessage } from "@workspace/api-client-react";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: ApiChatMessage;
  mermaidCode?: string;
}

export function ChatMessage({ message, mermaidCode }: ChatMessageProps) {
  const { learningStyle, neuroProfile } = usePreferences();
  const isUser = message.role === "user";
  
  const isDyslexia = neuroProfile === "dyslexia";
  const isVisual = learningStyle === "visual";
  const isAuditory = learningStyle === "auditory";
  const isReading = learningStyle === "reading";

  const mermaidRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (isVisual && mermaidCode && mermaidRef.current) {
      mermaid.initialize({ startOnLoad: false, theme: 'base' });
      mermaid.render(`mermaid-${Math.random().toString(36).substring(2)}`, mermaidCode).then((result) => {
        if (mermaidRef.current) {
          mermaidRef.current.innerHTML = result.svg;
        }
      }).catch(console.error);
    }
  }, [mermaidCode, isVisual]);

  const handlePlayTTS = () => {
    if (!window.speechSynthesis) return;
    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      return;
    }
    
    const utterance = new SpeechSynthesisUtterance(message.content);
    utterance.onend = () => setIsPlaying(false);
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

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex w-full mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div className={cn(
        "max-w-[85%] sm:max-w-[75%] rounded-3xl px-6 py-4 relative group",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-sm" 
          : "bg-card border border-border rounded-tl-sm text-card-foreground shadow-sm",
        isDyslexia && !isUser && "dyslexia-mode",
        isReading && !isUser && "font-serif prose-p:leading-relaxed text-lg"
      )}>
        {!isUser && isAuditory && (
          <Button
            variant="secondary"
            size="icon"
            className="absolute -left-12 top-0 h-10 w-10 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handlePlayTTS}
          >
            <PlayCircle className={cn("w-5 h-5", isPlaying && "text-primary animate-pulse")} />
          </Button>
        )}

        <div className="whitespace-pre-wrap leading-relaxed">
          {message.content}
        </div>

        {isVisual && mermaidCode && !isUser && (
          <div className="mt-4 p-4 bg-muted/50 rounded-xl overflow-hidden flex justify-center">
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
