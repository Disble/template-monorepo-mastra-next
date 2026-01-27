/**
 * Mastra workflow snapshot structure
 */
export type MastraWorkflowSnapshot = {
  snapshot: string;
  workflow_name?: string;
  run_id?: string;
};

export interface WorkflowMonitorProps {
  runId: string;
  loadingMessage?: string;
  showStepDetails?: boolean;
  workflowName?: string;
}
