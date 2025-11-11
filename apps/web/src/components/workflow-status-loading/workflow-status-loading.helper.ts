import type {
  StatusDisplay,
  StepInfo,
  WorkflowRunState,
} from "./workflow-status-loading.type";

/**
 * Extracts step information from the workflow context
 */
export function getStepStatus(
  context: WorkflowRunState["context"],
): StepInfo[] {
  const steps: StepInfo[] = [];

  for (const [key, value] of Object.entries(context)) {
    if (
      key !== "input" &&
      typeof value === "object" &&
      value !== null &&
      "status" in value
    ) {
      steps.push({
        id: key,
        status: value.status as string,
        startedAt:
          "startedAt" in value ? (value.startedAt as number) : undefined,
        endedAt: "endedAt" in value ? (value.endedAt as number) : undefined,
      });
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
