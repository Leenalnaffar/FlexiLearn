import { useState, useEffect, useRef } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { Play, Square } from "lucide-react";
import { MotionDiv } from "@/components/motion-wrapper";

export function FocusTimer() {
  const { neuroProfile } = usePreferences();
  const isAdhd = neuroProfile === "adhd";
  
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isActive, timeLeft]);

  if (!isAdhd) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = 100 - (timeLeft / (25 * 60)) * 100;

  return (
    <MotionDiv 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-4 bg-card px-4 py-2 rounded-2xl border border-border shadow-sm"
    >
      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
        <div 
          className="absolute bottom-0 left-0 right-0 bg-primary/40 transition-all duration-1000 ease-linear"
          style={{ height: `${progress}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold">
          {minutes}
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Focus</span>
        <span className="font-mono font-medium leading-none">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 ml-2 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </Button>
    </MotionDiv>
  );
}
