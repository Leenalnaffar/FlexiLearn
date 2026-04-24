import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import type { LearningStyle, NeuroProfile } from "@workspace/api-client-react";

interface PreferencesState {
  learningStyle: LearningStyle | null;
  neuroProfile: NeuroProfile | null;
  topic: string;
  setPreferences: (prefs: Partial<PreferencesState>) => void;
  resetPreferences: () => void;
  reducedMotion: boolean;
}

const PreferencesContext = createContext<PreferencesState | undefined>(undefined);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [learningStyle, setLearningStyle] = useState<LearningStyle | null>(() => {
    const saved = localStorage.getItem("learningStyle");
    return saved ? (saved as LearningStyle) : null;
  });
  
  const [neuroProfile, setNeuroProfile] = useState<NeuroProfile | null>(() => {
    const saved = localStorage.getItem("neuroProfile");
    return saved ? (saved as NeuroProfile) : null;
  });

  const [topic, setTopic] = useState<string>(() => {
    return localStorage.getItem("topic") || "";
  });

  const setPreferences = (prefs: Partial<PreferencesState>) => {
    if (prefs.learningStyle !== undefined) {
      setLearningStyle(prefs.learningStyle);
      if (prefs.learningStyle) localStorage.setItem("learningStyle", prefs.learningStyle);
      else localStorage.removeItem("learningStyle");
    }
    if (prefs.neuroProfile !== undefined) {
      setNeuroProfile(prefs.neuroProfile);
      if (prefs.neuroProfile) localStorage.setItem("neuroProfile", prefs.neuroProfile);
      else localStorage.removeItem("neuroProfile");
    }
    if (prefs.topic !== undefined) {
      setTopic(prefs.topic);
      localStorage.setItem("topic", prefs.topic);
    }
  };

  const resetPreferences = () => {
    setLearningStyle(null);
    setNeuroProfile(null);
    setTopic("");
    localStorage.removeItem("learningStyle");
    localStorage.removeItem("neuroProfile");
    localStorage.removeItem("topic");
    // Also clear persisted chat session so the next launch starts fresh.
    localStorage.removeItem("flexilearn:chat:state:v1");
  };

  const isSensorySafe = neuroProfile === "autism";

  // Apply theme class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isSensorySafe) {
      root.classList.add("theme-sensory-safe");
    } else {
      root.classList.remove("theme-sensory-safe");
    }
  }, [isSensorySafe]);

  return (
    <PreferencesContext.Provider 
      value={{ 
        learningStyle, 
        neuroProfile, 
        topic, 
        setPreferences, 
        resetPreferences,
        reducedMotion: isSensorySafe
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}