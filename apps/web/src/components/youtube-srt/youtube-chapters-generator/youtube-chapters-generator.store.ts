import { create } from "zustand";
import type { YoutubeContentFormData } from "#components/youtube-srt/content-form";

interface YoutubeDashboardState {
  hydratedFormInput: Partial<YoutubeContentFormData> | null;
  setHydratedFormInput: (input: Partial<YoutubeContentFormData> | null) => void;
}

export const useYoutubeChaptersGeneratorStore = create<YoutubeDashboardState>(
  (set) => ({
    hydratedFormInput: null,
    setHydratedFormInput: (input) => set({ hydratedFormInput: input }),
  }),
);
