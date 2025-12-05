"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface AudioContextType {
  muted: boolean;
  toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [muted, setMuted] = useState(false); // Domyślnie dźwięk włączony

  const toggleMute = () => {
    setMuted((prev) => !prev);
  };

  return (
    <AudioContext.Provider value={{ muted, toggleMute }}>
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}

