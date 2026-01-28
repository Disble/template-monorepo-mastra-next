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

  if (typeof startedAt !== "number") return { duration: null };
  const end = typeof endedAt === "number" ? endedAt : currentTime;
  const duration = Math.max(0, (end - startedAt) / 1000);

  return { duration };
}
