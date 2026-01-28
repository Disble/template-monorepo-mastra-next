import type { workflowRunStateSchema } from "@repo/shared-types/mastra/validations/workflows";
import type { z } from "zod";

export type WorkflowRunState = z.infer<typeof workflowRunStateSchema>;

export interface WorkflowStatusLoadingProps {
  workflowState: WorkflowRunState;
  /** Optional custom message for the loading state */
  loadingMessage?: string;
  /** Show detailed step information */
  showStepDetails?: boolean;
}

export interface StepInfo {
  id: string;
  status: string;
  startedAt?: number;
  endedAt?: number;
}

export interface StatusDisplay {
  icon: string;
  color: string;
  bgColor: string;
}
