export interface WorkflowRunHistoryItem {
  runId: string;
  workflowKey: string;
  displayValue: string;
  createdAt: Date | string | null;
  formInput?: Record<string, unknown>;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  search: string;
}
