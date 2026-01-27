import { useShape } from "@electric-sql/react";
import { youtubeWorkflowSchema } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.helper";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { runIdSearchParams } from "#app/search-params";
import { normalizeTimestamp } from "./youtube-video-chapters.helper";
import type {
  MastraWorkflowSnapshot,
  NormalizedChapter,
} from "./youtube-video-chapters.type";

export function useYoutubeVideoChapters() {
  const [query] = useQueryStates(runIdSearchParams);
  const { isLoading: submitIsLoading, data: mastraWorkflowData } =
    useShape<MastraWorkflowSnapshot>({
      url: `http://localhost:3000/v1/shape`,
      params: {
        table: "mastra_workflow_snapshot",
        where: `run_id = '${query.runId}'`,
      },
    });

  const { chapterSnapshot, validationError } = useMemo(() => {
    if (mastraWorkflowData.length === 0) {
      return { chapterSnapshot: null, validationError: null };
    }

    const [chapterSnapshotRaw] = mastraWorkflowData;

    if (!chapterSnapshotRaw?.snapshot) {
      return { chapterSnapshot: null, validationError: null };
    }

    const parsed = youtubeWorkflowSchema.safeParse(
      JSON.parse(chapterSnapshotRaw.snapshot),
    );

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.issues);
      return {
        chapterSnapshot: null,
        validationError: parsed.error.issues,
      };
    }

    return { chapterSnapshot: parsed.data, validationError: null };
  }, [mastraWorkflowData]);

  const normalizedChapters: NormalizedChapter[] = useMemo(() => {
    const result = chapterSnapshot?.result;
    if (
      !result ||
      Array.isArray(result) ||
      !("chapters" in result) ||
      !result.chapters
    ) {
      return [];
    }

    return result.chapters.map(
      (chapter: { timestamp: string; description: string }) => ({
        ...chapter,
        timestamp: normalizeTimestamp(chapter.timestamp),
      }),
    );
  }, [chapterSnapshot]);

  return {
    submitIsLoading,
    chapterSnapshot,
    validationError,
    normalizedChapters,
  };
}
