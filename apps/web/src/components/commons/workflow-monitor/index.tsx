"use client";

import { WorkflowStatusLoading } from "#components/commons/workflow-status-loading";
import { useWorkflowMonitor } from "./workflow-monitor.hook";
import type { WorkflowMonitorProps } from "./workflow-monitor.type";

/**
 * Generic workflow monitor component that fetches and displays
 * real-time workflow status using Electric SQL
 */
export function WorkflowMonitor({
  runId,
  loadingMessage,
  showStepDetails,
  workflowName,
}: WorkflowMonitorProps) {
  const { isLoading, workflowState } = useWorkflowMonitor(runId, workflowName);

  if (isLoading || !workflowState) {
    return (
      <div className="text-center py-12">
        <p className="text-foreground/60">Loading workflow status...</p>
      </div>
    );
  }

  return (
    <WorkflowStatusLoading
      workflowState={workflowState}
      loadingMessage={loadingMessage}
      showStepDetails={showStepDetails}
    />
  );
}
