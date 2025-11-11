"use client";

import { useQueryStates } from "nuqs";
import { runIdSearchParams } from "#app/search-params";
import { ContentForm } from "#components/content-form";
import { WorkflowMonitor } from "#components/workflow-monitor";
import { YoutubeVideoChapters } from "#components/youtube-video-chapters";

export function YoutubeChaptersGenerator() {
  const [query] = useQueryStates(runIdSearchParams);
  return (
    <div className="space-y-6">
      <ContentForm />
      {query.runId.length > 0 && (
        <>
          {/* Real-time workflow status */}
          <div className="mt-6">
            <WorkflowMonitor
              runId={query.runId}
              loadingMessage="Generating video chapters..."
              showStepDetails={true}
            />
          </div>

          {/* Final results */}
          <YoutubeVideoChapters />
        </>
      )}
    </div>
  );
}
