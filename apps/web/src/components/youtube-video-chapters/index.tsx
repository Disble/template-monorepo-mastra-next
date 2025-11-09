import { useShape } from "@electric-sql/react";
import { youtubeWorkflowSchema } from "@repo/shared-types/mastra/validations/youtube/youtube-workflow.helper";
import { useQueryStates } from "nuqs";
import { useMemo } from "react";
import { runIdSearchParams } from "#app/search-params";

/**
 * Mastra workflow snapshot structure
 */
export type MastraWorkflowSnapshot = {
  snapshot: string;
};

export function YoutubeVideoChapters() {
  const [query] = useQueryStates(runIdSearchParams);
  const { isLoading: submitIsLoading, data: mastraWorkflowData } =
    useShape<MastraWorkflowSnapshot>({
      url: `http://localhost:3000/v1/shape`,
      params: {
        table: "mastra_workflow_snapshot",
        where: `run_id = '${query.runId}'`,
      },
    });
  console.log("⏩ submitIsLoading:", submitIsLoading);

  const chapterSnapshot = useMemo(() => {
    if (mastraWorkflowData.length === 0) {
      return null;
    }

    const [chapterSnapshotRaw] = mastraWorkflowData;

    if (!chapterSnapshotRaw?.snapshot) {
      return null;
    }

    const parsed = youtubeWorkflowSchema.safeParse(
      JSON.parse(chapterSnapshotRaw.snapshot),
    );

    if (!parsed.success) {
      console.error("Validation errors:", parsed.error.issues);
      // setError("Failed to parse YouTube workflow snapshot");
      return null;
    }

    console.log("parsed", parsed);

    return parsed.data;
  }, [mastraWorkflowData]);

  console.log("👑 chapterSnapshot", chapterSnapshot);

  return (
    <pre className="max-w-dvw overflow-auto">
      {JSON.stringify(chapterSnapshot?.result, null, 2)}
    </pre>
  );
}
