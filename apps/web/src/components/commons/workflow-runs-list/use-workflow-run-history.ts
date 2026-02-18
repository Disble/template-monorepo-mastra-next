import { useCallback, useEffect, useState, useTransition } from "react";
import type { WorkflowRunHistoryItem } from "#lib/types/workflow-history";

interface FetchHistoryParams {
  page: number;
  pageSize: number;
  search: string;
}

interface FetchHistorySuccess {
  success: true;
  runs: WorkflowRunHistoryItem[];
  totalCount: number;
}

interface FetchHistoryError {
  success: false;
  error: string;
  runs?: never[];
}

type FetchHistoryResult = FetchHistorySuccess | FetchHistoryError;

interface DeleteRunSuccess {
  success: true;
}

interface DeleteRunError {
  success: false;
  error: string;
}

type DeleteRunResult = DeleteRunSuccess | DeleteRunError;

const DEFAULT_PAGE_SIZE = 10;

interface UseWorkflowRunHistoryParams {
  fetchHistory: (params: FetchHistoryParams) => Promise<FetchHistoryResult>;
  deleteRun: (runId: string) => Promise<DeleteRunResult>;
  page: number;
  search: string;
  pageSize?: number;
}

interface UseWorkflowRunHistoryReturn {
  runs: WorkflowRunHistoryItem[];
  isLoading: boolean;
  errorMessage: string | null;
  isPending: boolean;
  handleDelete: (runId: string) => void;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useWorkflowRunHistory({
  fetchHistory,
  deleteRun,
  page,
  search,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseWorkflowRunHistoryParams): UseWorkflowRunHistoryReturn {
  const [runs, setRuns] = useState<WorkflowRunHistoryItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    let isMounted = true;

    const loadHistory = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const response = await fetchHistory({ page, pageSize, search });

      if (!isMounted) return;

      if (!response.success) {
        setErrorMessage(response.error);
        setRuns([]);
        setTotalCount(0);
        setIsLoading(false);
        return;
      }

      setRuns(
        response.runs.map((run) => ({
          runId: run.runId,
          workflowKey: run.workflowKey,
          displayValue: run.displayValue,
          createdAt: run.createdAt,
        })),
      );
      setTotalCount(response.totalCount);
      setIsLoading(false);
    };

    void loadHistory();

    return () => {
      isMounted = false;
    };
  }, [fetchHistory, page, search, pageSize]);

  const handleDelete = useCallback(
    (runId: string) => {
      startTransition(async () => {
        const response = await deleteRun(runId);

        if (!response.success) {
          setErrorMessage(response.error);
          return;
        }

        setRuns((current) => current.filter((run) => run.runId !== runId));
        setTotalCount((current) => Math.max(0, current - 1));
      });
    },
    [deleteRun],
  );

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    runs,
    isLoading,
    errorMessage,
    isPending,
    handleDelete,
    totalCount,
    page,
    pageSize,
    totalPages,
  };
}
