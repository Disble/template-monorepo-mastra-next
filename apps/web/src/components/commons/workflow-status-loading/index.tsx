"use client";

import { Alert, Spinner } from "@repo/ui/heroui";
import { WorkflowStepDuration } from "#components/commons/workflow-step-duration";
import {
  formatError,
  formatStepLabel,
  getStatusDisplay,
  getWorkflowStatusColor,
} from "./workflow-status-loading.helper";
import { useWorkflowStatusLoading } from "./workflow-status-loading.hook";
import type { WorkflowStatusLoadingProps } from "./workflow-status-loading.type";

/**
 * Workflow Status Loading Component
 * Generic component to display real-time workflow execution status
 */
export function WorkflowStatusLoading({
  workflowState,
  loadingMessage = "Processing workflow...",
  showStepDetails = true,
}: WorkflowStatusLoadingProps) {
  const { steps, totalSteps, completedSteps, isComplete, isFailed } =
    useWorkflowStatusLoading({ workflowState });

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">
      {/* Main Status Card */}
      <Alert status={getWorkflowStatusColor(workflowState.status)}>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>
            {isComplete
              ? "Workflow Completed"
              : isFailed
                ? "Workflow Failed"
                : "Workflow Running"}
          </Alert.Title>
          <Alert.Description>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                {!isComplete && !isFailed && (
                  <Spinner size="sm" color="accent" className="mt-1 shrink-0" />
                )}
                <span className="min-w-0 whitespace-pre-wrap wrap-anywhere">
                  {isComplete
                    ? "All steps completed successfully"
                    : isFailed
                      ? workflowState.error
                        ? formatError(workflowState.error)
                        : "Workflow execution failed"
                      : loadingMessage}
                </span>
              </div>
              <div className="text-sm opacity-80">
                Progress: {completedSteps} / {totalSteps} steps completed
              </div>
            </div>
          </Alert.Description>
        </Alert.Content>
      </Alert>

      {/* Step Details */}
      {showStepDetails && steps.length > 0 && (
        <div className="bg-surface border border-default rounded-lg p-4 space-y-3">
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Step Details
          </h3>

          {steps.map((step) => {
            const { icon, color, bgColor } = getStatusDisplay(step.status);

            return (
              <div
                key={step.id}
                className="flex items-center justify-between p-3 rounded-md border border-default hover:bg-surface/50 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  {/* Status Icon */}
                  <div
                    className={`w-8 h-8 rounded-full ${bgColor} ${color} flex items-center justify-center font-bold text-sm`}
                  >
                    {step.status === "running" ? (
                      <Spinner size="sm" color="accent" />
                    ) : (
                      icon
                    )}
                  </div>

                  {/* Step Info */}
                  <div className="flex-1">
                    <div className="font-medium text-sm text-foreground">
                      {formatStepLabel(step.id)}
                    </div>
                    <div className="text-xs text-foreground/60 capitalize">
                      Status: {step.status}
                    </div>
                  </div>

                  {/* Duration */}
                  <WorkflowStepDuration
                    startedAt={step.startedAt}
                    endedAt={step.endedAt}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Progress Bar */}
      <div className="w-full bg-default-200 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ${
            isComplete
              ? "bg-success"
              : isFailed
                ? "bg-danger"
                : "bg-primary animate-pulse"
          }`}
          style={{
            width: `${totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0}%`,
          }}
        />
      </div>

      {/* Run ID */}
      <div className="text-xs text-foreground/30 text-center font-mono">
        Run ID: {workflowState.runId}
      </div>
    </div>
  );
}
