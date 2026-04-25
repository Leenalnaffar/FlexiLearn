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
      className="flex items-center gap-3 glass-on-cream px-3 py-2 rounded-2xl"
    >
      <div className="relative w-9 h-9">
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 40 40">
          <circle cx="20" cy="20" r={r} stroke="currentColor" strokeWidth="3" fill="none" className="text-foreground/15" />
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
              <stop offset="0%" stopColor="#E56B6F" />
              <stop offset="100%" stopColor="#75C9A8" />
            </linearGradient>
          </defs>
        </svg>
        <Timer className="absolute inset-0 m-auto w-3.5 h-3.5 text-primary" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "#7A8B99" }}>Focus</span>
        <span className="font-mono font-medium text-sm text-white">
          {minutes.toString().padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </span>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 rounded-full hover:bg-white/10"
        style={{ color: "#E56B6F" }}
        onClick={() => setIsActive(!isActive)}
      >
        {isActive ? <Square className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
      </Button>
    </MotionDiv>
  );
}
