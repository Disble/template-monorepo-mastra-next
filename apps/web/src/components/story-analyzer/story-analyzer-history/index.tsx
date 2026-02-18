"use client";

import { Button } from "@repo/ui/heroui";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect } from "react";
import { paginationSearchParams } from "#app/search-params";
import { WorkflowRunsTable } from "#components/commons/workflow-runs-list";
import { useWorkflowRunHistory } from "#components/commons/workflow-runs-list/use-workflow-run-history";
import {
  deleteStoryAnalyzerRunByRunId,
  getStoryAnalyzerRunHistory,
} from "#components/story-analyzer/story-analyzer-dashboard/story-analyzer-runs.action";
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
    <title>Sin analisis</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    />
  </svg>
);

export function StoryAnalyzerHistory() {
  const router = useRouter();
  const [{ page, q }, setPaginationParams] = useQueryStates(
    paginationSearchParams,
  );

  const fetchHistory = useCallback(
    async (params: { page: number; pageSize: number; search: string }) => {
      const response = await getStoryAnalyzerRunHistory(params);

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
    return deleteStoryAnalyzerRunByRunId(runId);
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
      router.push(`/dashboard/story-analyzer/run?${params.toString()}`);
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
          onPress={() => router.push("/dashboard/story-analyzer/run")}
        >
          {PlusIcon}
          Nuevo analisis
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
        emptyTitle="Sin analisis"
        emptyDescription="Inicia un nuevo analisis de una historia de Wattpad para verlo aqui."
      />
    </div>
  );
}
