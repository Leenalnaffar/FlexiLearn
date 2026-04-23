import { useState, useEffect, useRef } from "react";
import { usePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { Play, Square, Timer } from "lucide-react";
import { MotionDiv } from "@/components/motion-wrapper";

const TOTAL = 25 * 60;

export function FocusTimer() {
  const { neuroProfile } = usePreferences();
  const isAdhd = neuroProfile === "adhd";

  const [timeLeft, setTimeLeft] = useState(TOTAL);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((p) => p - 1), 1000);
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
  const pct = ((TOTAL - timeLeft) / TOTAL) * 100;

  // SVG ring math
  const r = 16;
  const c = 2 * Math.PI * r;
  const offset = c - (pct / 100) * c;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 glass px-3 py-2 rounded-2xl"
    >
      <div className="relative w-9 h-9">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={r} stroke="currentColor" strokeWidth="3" fill="none" className="text-white/10" />
          <circle
            cx="20"
            cy="20"
            r={r}
            stroke="url(#focusGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            strokeDasharray={c}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-linear"
          />
          <defs>
            <linearGradient id="focusGrad" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="hsl(250 90% 70%)" />
              <stop offset="100%" stopColor="hsl(280 80% 70%)" />
            </linearGradient>
          </defs>
        </svg>
        <Timer className="absolute inset-0 m-auto w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Focus</span>
        <span className="font-mono font-medium text-sm">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full text-primary hover:bg-primary/10 hover:text-primary"
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </Button>
    </MotionDiv>
  );
}
