import { z } from "zod";

/**
 * Workflow Validation Schemas
 * Zod schemas for Mastra workflow run state structure
 */

// ============================================================================
// Base Schemas
// ============================================================================

/**
 * Workflow run status values
 */
export const workflowRunStatusSchema = z.enum([
  "running",
  "success",
  "failed",
  "suspended",
  "waiting",
  "pending",
  "canceled",
]);

// ============================================================================
// Step Result Schemas
// ============================================================================

/**
 * Base step result with common fields
 */
const stepResultBaseSchema = z.object({
  payload: z.record(z.string(), z.any()).optional(),
  resumePayload: z.record(z.string(), z.any()).optional(),
  suspendPayload: z.record(z.string(), z.any()).optional(),
  startedAt: z.number(),
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * Successful step result
 */
export const stepSuccessSchema = stepResultBaseSchema.extend({
  status: z.literal("success"),
  output: z.record(z.string(), z.any()).optional(),
  endedAt: z.number(),
  suspendedAt: z.number().optional(),
  resumedAt: z.number().optional(),
});

/**
 * Failed step result
 */
export const stepFailureSchema = stepResultBaseSchema.extend({
  status: z.literal("failed"),
  error: z.union([z.string(), z.instanceof(Error)]),
  endedAt: z.number(),
  suspendedAt: z.number().optional(),
  resumedAt: z.number().optional(),
});

/**
 * Suspended step result
 */
export const stepSuspendedSchema = z.object({
  status: z.literal("suspended"),
  payload: z.record(z.string(), z.any()).optional(),
  suspendPayload: z.record(z.string(), z.any()).optional(),
  startedAt: z.number(),
  suspendedAt: z.number(),
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * Running step result
 */
export const stepRunningSchema = stepResultBaseSchema.extend({
  status: z.literal("running"),
  suspendedAt: z.number().optional(),
  resumedAt: z.number().optional(),
});

/**
 * Waiting step result
 */
export const stepWaitingSchema = z.object({
  status: z.literal("waiting"),
  payload: z.record(z.string(), z.any()).optional(),
  suspendPayload: z.record(z.string(), z.any()).optional(),
  resumePayload: z.record(z.string(), z.any()).optional(),
  startedAt: z.number(),
  metadata: z.record(z.string(), z.any()).optional(),
});

/**
 * Union of all step result types
 */
export const stepResultSchema = z.discriminatedUnion("status", [
  stepSuccessSchema,
  stepFailureSchema,
  stepSuspendedSchema,
  stepRunningSchema,
  stepWaitingSchema,
]);

// ============================================================================
// Serialized Step Graph Schemas
// ============================================================================

/**
 * Serialized step configuration
 */
export const serializedStepSchema = z.object({
  id: z.string(),
  description: z.string().optional(),
  component: z.string().optional(),
  serializedStepFlow: z.array(z.any()).optional(),
  mapConfig: z.string().optional(),
});

/**
 * Serialized step flow entry (step, sleep, conditional, etc.)
 */
export const serializedStepFlowEntrySchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("step"),
    step: serializedStepSchema,
  }),
  z.object({
    type: z.literal("sleep"),
    id: z.string(),
    duration: z.number().optional(),
    fn: z.string().optional(),
  }),
  z.object({
    type: z.literal("sleepUntil"),
    id: z.string(),
    date: z.date().optional(),
    fn: z.string().optional(),
  }),
  z.object({
    type: z.literal("waitForEvent"),
    event: z.string(),
    step: serializedStepSchema,
    timeout: z.number().optional(),
  }),
  z.object({
    type: z.literal("parallel"),
    steps: z.array(z.any()),
  }),
  z.object({
    type: z.literal("conditional"),
    steps: z.array(z.any()),
    serializedConditions: z.array(
      z.object({
        id: z.string(),
        fn: z.string(),
      }),
    ),
  }),
  z.object({
    type: z.literal("loop"),
    step: serializedStepSchema,
    serializedCondition: z.object({
      id: z.string(),
      fn: z.string(),
    }),
    loopType: z.enum(["dowhile", "dountil"]),
  }),
  z.object({
    type: z.literal("foreach"),
    step: serializedStepSchema,
    opts: z.object({
      concurrency: z.number(),
    }),
  }),
]);

// ============================================================================
// Main Workflow Schema
// ============================================================================

/**
 * Complete workflow run state schema
 */
export const workflowRunStateSchema = z.object({
  runId: z.uuid(),
  status: workflowRunStatusSchema,
  timestamp: z.number(),
  error: z.union([z.string(), z.instanceof(Error)]).optional(),
  runtimeContext: z.record(z.string(), z.any()).optional(),
  value: z.record(z.string(), z.string()),
  context: z
    .object({
      input: z.record(z.string(), z.any()).optional(),
    })
    .catchall(stepResultSchema),
  serializedStepGraph: z.array(serializedStepFlowEntrySchema),
  activePaths: z.array(z.unknown()),
  suspendedPaths: z.record(z.string(), z.array(z.number())),
  waitingPaths: z.record(z.string(), z.array(z.number())),
  result: z.record(z.string(), z.any()).optional(),
});
