import React, { createContext, useCallback, useContext, useMemo, useState } from "react";

export type GenerationType = "image" | "video" | "audio";

export interface GenerationJob {
  id: string;
  type: GenerationType;
  createdAt: number;
}

interface GenerationsContextValue {
  jobs: GenerationJob[];
  addJob: (id: string, type: GenerationType) => void;
  removeJob: (id: string) => void;
}

const STORAGE_KEY = "gaqno-ai-generations";
const MAX_JOBS = 50;

function loadFromStorage(): GenerationJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (j): j is GenerationJob =>
        typeof j === "object" &&
        j !== null &&
        typeof (j as GenerationJob).id === "string" &&
        ["image", "video", "audio"].includes((j as GenerationJob).type) &&
        typeof (j as GenerationJob).createdAt === "number"
    );
  } catch {
    return [];
  }
}

function saveToStorage(jobs: GenerationJob[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs.slice(-MAX_JOBS)));
  } catch {
    // ignore
  }
}

const GenerationsContext = createContext<GenerationsContextValue | null>(null);

export function GenerationsProvider({ children }: { children: React.ReactNode }) {
  const [jobs, setJobs] = useState<GenerationJob[]>(() => loadFromStorage());

  const addJob = useCallback((id: string, type: GenerationType) => {
    setJobs((prev) => {
      const next = [{ id, type, createdAt: Date.now() }, ...prev.filter((j) => j.id !== id)].slice(
        0,
        MAX_JOBS
      );
      saveToStorage(next);
      return next;
    });
  }, []);

  const removeJob = useCallback((id: string) => {
    setJobs((prev) => {
      const next = prev.filter((j) => j.id !== id);
      saveToStorage(next);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ jobs, addJob, removeJob }),
    [jobs, addJob, removeJob]
  );

  return (
    <GenerationsContext.Provider value={value}>
      {children}
    </GenerationsContext.Provider>
  );
}

export function useGenerations(): GenerationsContextValue {
  const ctx = useContext(GenerationsContext);
  if (!ctx) {
    throw new Error("useGenerations must be used within GenerationsProvider");
  }
  return ctx;
}
