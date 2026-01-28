/**
 * Mastra workflow snapshot structure
 */
export type MastraWorkflowSnapshot = {
  snapshot: string;
};

export interface Chapter {
  timestamp: string;
  description: string;
}

export interface NormalizedChapter extends Chapter {
  timestamp: string;
}
