"use client";

import { memo } from "react";
import { useWorkflowStepDuration } from "./workflow-step-duration.hook";
import type { WorkflowStepDurationProps } from "./workflow-step-duration.type";

/**
 * Auto-updating duration display component
 * Updates every 100ms while running, stops when endedAt arrives
 */
export const WorkflowStepDuration = memo(function WorkflowStepDuration({
  startedAt,
  endedAt,
}: WorkflowStepDurationProps) {
  const { duration } = useWorkflowStepDuration({ startedAt, endedAt });

  if (duration === null) return null;

  return (
    <div className="text-xs text-foreground/60 font-mono">
      {duration.toFixed(1)}s
    </div>
  );
});
