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

function PanelHeader({
  title,
  icon,
  children,
}: {
  title: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between pb-4 mb-4 border-b border-default-200">
      <div className="flex items-center gap-2">
        <span className="text-foreground/60">{icon}</span>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function EmptyPanelState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-10 h-10 rounded-full bg-default-100 flex items-center justify-center mb-3">
        <svg
          className="w-5 h-5 text-foreground/30"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <title>Empty state</title>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
          />
        </svg>
      </div>
      <p className="text-sm text-foreground/40">{message}</p>
    </div>
  );
}

const CaptionsIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Captions</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
    />
  </svg>
);

const ChaptersIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Chapters</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);

const FormIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Formulario</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

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
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[minmax(320px,1fr)_minmax(0,1.5fr)_minmax(0,1.5fr)] gap-4 lg:gap-6">
      {/* Left column: Form / Workflow Status */}
      <div className="rounded-xl border border-default-200 bg-content1 p-5 md:col-span-2 xl:col-span-1">
        <PanelHeader
          title={activeView === "form" ? "Formulario" : "Estado del Workflow"}
          icon={FormIcon}
        >
          {hasRunId && (
            <Button
              size="sm"
              variant="ghost"
              className="text-xs"
              onPress={toggleView}
            >
              {activeView === "form" ? "Ver estado" : "Volver al formulario"}
            </Button>
          )}
        </PanelHeader>

        {activeView === "form" ? (
          <ContentForm onSubmitSuccess={() => setActiveView("status")} />
        ) : (
          hasRunId && (
            <WorkflowMonitor
              runId={query.runId}
              loadingMessage="Generando capítulos del video..."
              showStepDetails={true}
            />
          )
        )}
      </div>

      {/* Middle column: Captions */}
      <div className="rounded-xl border border-default-200 bg-content1 p-5">
        <PanelHeader title="Subtítulos" icon={CaptionsIcon} />
        {hasRunId ? (
          <YoutubeVideoCaptions />
        ) : (
          <EmptyPanelState message="Envía una URL para ver los subtítulos" />
        )}
      </div>

      {/* Right column: Chapters */}
      <div className="rounded-xl border border-default-200 bg-content1 p-5">
        <PanelHeader title="Capítulos" icon={ChaptersIcon} />
        {hasRunId ? (
          <YoutubeVideoChapters />
        ) : (
          <EmptyPanelState message="Envía una URL para ver los capítulos" />
        )}
      </div>
    </div>
  );
}
