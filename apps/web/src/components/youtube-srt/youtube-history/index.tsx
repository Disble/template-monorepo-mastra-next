"use client";

import { Button } from "@repo/ui/heroui";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect } from "react";
import { paginationSearchParams } from "#app/search-params";
import { WorkflowRunsTable } from "#components/commons/workflow-runs-list";
import { useWorkflowRunHistory } from "#components/commons/workflow-runs-list/use-workflow-run-history";
import {
  deleteYoutubeRunByRunId,
  getYoutubeRunHistory,
} from "#components/youtube-srt/youtube-chapters-generator/youtube-runs.action";
import type { WorkflowRunHistoryItem } from "#lib/types/workflow-history";

const PlusIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Nuevo</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const EmptyIcon = (
  <svg
    className="w-7 h-7 text-foreground/25"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Sin ejecuciones</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

export function YoutubeHistory() {
  const router = useRouter();
  const [{ page, q }, setPaginationParams] = useQueryStates(
    paginationSearchParams,
  );

  const fetchHistory = useCallback(
    async (params: { page: number; pageSize: number; search: string }) => {
      const response = await getYoutubeRunHistory(params);

      if (!response.success) {
        return { success: false as const, error: response.error };
      }

      return {
        success: true as const,
        runs: response.runs,
        totalCount: response.totalCount,
      };
    },
    [],
  );

  const deleteRun = useCallback(async (runId: string) => {
    return deleteYoutubeRunByRunId(runId);
  }, []);

  const {
    runs,
    isLoading,
    errorMessage,
    isPending,
    handleDelete,
    totalCount,
    totalPages,
  } = useWorkflowRunHistory({ fetchHistory, deleteRun, page, search: q });

  const handlePageChange = useCallback(
    (p: number) => void setPaginationParams({ page: p }),
    [setPaginationParams],
  );

  const handleSearchChange = useCallback(
    (s: string) => void setPaginationParams({ q: s, page: 1 }),
    [setPaginationParams],
  );

  const openRun = useCallback(
    (run: WorkflowRunHistoryItem) => {
      const params = new URLSearchParams({ runId: run.runId });
      router.push(`/dashboard/youtube-captions/run?${params.toString()}`);
    },
    [router],
  );

  // Auto-retrocede pagina si queda vacia despues de delete
  useEffect(() => {
    if (!isLoading && runs.length === 0 && page > 1) {
      handlePageChange(page - 1);
    }
  }, [runs.length, isLoading, page, handlePageChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end">
        <Button
          size="sm"
          variant="primary"
          onPress={() => router.push("/dashboard/youtube-captions/run")}
        >
          {PlusIcon}
          Nueva ejecucion
        </Button>
      </div>

      <WorkflowRunsTable
        runs={runs}
        isLoading={isLoading}
        errorMessage={errorMessage}
        isPending={isPending}
        onOpenRun={openRun}
        onDeleteRun={handleDelete}
        totalCount={totalCount}
        page={page}
        totalPages={totalPages}
        search={q}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        emptyIcon={EmptyIcon}
        emptyTitle="Sin ejecuciones"
        emptyDescription="Inicia una nueva ejecucion con un video de YouTube para verla aqui."
      />
    </div>
  );
}
