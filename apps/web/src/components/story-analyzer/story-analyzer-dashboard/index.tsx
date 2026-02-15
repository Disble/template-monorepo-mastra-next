"use client";

import { Button } from "@repo/ui/heroui";
import { useQueryStates } from "nuqs";
import { useCallback, useState } from "react";
import { runIdSearchParams } from "#app/search-params";
import { WorkflowMonitor } from "#components/commons/workflow-monitor";
import { StoryAnalyzerForm } from "#components/story-analyzer/story-analyzer-form";
import { StoryAnalyzerResults } from "#components/story-analyzer/story-analyzer-results";

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

function EmptyResultsState() {
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
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
          />
        </svg>
      </div>
      <p className="text-sm text-foreground/40">
        Envía una URL de Wattpad para iniciar el análisis
      </p>
    </div>
  );
}

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

const ResultsIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Resultados</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export function StoryAnalyzerDashboard() {
  const [query] = useQueryStates(runIdSearchParams);
  const hasRunId = query.runId.length > 0;
  const [activeView, setActiveView] = useState<ActiveView>(
    hasRunId ? "status" : "form",
  );

  const toggleView = useCallback(() => {
    setActiveView((prev) => (prev === "form" ? "status" : "form"));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(320px,380px)_minmax(0,1fr)] gap-4 lg:gap-6">
      {/* Left column: Form / Workflow Status */}
      <div className="rounded-xl border border-default-200 bg-content1 p-5">
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
          <StoryAnalyzerForm onSubmitSuccess={() => setActiveView("status")} />
        ) : (
          hasRunId && (
            <WorkflowMonitor
              runId={query.runId}
              loadingMessage="Analizando historia con 7 agentes literarios..."
              showStepDetails={true}
            />
          )
        )}
      </div>

      {/* Right column: Results */}
      <div className="rounded-xl border border-default-200 bg-content1 p-5">
        <PanelHeader title="Resultados del Análisis" icon={ResultsIcon} />
        {hasRunId ? <StoryAnalyzerResults /> : <EmptyResultsState />}
      </div>
    </div>
  );
}
