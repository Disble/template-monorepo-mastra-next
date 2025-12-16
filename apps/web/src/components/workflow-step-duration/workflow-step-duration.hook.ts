import { useEffect, useState } from "react";
import type { WorkflowStepDurationProps } from "./workflow-step-duration.type";

export function useWorkflowStepDuration({
  startedAt,
  endedAt,
}: WorkflowStepDurationProps) {
  const [currentTime, setCurrentTime] = useState(Date.now());
  const isRunning = Boolean(startedAt && !endedAt);

  useEffect(() => {
    if (!isRunning) return;

    // Update every 100ms to match backend precision
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

    return () => clearInterval(interval);
  }, [isRunning]);

  if (!startedAt) return { duration: null };

  const end = endedAt || currentTime;
  const duration = (end - startedAt) / 1000;

  return { duration };
}
