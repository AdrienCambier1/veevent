"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface HeaderContextType {
  hideCitySelector: boolean;
  setHideCitySelector: (hide: boolean) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export function HeaderProvider({ children }: { children: ReactNode }) {
  const [hideCitySelector, setHideCitySelector] = useState(false);

  return (
    <HeaderContext.Provider value={{ hideCitySelector, setHideCitySelector }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error("useHeader must be used within a HeaderProvider");
  }
  return context;
}
