import { useShape } from "@electric-sql/react";
import { youtubeWorkflowSchema } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.helper";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { runIdSearchParams } from "#app/search-params";
import { parseSRT } from "./youtube-video-captions.helper";
import type { MastraWorkflowSnapshot } from "./youtube-video-captions.type";

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

  const { captions, srtRaw, validationError } = useMemo(() => {
    if (mastraWorkflowData.length === 0) {
      return { captions: null, srtRaw: null, validationError: null };
    }

    const [snapshotRaw] = mastraWorkflowData;

    if (!snapshotRaw?.snapshot) {
      return { captions: null, srtRaw: null, validationError: null };
    }

    const parsed = youtubeWorkflowSchema.safeParse(
      JSON.parse(snapshotRaw.snapshot),
    );

    if (!parsed.success) {
      console.error("Captions validation errors:", parsed.error.issues);
      return {
        captions: null,
        srtRaw: null,
        validationError: parsed.error.issues,
      };
    }

    // Extract captions from the download-captions step context
    const downloadCaptionsStep = parsed.data.context["download-captions"];
    console.log("downloadStep:", downloadCaptionsStep);

    if (
      downloadCaptionsStep?.status === "success" &&
      downloadCaptionsStep.output
    ) {
      const { srt } = downloadCaptionsStep.output;

      if (!srt) {
        return { captions: null, srtRaw: null, validationError: null };
      }

      try {
        const parsedCaptions = parseSRT(srt);
        console.log("Parsed captions count:", parsedCaptions.length);
        return {
          captions: parsedCaptions,
          srtRaw: srt,
          validationError: null,
        };
      } catch (error) {
        console.error("Error parsing SRT:", error);
        return { captions: null, srtRaw: null, validationError: null };
      }
    }

    return { captions: null, srtRaw: null, validationError: null };
  }, [mastraWorkflowData]);

  return {
    isLoading,
    captions,
    srtRaw,
    validationError,
  };
}
