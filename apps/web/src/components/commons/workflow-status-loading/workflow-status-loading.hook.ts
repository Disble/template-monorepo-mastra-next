import { getStepStatus } from "./workflow-status-loading.helper";
import type { WorkflowStatusLoadingProps } from "./workflow-status-loading.type";

export function useWorkflowStatusLoading({
  workflowState,
}: Pick<WorkflowStatusLoadingProps, "workflowState">) {
  const steps = getStepStatus(
    workflowState.context,
    workflowState.serializedStepGraph,
  );
  const totalSteps = workflowState.serializedStepGraph.filter(
    (item) => item.type === "step",
  ).length;
  const completedSteps = steps.filter((s) => s.status === "success").length;
  const isComplete = workflowState.status === "success";
  const isFailed = workflowState.status === "failed";

  return {
    steps,
    totalSteps,
    completedSteps,
    isComplete,
    isFailed,
  };
}
