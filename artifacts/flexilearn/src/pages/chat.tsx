import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { usePreferences } from "@/hooks/use-preferences";
import { useSendChatMessage, useGetSessionMap, ChatMessage as ApiChatMessage, ChatAttachment, ChatResponseAgent } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowUp, Sparkles, Map as MapIcon, GraduationCap, Medal, ArrowLeft, Paperclip, X, FileText, Image as ImageIcon } from "lucide-react";
import { FocusTimer } from "@/components/focus-timer";
import { ChatMessage } from "@/components/chat-message";
import { MotionDiv } from "@/components/motion-wrapper";
import { cn } from "@/lib/utils";

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
  const [uploadError, setUploadError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const sendMessage = useSendChatMessage();
  const getSessionMap = useGetSessionMap();

  useEffect(() => {
    if (!learningStyle || !neuroProfile) {
      setLocation("/");
    }
  }, [learningStyle, neuroProfile, setLocation]);

  useEffect(() => {
    if (neuroProfile === "autism" && (topic || history.length > 0) && !getSessionMap.data) {
      getSessionMap.mutate({
        data: { topic: topic || "Current topic", learningStyle: learningStyle!, neuroProfile: neuroProfile }
      });
    }
  }, [neuroProfile, topic, history.length, getSessionMap.data, learningStyle]);

  useEffect(() => {
    if (scrollRef.current) {
      const scrollableNode = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableNode) {
        scrollableNode.scrollTop = scrollableNode.scrollHeight;
      }
    }
  }, [history, sendMessage.isPending]);

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

    sendMessage.mutate({
      data: {
        learningStyle,
        neuroProfile,
        topic,
        history,
        message: messageText,
        ...(attachmentsForMsg ? { attachments: attachmentsForMsg } : {}),
      }
    }, {
      onSuccess: (data) => {
        const assistantMsg: ApiChatMessage = { role: "assistant", content: data.reply };
        setHistory(prev => [...prev, assistantMsg]);
        setActiveAgent(data.agent);
        
        if (data.mermaid) {
          setMermaids(prev => ({ ...prev, [currentHistory.length]: data.mermaid! }));
        }

        if (neuroProfile === "adhd") {
          const awarded = data.rewardPoints || 10;
          setPoints(prev => prev + awarded);
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 2000);
        }
      }
    });
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
      case "visualizer": return { name: "Visualizer", icon: Sparkles };
      case "narrator": return { name: "Narrator", icon: Sparkles };
      case "scrivener": return { name: "Scrivener", icon: Sparkles };
      case "protege": return { name: "Protégé", icon: GraduationCap };
      default: return { name: "Manager", icon: Sparkles };
    }
  };

  const agentDisplay = getAgentDisplay();
  const AgentIcon = agentDisplay.icon;

  if (!learningStyle || !neuroProfile) return null;

  return (
    <div className="flex h-[100dvh] bg-background">
      {/* Session Map Sidebar (Autism Mode) */}
      {isAutism && (
        <div className="w-80 border-r border-border bg-sidebar shrink-0 hidden md:flex flex-col">
          <div className="p-6 border-b border-border">
            <h2 className="font-semibold flex items-center gap-2 text-sidebar-foreground">
              <MapIcon className="w-5 h-5 text-sidebar-primary" />
              Session Map
            </h2>
            <p className="text-sm text-muted-foreground mt-1">Predictable learning flow</p>
          </div>
          <ScrollArea className="flex-1 p-6">
            {getSessionMap.isPending && <div className="text-sm text-muted-foreground">Loading map...</div>}
            {getSessionMap.data?.steps.map((step, idx) => (
              <div key={idx} className="mb-6 relative">
                <div className="absolute left-3 top-8 bottom-[-24px] w-px bg-border last:hidden" />
                <div className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 z-10 font-medium text-xs border border-primary/20">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-foreground">{step.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-2">{step.description}</p>
                    <span className="inline-flex px-2 py-0.5 rounded-full bg-muted text-[10px] font-medium">
                      {step.durationMinutes} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card/50 backdrop-blur-sm z-10 shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <AgentIcon className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-semibold text-foreground leading-tight">{agentDisplay.name}</h1>
                <p className="text-xs text-muted-foreground capitalize flex items-center gap-2">
                  {learningStyle} • {neuroProfile}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {isKinesthetic && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-accent/20 text-accent-foreground rounded-full text-xs font-medium border border-accent/20">
                <GraduationCap className="w-3.5 h-3.5" />
                You are the teacher
              </div>
            )}
            <FocusTimer />
            {neuroProfile === "adhd" && (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/30 text-secondary-foreground rounded-full font-medium border border-secondary/30 relative">
                <Medal className="w-4 h-4 text-yellow-600" />
                <span>{points} pts</span>
                {showCelebration && (
                  <MotionDiv
                    initial={{ opacity: 0, y: 10, scale: 0.5 }}
                    animate={{ opacity: 1, y: -20, scale: 1.2 }}
                    exit={{ opacity: 0 }}
                    className="absolute -top-6 text-yellow-500 font-bold"
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
          <div className={cn("max-w-3xl mx-auto flex flex-col justify-end min-h-full pb-4", isAutism ? "message-list" : "")}>
            {history.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4 text-muted-foreground opacity-60 my-20">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                  <Sparkles className="w-8 h-8" />
                </div>
                <p>Start your customized learning session.</p>
              </div>
            ) : (
              history.map((msg, i) => (
                <ChatMessage 
                  key={i} 
                  message={msg} 
                  mermaidCode={mermaids[i]} 
                />
              ))
            )}
            {sendMessage.isPending && (
              <div className="flex justify-start mb-6">
                <div className="bg-card border border-border rounded-3xl rounded-tl-sm px-6 py-4 flex gap-2 items-center text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-primary/80 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 sm:p-6 bg-background border-t border-border shrink-0">
          <div className="max-w-3xl mx-auto">
            {pendingAttachments.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {pendingAttachments.map((a, idx) => {
                  const isImage = a.mimeType.startsWith("image/");
                  return (
                    <div
                      key={idx}
                      className="group relative flex items-center gap-2 pl-2 pr-8 py-2 bg-card border border-border rounded-xl text-xs"
                    >
                      {isImage ? (
                        <img
                          src={a.dataUrl}
                          alt={a.name}
                          className="w-10 h-10 object-cover rounded-md"
                        />
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
            {uploadError && (
              <div className="mb-2 text-xs text-destructive">{uploadError}</div>
            )}
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
                aria-label="Attach files or images"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isKinesthetic ? "Teach your student..." : "Type your message..."}
                className="h-14 pl-14 pr-14 rounded-2xl bg-card border-border shadow-sm text-base placeholder:text-muted-foreground"
                disabled={sendMessage.isPending}
              />
              <Button
                size="icon"
                className="absolute right-2 w-10 h-10 rounded-xl"
                disabled={(!input.trim() && pendingAttachments.length === 0) || sendMessage.isPending}
                onClick={handleSend}
              >
                <ArrowUp className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div className="max-w-3xl mx-auto text-center mt-2">
            <p className="text-[10px] text-muted-foreground">FlexiLearn AI is adapting to your {learningStyle} style. Attach images or text files for richer lessons.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
