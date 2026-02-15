import { useShape } from "@electric-sql/react";
import { wattpadWorkflowSchema } from "@repo/shared-types/mastra/validations/wattpad/wattpad-workflow.helper";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { runIdSearchParams } from "#app/search-params";
import type { MastraWorkflowSnapshot } from "./story-analyzer-results.type";

export function useStoryAnalyzerResults() {
  const [query] = useQueryStates(runIdSearchParams);
  const { isLoading, data: mastraWorkflowData } =
    useShape<MastraWorkflowSnapshot>({
      url: `http://localhost:3000/v1/shape`,
      params: {
        table: "mastra_workflow_snapshot",
        where: `run_id = '${query.runId}'`,
      },
    });

  const { workflowState, validationError } = useMemo(() => {
    if (mastraWorkflowData.length === 0) {
      return { workflowState: null, validationError: null };
    }

    const [snapshotRaw] = mastraWorkflowData;

    if (!snapshotRaw?.snapshot) {
      return { workflowState: null, validationError: null };
    }

    const parsed = wattpadWorkflowSchema.safeParse(
      JSON.parse(snapshotRaw.snapshot),
    );

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.issues);
      return {
        workflowState: null,
        validationError: parsed.error.issues,
      };
    }

    return { workflowState: parsed.data, validationError: null };
  }, [mastraWorkflowData]);

  const downloadedContent = useMemo(() => {
    if (!workflowState) return null;

    const downloadStep = workflowState.context["download-wattpad-chapter"];
    if (downloadStep?.status === "success" && downloadStep.output) {
      const output = downloadStep.output;
      if (!Array.isArray(output) && "content" in output) {
        return output.content;
      }
    }
    return null;
  }, [workflowState]);

  const conglomerateResult = useMemo(() => {
    if (!workflowState || workflowState.status !== "success") return null;

    const result = workflowState.result;
    if (!result || Array.isArray(result)) return null;

    if ("sintesis" in result && "analisisIndividuales" in result) {
      return result;
    }
    return null;
  }, [workflowState]);

  return {
    isLoading,
    workflowState,
    validationError,
    downloadedContent,
    conglomerateResult,
  };
}
