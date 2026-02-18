import { create } from "zustand";
import type { StoryAnalyzerFormData } from "#components/story-analyzer/story-analyzer-form";

interface StoryAnalyzerDashboardState {
  hydratedFormInput: Partial<StoryAnalyzerFormData> | null;
  setHydratedFormInput: (input: Partial<StoryAnalyzerFormData> | null) => void;
}

export const useStoryAnalyzerDashboardStore =
  create<StoryAnalyzerDashboardState>((set) => ({
    hydratedFormInput: null,
    setHydratedFormInput: (input) => set({ hydratedFormInput: input }),
  }));
