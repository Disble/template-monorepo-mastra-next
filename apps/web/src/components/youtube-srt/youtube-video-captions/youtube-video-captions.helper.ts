import type { Caption } from "./youtube-video-captions.type";

/**
 * Format seconds to a human-readable time string (MM:SS or HH:MM:SS)
 */
export const formatTime = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }
  return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};

/**
 * Copy all captions text to clipboard as plain text
 */
export const copyCaptionsToClipboard = async (
  captions: Caption[],
): Promise<void> => {
  try {
    const fullText = captions.map((caption) => caption.text).join(" ");
    await navigator.clipboard.writeText(fullText);
  } catch (error) {
    console.error("Error copying captions to clipboard:", error);
  }
};
