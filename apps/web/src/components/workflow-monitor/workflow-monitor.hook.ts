import { useShape } from "@electric-sql/react";
import type { WorkflowRunState } from "@repo/shared-types/mastra/validations/workflows";
import { workflowRunStateSchema } from "@repo/shared-types/mastra/validations/workflows";
import { useMemo } from "react";
import type { MastraWorkflowSnapshot } from "./workflow-monitor.type";

export function useWorkflowMonitor(runId: string, workflowName?: string) {
  const { isLoading, data: mastraWorkflowData } =
    useShape<MastraWorkflowSnapshot>({
      url: `http://localhost:3000/v1/shape`,
      params: {
        table: "mastra_workflow_snapshot",
        where: `run_id = '${runId}'`,
      },
    });

  const workflowState = useMemo<WorkflowRunState | null>(() => {
    if (mastraWorkflowData.length === 0) {
      return null;
    }

    const mergedContext: Record<string, unknown> = {};
    // Parse and validate all snapshots first to get timestamps for sorting
    const parsedSnapshots: (WorkflowRunState & {
      workflow_name?: string;
    })[] = [];

    for (const data of mastraWorkflowData) {
      if (!data.snapshot) continue;

      try {
        const parsedSnapshot = JSON.parse(data.snapshot);
        const parsed = workflowRunStateSchema.safeParse(parsedSnapshot);

        if (parsed.success) {
          parsedSnapshots.push({
            ...parsed.data,
            workflow_name: data.workflow_name,
          });
        } else if (workflowName && data.workflow_name === workflowName) {
          console.error(
            "Workflow validation errors for matched workflow:",
            parsed.error.issues,
          );
        }
      } catch (e) {
        console.error("Error parsing snapshot JSON:", e);
      }
    }

    if (parsedSnapshots.length === 0) {
      return null;
    }

    // Sort snapshots by timestamp (oldest to newest) to merge contexts correctly
    parsedSnapshots.sort((a, b) => a.timestamp - b.timestamp);

    // Merge context items chronologically
    for (const snapshot of parsedSnapshots) {
      if (snapshot.context) {
        Object.assign(mergedContext, snapshot.context);
      }
    }

    // Find the primary snapshot (matching name or latest available)
    // Since we sorted oldest to newest, we look from the end
    let primarySnapshot = [...parsedSnapshots]
      .reverse()
      .find((s) => !workflowName || s.workflow_name === workflowName);

    // Fallback to latest if name match fails
    if (!primarySnapshot) {
      primarySnapshot = parsedSnapshots[parsedSnapshots.length - 1];
    }

    // Return primary with merged context
    return {
      ...primarySnapshot,
      context: mergedContext as WorkflowRunState["context"],
    } as WorkflowRunState;
  }, [mastraWorkflowData, workflowName]);

  return { isLoading, workflowState };
}
