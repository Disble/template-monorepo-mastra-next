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

  // Recursive function to traverse the graph
  function traverse(graph: WorkflowRunState["serializedStepGraph"]) {
    if (!graph || !Array.isArray(graph)) return;

    for (const item of graph) {
      if (item.type === "step") {
        addStep(item.step);
        // Process nested step flow if it exists
        if (item.step.serializedStepFlow) {
          traverse(item.step.serializedStepFlow);
        }
      } else if (item.type === "parallel") {
        traverse(item.steps);
      } else if (item.type === "conditional") {
        traverse(item.steps);
      } else if (item.type === "loop" || item.type === "foreach") {
        addStep(item.step);
        if (item.step.serializedStepFlow) {
          traverse(item.step.serializedStepFlow);
        }
      }
    }
  }

  function addStep(
    step: Extract<
      WorkflowRunState["serializedStepGraph"][number],
      { step: unknown }
    >["step"],
  ) {
    if (!step?.id) return;

    const stepId = step.id as string;
    const stepContext = context[stepId];

    if (
      stepContext &&
      typeof stepContext === "object" &&
      "status" in stepContext
    ) {
      // Use type narrowing instead of any
      const startedAt =
        "startedAt" in stepContext && typeof stepContext.startedAt === "number"
          ? stepContext.startedAt
          : undefined;

      const endedAt =
        "endedAt" in stepContext && typeof stepContext.endedAt === "number"
          ? stepContext.endedAt
          : undefined;

      steps.push({
        id: stepId,
        status: stepContext.status as string,
        startedAt,
        endedAt,
      });
    } else {
      // Step hasn't started yet
      steps.push({
        id: stepId,
        status: "pending",
      });
    }
  }

  traverse(serializedStepGraph);

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
  if (typeof startedAt !== "number") return "";
  const end = typeof endedAt === "number" ? endedAt : Date.now();
  const duration = Math.max(0, (end - startedAt) / 1000);
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

/**
 * Formats an error for display
 * Handles string, Error instance, or serialized error object
 */
export function formatError(
  error: string | Error | { message: string; name?: string } | unknown,
): string {
  if (!error) return "Unknown error";

  // String error
  if (typeof error === "string") return error;

  // Error instance or serialized error object with message
  if (typeof error === "object" && error !== null && "message" in error) {
    return String((error as { message: unknown }).message);
  }

  // Fallback
  return String(error);
}
