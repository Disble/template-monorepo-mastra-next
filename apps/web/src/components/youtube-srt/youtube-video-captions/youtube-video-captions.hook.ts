import { useShape } from "@electric-sql/react";
import { youtubeWorkflowSchema } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.helper";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { runIdSearchParams } from "#app/search-params";
import type {
  Caption,
  MastraWorkflowSnapshot,
} from "./youtube-video-captions.type";

export function useYoutubeVideoCaptions() {
  const [query] = useQueryStates(runIdSearchParams);
  const { isLoading, data: mastraWorkflowData } =
    useShape<MastraWorkflowSnapshot>({
      url: `http://localhost:3000/v1/shape`,
      params: {
        table: "mastra_workflow_snapshot",
        where: `run_id = '${query.runId}'`,
      },
    });

  const { captions, validationError } = useMemo(() => {
    if (mastraWorkflowData.length === 0) {
      return { captions: null, validationError: null };
    }

    const [snapshotRaw] = mastraWorkflowData;

    if (!snapshotRaw?.snapshot) {
      return { captions: null, validationError: null };
    }

    const parsed = youtubeWorkflowSchema.safeParse(
      JSON.parse(snapshotRaw.snapshot),
    );

    if (!parsed.success) {
      console.error("Captions validation errors:", parsed.error.issues);
      return {
        captions: null,
        validationError: parsed.error.issues,
      };
    }

    // Extract captions from the download-captions step context
    const downloadCaptionsStep = parsed.data.context["download-captions"];
    if (
      downloadCaptionsStep &&
      "status" in downloadCaptionsStep &&
      downloadCaptionsStep.status === "success" &&
      "output" in downloadCaptionsStep &&
      downloadCaptionsStep.output
    ) {
      const output = downloadCaptionsStep.output as { captions?: Caption[] };
      return {
        captions: output.captions ?? null,
        validationError: null,
      };
    }

    return { captions: null, validationError: null };
  }, [mastraWorkflowData]);

  return {
    isLoading,
    captions,
    validationError,
  };
}
