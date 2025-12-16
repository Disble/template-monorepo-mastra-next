import type {
  StatusDisplay,
  StepInfo,
  WorkflowRunState,
} from "./workflow-status-loading.type";

/**
 * Extracts step information from the workflow context
 * Returns all steps from serializedStepGraph with their current status
 */
export function getStepStatus(
  context: WorkflowRunState["context"],
  serializedStepGraph: WorkflowRunState["serializedStepGraph"],
): StepInfo[] {
  const steps: StepInfo[] = [];

  for (const item of serializedStepGraph) {
    if (item.type === "step") {
      const stepId = item.step.id;
      const stepContext = context[stepId];

      if (
        stepContext &&
        typeof stepContext === "object" &&
        "status" in stepContext
      ) {
        steps.push({
          id: stepId,
          status: stepContext.status as string,
          startedAt:
            "startedAt" in stepContext
              ? (stepContext.startedAt as number)
              : undefined,
          endedAt:
            "endedAt" in stepContext
              ? (stepContext.endedAt as number)
              : undefined,
        });
      } else {
        // Step hasn't started yet
        steps.push({
          id: stepId,
          status: "pending",
        });
      }
    }
  }

  return steps;
}

/**
 * Formats step ID to a human-readable label
 */
export function formatStepLabel(stepId: string): string {
  return stepId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Calculates duration in seconds
 */
export function calculateDuration(
  startedAt?: number,
  endedAt?: number,
): string {
  if (!startedAt) return "";
  const end = endedAt || Date.now();
  const duration = (end - startedAt) / 1000;
  return `${duration.toFixed(1)}s`;
}

/**
 * Gets status icon and color based on step status
 */
export function getStatusDisplay(status: string): StatusDisplay {
  switch (status) {
    case "success":
      return { icon: "✓", color: "text-green-600", bgColor: "bg-green-100" };
    case "failed":
      return { icon: "✗", color: "text-red-600", bgColor: "bg-red-100" };
    case "running":
      return { icon: "↻", color: "text-blue-600", bgColor: "bg-blue-100" };
    case "waiting":
      return { icon: "⋯", color: "text-yellow-600", bgColor: "bg-yellow-100" };
    case "suspended":
      return { icon: "⏸", color: "text-orange-600", bgColor: "bg-orange-100" };
    case "pending":
      return { icon: "○", color: "text-gray-400", bgColor: "bg-gray-100" };
    default:
      return { icon: "○", color: "text-gray-400", bgColor: "bg-gray-100" };
  }
}

/**
 * Gets overall workflow status color
 */
export function getWorkflowStatusColor(
  status: string,
): "success" | "danger" | "warning" | "accent" {
  switch (status) {
    case "success":
      return "success";
    case "failed":
    case "canceled":
      return "danger";
    case "suspended":
    case "waiting":
      return "warning";
    default:
      return "accent";
  }
}
