"use client";

import { useQueryStates } from "nuqs";
import { runIdSearchParams } from "#app/search-params";
import { ContentForm } from "#components/content-form";
import { YoutubeVideoChapters } from "#components/youtube-video-chapters";

export function YoutubeChaptersGenerator() {
  const [query] = useQueryStates(runIdSearchParams);
  return (
    <div>
      <ContentForm />
      {query.runId.length > 0 && (
        <>
          <div className="mt-4 text-green-600">
            <p>✅ Workflow started successfully!</p>
            <p>Run ID: {query.runId}</p>
          </div>
          <YoutubeVideoChapters />
        </>
      )}
    </div>
  );
}
