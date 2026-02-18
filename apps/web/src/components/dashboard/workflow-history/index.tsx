"use client";

import { Button } from "@repo/ui/heroui";
import { useRouter } from "next/navigation";
import { useQueryStates } from "nuqs";
import { useCallback, useEffect } from "react";
import { paginationSearchParams } from "#app/search-params";
import { WorkflowRunsTable } from "#components/commons/workflow-runs-list";
import { useWorkflowRunHistory } from "#components/commons/workflow-runs-list/use-workflow-run-history";
import type { WorkflowRunHistoryItem } from "#lib/types/workflow-history";
import {
  getWorkflowLabel,
  getWorkflowRunRoute,
} from "#lib/utils/workflow-routes";
import {
  deleteWorkflowRunFromHistory,
  getWorkflowRunHistory,
} from "./workflow-history.action";

const BackIcon = (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <title>Volver</title>
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
    />
  </svg>
);

export function WorkflowHistory() {
  const router = useRouter();
  const [{ page, q }, setPaginationParams] = useQueryStates(
    paginationSearchParams,
  );

  const fetchHistory = useCallback(
    async (params: { page: number; pageSize: number; search: string }) => {
      const response = await getWorkflowRunHistory(params);

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
    return deleteWorkflowRunFromHistory(runId);
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
      router.push(getWorkflowRunRoute(run.workflowKey, run.runId));
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Historial</h1>
          <p className="text-sm text-foreground/50 mt-1">
            Revisa ejecuciones anteriores y abre el detalle correspondiente.
          </p>
        </div>

        <Button
          size="sm"
          variant="ghost"
          onPress={() => router.push("/dashboard")}
        >
          {BackIcon}
          Ir al dashboard
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
        showWorkflowLabel={true}
        getWorkflowLabel={getWorkflowLabel}
        emptyTitle="Sin ejecuciones"
        emptyDescription="Aun no has ejecutado ningun workflow. Las ejecuciones apareceran aqui."
      />
    </div>
  );
}
