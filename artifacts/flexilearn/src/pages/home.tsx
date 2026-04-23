import { useState } from "react";
import { useLocation } from "wouter";
import { usePreferences } from "@/hooks/use-preferences";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LearningStyle, NeuroProfile } from "@workspace/api-client-react";
import { MotionDiv } from "@/components/motion-wrapper";
import { Sparkles, BrainCircuit, Activity } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();
  const { learningStyle, neuroProfile, topic, setPreferences } = usePreferences();
  
  const [localStyle, setLocalStyle] = useState<LearningStyle | null>(learningStyle);
  const [localNeuro, setLocalNeuro] = useState<NeuroProfile | null>(neuroProfile);
  const [localTopic, setLocalTopic] = useState<string>(topic);

  const handleStart = () => {
    if (!localStyle || !localNeuro) return;
    setPreferences({
      learningStyle: localStyle,
      neuroProfile: localNeuro,
      topic: localTopic
    });
    setLocation("/chat");
  };

  return (
    <div className="min-h-[100dvh] flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-background">
      
      {/* Decorative background blobs */}
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full bg-primary/20 blur-3xl pointer-events-none"
      />
      <MotionDiv
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.5, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full bg-secondary/20 blur-3xl pointer-events-none"
      />

      <div className="z-10 w-full max-w-md">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-6 text-primary">
            <Sparkles className="w-8 h-8" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight">Welcome to FlexiLearn</h1>
          <p className="text-lg text-muted-foreground">
            Your personalized learning companion. Tell us how you learn best, and we'll adapt to you.
          </p>
        </MotionDiv>

        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-card p-6 sm:p-8 rounded-3xl shadow-xl shadow-primary/5 border border-border"
        >
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Personalize Your Experience
          </h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic (Optional)</label>
              <input 
                type="text"
                placeholder="What do you want to learn?"
                className="flex h-12 w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={localTopic}
                onChange={(e) => setLocalTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Learning Style</label>
              <Select value={localStyle || ""} onValueChange={(v) => setLocalStyle(v as LearningStyle)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select how you learn" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="visual">Visual</SelectItem>
                  <SelectItem value="auditory">Auditory</SelectItem>
                  <SelectItem value="reading">Reading / Writing</SelectItem>
                  <SelectItem value="kinesthetic">Kinesthetic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Neuro-Profile</label>
              <Select value={localNeuro || ""} onValueChange={(v) => setLocalNeuro(v as NeuroProfile)}>
                <SelectTrigger className="h-12 rounded-xl">
                  <SelectValue placeholder="Select a profile" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">General / Standard</SelectItem>
                  <SelectItem value="adhd">ADHD (Focus Sprint)</SelectItem>
                  <SelectItem value="autism">Autism (Sensory-Safe)</SelectItem>
                  <SelectItem value="dyslexia">Dyslexia (Decoding)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              size="lg" 
              className="w-full h-14 text-base font-medium rounded-xl mt-4"
              disabled={!localStyle || !localNeuro}
              onClick={handleStart}
            >
              Start Learning
            </Button>
          </div>
        </MotionDiv>
      </div>
    </div>
  );
}
