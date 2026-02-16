import type { Readable } from "node:stream";
import googleapis from "@googleapis/youtube";
import { getGoogleTokens } from "@repo/db";
import { google } from "googleapis";
import { logger } from "../../../logger";

/**
 * Extracts the video ID from various YouTube URL formats
 */
export function extractVideoID(url: string): string {
  const urlObj = new URL(url);
  if (urlObj.hostname === "youtu.be") {
    return urlObj.pathname.slice(1);
  }
  if (!urlObj.hostname.includes("youtube.com")) {
    throw new Error("Invalid YouTube URL");
  }

  // Handle /live/{videoID} format
  if (urlObj.pathname.startsWith("/live/")) {
    const videoId = urlObj.pathname.split("/")[2];
    if (!videoId) {
      throw new Error("Invalid YouTube live URL format");
    }
    return videoId;
  }
  // Handle standard ?v={videoID} format
  const videoId = urlObj.searchParams.get("v");
  if (!videoId) {
    throw new Error("Video ID not found in URL");
  }

  return videoId;
}

/**
 * Reads a Node.js stream and returns the content as a string
 */
export async function streamToString(stream: Readable): Promise<string> {
  const chunks: Buffer[] = [];

  return new Promise((resolve, reject) => {
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  });
}

/**
 * Downloads YouTube captions using the official YouTube Data API v3
 * This function replicates the implementation from youtube-captions.ts
 */
export async function downloadCaptionsWithYouTubeAPI(
  url: string,
  userId: string,
): Promise<string> {
  const tokens = await getGoogleTokens(userId);

  logger.info({ url }, "Starting download of captions using YouTube API");

  const langCode = "es"; // Spanish language code

  // Validate environment variables
  if (!process.env.YOUTUBE_CLIENT_ID || !process.env.YOUTUBE_CLIENT_SECRET) {
    throw new Error(
      "YouTube OAuth credentials not configured. Set YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET",
    );
  }

  if (!tokens?.refreshToken) {
    throw new Error(
      "YOUTUBE_REFRESH_TOKEN not found in environment variables or user tokens. Ensure you have a valid refresh token for the YouTube API.",
    );
  }

  try {
    const videoID = extractVideoID(url);
    logger.debug({ videoID }, "Video ID extracted");

    // Configure OAuth2 client
    const oauth2Client = new google.auth.OAuth2(
      process.env.YOUTUBE_CLIENT_ID,
      process.env.YOUTUBE_CLIENT_SECRET,
      process.env.YOUTUBE_REDIRECT_URI ||
        "http://localhost:3000/oauth2callback",
    );

    // Set refresh token credentials
    oauth2Client.setCredentials({
      refresh_token: tokens.refreshToken,
    });

    // Initialize YouTube client
    const youtubeClient = googleapis.youtube({
      version: "v3",
      auth: oauth2Client,
    });

    // List available captions for the video
    logger.debug({ videoID }, "Fetching available captions");
    const captionsListResponse = await youtubeClient.captions.list({
      part: ["snippet", "id"],
      videoId: videoID,
    });

    const captionItems = captionsListResponse.data.items;
    if (!captionItems || captionItems.length === 0) {
      throw new Error(`No captions found for video: ${videoID}`);
    }

    // Find caption in the desired language or fallback to first available
    let captionTrack = captionItems.find(
      (item) => item.snippet?.language === langCode,
    );

    if (!captionTrack) {
      logger.warn(
        {
          requestedLanguage: langCode,
          fallbackLanguage: captionItems[0]?.snippet?.language,
        },
        "Requested caption language not found, using first available",
      );
      captionTrack = captionItems[0];
    }

    if (!captionTrack?.id) {
      throw new Error("Caption ID not found");
    }

    const captionId = captionTrack.id;

    logger.info(
      {
        language: captionTrack.snippet?.language,
        trackName: captionTrack.snippet?.name,
      },
      "Found caption track",
    );

    // Download caption in SRT format
    logger.debug({ captionId }, "Downloading caption content");
    const captionResponse = await youtubeClient.captions.download(
      {
        id: captionId,
        tfmt: "srt",
      },
      {
        responseType: "stream",
      },
    );

    // Read the stream content
    const srtContent = await streamToString(captionResponse.data as Readable);

    logger.info({ length: srtContent.length }, "Caption content downloaded");
    logger.debug(
      { preview: srtContent.substring(0, 200) },
      "First 200 characters of SRT content",
    );

    if (!srtContent || srtContent.trim().length === 0) {
      throw new Error("SRT content is empty");
    }

    logger.info("Successfully downloaded SRT captions");

    return srtContent;
  } catch (error) {
    logger.error(
      { err: error, url, userId },
      "Error downloading captions with YouTube API",
    );
    throw new Error(
      `Failed to download captions: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
