import googleapis from "@googleapis/youtube";
import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.YOUTUBE_CLIENT_ID,
  process.env.YOUTUBE_CLIENT_SECRET,
  process.env.YOUTUBE_REDIRECT_URI || "http://localhost:3000/oauth2callback",
);

// Set credentials if you have a refresh token
if (process.env.YOUTUBE_REFRESH_TOKEN) {
  oauth2Client.setCredentials({
    refresh_token: process.env.YOUTUBE_REFRESH_TOKEN,
  });
}

const youtubeClient = googleapis.youtube({
  version: "v3",
  auth: oauth2Client,
});

async function getCaptions() {
  try {
    const res = await youtubeClient.captions.list({
      part: ["snippet", "id"],
      videoId: "l_XhKu3xYEU",
    });
    console.log("Captions:", res.data);

    const captionId = res.data.items?.[0]?.id;
    if (!captionId) {
      console.log("No captions found for this video.");
      return;
    }

    const captionRes = await youtubeClient.captions.download(
      {
        id: captionId,
        tfmt: "srt",
      },
      {
        responseType: "stream",
      },
    );

    let captionData = "";

    captionRes.data.on("data", (chunk) => {
      captionData += chunk;
    });

    captionRes.data.on("end", () => {
      console.log("Caption Data:", captionData);
    });
  } catch (err) {
    console.error("Error fetching captions:", err);
  }
}

getCaptions();
