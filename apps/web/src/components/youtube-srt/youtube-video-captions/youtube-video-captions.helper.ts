import type { Caption } from "./youtube-video-captions.type";

/**
 * Parse SRT timestamp to seconds
 * Format: HH:MM:SS,mmm or MM:SS,mmm
 */
const parseTimestamp = (timestamp: string): number => {
  const parts = timestamp.split(":");
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (parts.length === 3) {
    const [h, m, s] = parts;
    if (h && m && s) {
      hours = Number.parseInt(h, 10);
      minutes = Number.parseInt(m, 10);
      const [secs, milliseconds] = s.split(",");
      if (secs && milliseconds) {
        seconds = Number.parseFloat(`${secs}.${milliseconds}`);
      }
    }
  } else if (parts.length === 2) {
    const [m, s] = parts;
    if (m && s) {
      minutes = Number.parseInt(m, 10);
      const [secs, milliseconds] = s.split(",");
      if (secs && milliseconds) {
        seconds = Number.parseFloat(`${secs}.${milliseconds}`);
      }
    }
  }

  return hours * 3600 + minutes * 60 + seconds;
};

/**
 * Parse SRT format string to Caption array
 */
export const parseSRT = (srtContent: string): Caption[] => {
  const captions: Caption[] = [];
  const blocks = srtContent.trim().split(/\n\s*\n/);

  for (const block of blocks) {
    const lines = block.trim().split("\n");
    if (lines.length < 3) continue;

    // Extract timestamp line (format: 00:00:00,000 --> 00:00:05,000)
    const timestampLine = lines[1];
    if (!timestampLine) continue;

    const timestampMatch = timestampLine.match(
      /(\d{1,2}:\d{2}:\d{2},\d{3})\s*-->\s*(\d{1,2}:\d{2}:\d{2},\d{3})/,
    );

    if (!timestampMatch?.[1] || !timestampMatch[2]) continue;

    const start = parseTimestamp(timestampMatch[1]);
    const end = parseTimestamp(timestampMatch[2]);
    const duration = end - start;

    // Join remaining lines as caption text
    const text = lines.slice(2).join(" ").trim();

    captions.push({
      start: start.toString(),
      dur: duration.toString(),
      text,
    });
  }

  return captions;
};

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
 * Copy raw SRT content to clipboard
 */
export const copyCaptionsToClipboard = async (
  srtContent: string | null,
): Promise<void> => {
  if (!srtContent) {
    console.error("No SRT content to copy");
    return;
  }

  try {
    await navigator.clipboard.writeText(srtContent);
  } catch (error) {
    console.error("Error copying captions to clipboard:", error);
  }
};
