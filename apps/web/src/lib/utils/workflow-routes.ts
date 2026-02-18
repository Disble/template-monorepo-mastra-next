const WORKFLOW_CONFIG: Record<
  string,
  { label: string; historyPath: string; runPath: string }
> = {
  "download-wattpad-chapters-workflow": {
    label: "Story Analyzer",
    historyPath: "/dashboard/story-analyzer",
    runPath: "/dashboard/story-analyzer/run",
  },
  "chapters-videos-workflow": {
    label: "YouTube Chapters",
    historyPath: "/dashboard/youtube-captions",
    runPath: "/dashboard/youtube-captions/run",
  },
};

export function getWorkflowLabel(workflowKey: string): string {
  return WORKFLOW_CONFIG[workflowKey]?.label ?? workflowKey;
}

export function getWorkflowRunRoute(
  workflowKey: string,
  runId: string,
): string {
  const config = WORKFLOW_CONFIG[workflowKey];

  if (!config) {
    return "/dashboard";
  }

  const params = new URLSearchParams({ runId });
  return `${config.runPath}?${params.toString()}`;
}
