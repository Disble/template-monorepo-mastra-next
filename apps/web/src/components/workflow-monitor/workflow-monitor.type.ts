/**
 * Mastra workflow snapshot structure
 */
export type MastraWorkflowSnapshot = {
  snapshot: string;
};

export interface WorkflowMonitorProps {
  runId: string;
  loadingMessage?: string;
  showStepDetails?: boolean;
}
