import type { Chapter } from "./youtube-video-chapters.type";

/**
 * Convert timestamp to seconds
 */
export const timestampToSeconds = (timestamp: string): number | null => {
  const parts = timestamp.split(":").map(Number);

  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts;
    if (
      hours === undefined ||
      minutes === undefined ||
      seconds === undefined ||
      Number.isNaN(hours) ||
      Number.isNaN(minutes) ||
      Number.isNaN(seconds)
    )
      return null;
    return hours * 3600 + minutes * 60 + seconds;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (
      minutes === undefined ||
      seconds === undefined ||
      Number.isNaN(minutes) ||
      Number.isNaN(seconds)
    )
      return null;
    return minutes * 60 + seconds;
  }

  return null;
};

/**
 * Calculate total video duration in minutes
 */
export const calculateTotalDuration = (chapters: Chapter[]) => {
  if (chapters.length === 0) return "0";

  try {
    const lastChapter = chapters[chapters.length - 1];
    if (!lastChapter) return "?";

    const lastTimestamp = timestampToSeconds(lastChapter.timestamp);

    if (lastTimestamp === null) return "?";

    const totalMinutes = Math.round(lastTimestamp / 60);
    return totalMinutes.toString();
  } catch (error) {
    console.warn("Error calculating total duration:", error);
    return "?";
  }
};

/**
 * Normalize timestamps to HH:MM:SS format
 */
export const normalizeTimestamp = (timestamp: string): string => {
  const parts = timestamp.split(":");

  if (parts.length === 3) {
    return timestamp;
  }
  if (parts.length === 2) {
    const [minutes, seconds] = parts;
    if (minutes && seconds) {
      return `00:${minutes.padStart(2, "0")}:${seconds.padStart(2, "0")}`;
    }
  }

  return timestamp;
};

/**
 * Calculate duration between chapters
 */
export const formatDuration = (current: string, next?: string) => {
  if (!next) return "";

  try {
    const currTotalSeconds = timestampToSeconds(current);
    const nextTotalSeconds = timestampToSeconds(next);

    if (currTotalSeconds === null || nextTotalSeconds === null) {
      return "";
    }

    const durationSeconds = nextTotalSeconds - currTotalSeconds;

    if (durationSeconds <= 0) return "";

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  } catch (error) {
    console.warn("Error calculating duration:", error);
    return "";
  }
};

/**
 * Copy chapters to clipboard
 */
export const copyChaptersToClipboard = async (
  chapters: Chapter[],
): Promise<void> => {
  try {
    const fullChaptersText = chapters
      .map((chapter) => `${chapter.timestamp} ${chapter.description}`)
      .join("\n");
    await navigator.clipboard.writeText(fullChaptersText);
  } catch (error) {
    console.error("Error copying chapters to clipboard:", error);
  }
};
