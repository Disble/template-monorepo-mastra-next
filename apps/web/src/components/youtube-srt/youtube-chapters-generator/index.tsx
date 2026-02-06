"use client";

import { Button } from "@repo/ui/heroui";
import { useQueryStates } from "nuqs";
import { useCallback, useState } from "react";
import { runIdSearchParams } from "#app/search-params";
import { WorkflowMonitor } from "#components/commons/workflow-monitor";
import { ContentForm } from "#components/youtube-srt/content-form";
import { YoutubeVideoCaptions } from "#components/youtube-srt/youtube-video-captions";
import { YoutubeVideoChapters } from "#components/youtube-srt/youtube-video-chapters";

type ActiveView = "form" | "status";

export function YoutubeChaptersGenerator() {
  const [query] = useQueryStates(runIdSearchParams);
  const hasRunId = query.runId.length > 0;
  const [activeView, setActiveView] = useState<ActiveView>(
    hasRunId ? "status" : "form",
  );

  const toggleView = useCallback(() => {
    setActiveView((prev) => (prev === "form" ? "status" : "form"));
  }, []);

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Form / Workflow Status (shared space) */}
        <div className="rounded-xl border border-default-200 bg-content1 p-6">
          {hasRunId && (
            <div className="mb-4 flex justify-end">
              <Button size="sm" variant="ghost" onPress={toggleView}>
                {activeView === "form"
                  ? "Ver Estado del Workflow"
                  : "Volver al Formulario"}
              </Button>
            </div>
          )}

          {activeView === "form" ? (
            <ContentForm onSubmitSuccess={() => setActiveView("status")} />
          ) : (
            hasRunId && (
              <WorkflowMonitor
                runId={query.runId}
                loadingMessage="Generating video chapters..."
                showStepDetails={true}
              />
            )
          )}
        </div>

        {/* Middle column: Captions */}
        <div className="rounded-xl border border-default-200 bg-content1 p-6">
          {hasRunId ? (
            <YoutubeVideoCaptions />
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/40">
                Submit a URL to view captions
              </p>
            </div>
          )}
        </div>

        {/* Right column: Chapters */}
        <div className="rounded-xl border border-default-200 bg-content1 p-6">
          {hasRunId ? (
            <YoutubeVideoChapters />
          ) : (
            <div className="text-center py-12">
              <p className="text-foreground/40">
                Submit a URL to view chapters
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
