import { useShape } from "@electric-sql/react";
import { workflowRunStateSchema } from "@repo/shared-types/mastra/validations/workflows";
import { useMemo } from "react";
import type { MastraWorkflowSnapshot } from "./workflow-monitor.type";

export function useWorkflowMonitor(runId: string) {
  const { isLoading, data: mastraWorkflowData } =
    useShape<MastraWorkflowSnapshot>({
      url: `http://localhost:3000/v1/shape`,
      params: {
        table: "mastra_workflow_snapshot",
        where: `run_id = '${runId}'`,
      },
    });

  const workflowState = useMemo(() => {
    if (mastraWorkflowData.length === 0) {
      return null;
    }

    const [workflowSnapshotRaw] = mastraWorkflowData;

    if (!workflowSnapshotRaw?.snapshot) {
      return null;
    }

    const parsed = workflowRunStateSchema.safeParse(
      JSON.parse(workflowSnapshotRaw.snapshot),
    );

    if (!parsed.success) {
      console.error("Workflow validation errors:", parsed.error.issues);
      return null;
    }

    return parsed.data;
  }, [mastraWorkflowData]);

  return { isLoading, workflowState };
}
