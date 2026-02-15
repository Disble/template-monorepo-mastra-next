import type { z } from "zod";
import type {
  errorSchema,
  serializedErrorSchema,
  stepFailureSchema,
  stepResultSchema,
  stepRunningSchema,
  stepSuccessSchema,
  stepSuspendedSchema,
  stepWaitingSchema,
  workflowRunStateSchema,
  workflowRunStatusSchema,
} from "./workflow-validation.schema";

/**
 * Workflow Validation Types
 * TypeScript types inferred from Zod schemas
 */

// ============================================================================
// Base Types (Inferred from Schemas)
// ============================================================================

/**
 * Serialized error object (when Error is converted to JSON)
 */
export type SerializedError = z.infer<typeof serializedErrorSchema>;

/**
 * Workflow error type (string, Error instance, or serialized error)
 */
export type WorkflowError = z.infer<typeof errorSchema>;

/**
 * Workflow run status
 */
export type WorkflowRunStatus = z.infer<typeof workflowRunStatusSchema>;

/**
 * Base workflow run state
 */
export type WorkflowRunState = z.infer<typeof workflowRunStateSchema>;

/**
 * Union of all step result types
 */
export type StepResult = z.infer<typeof stepResultSchema>;

/**
 * Successful step result
 */
export type StepSuccess = z.infer<typeof stepSuccessSchema>;

/**
 * Failed step result
 */
export type StepFailure = z.infer<typeof stepFailureSchema>;

/**
 * Suspended step result
 */
export type StepSuspended = z.infer<typeof stepSuspendedSchema>;

/**
 * Running step result
 */
export type StepRunning = z.infer<typeof stepRunningSchema>;

/**
 * Waiting step result
 */
export type StepWaiting = z.infer<typeof stepWaitingSchema>;

// ============================================================================
// Generic Helper Types for Type-Safe Workflows
// ============================================================================

/**
 * Configuration for step input/output schemas.
 *
 * @example
 * ```ts
 * { input: z.object({ url: z.string() }), output: z.object({ data: z.string() }) }
 * ```
 */
export type StepSchemas = {
  input?: z.ZodTypeAny;
  output?: z.ZodTypeAny;
};

/**
 * Extracts the inferred type from a Zod schema, or `Record<string, unknown>` if undefined.
 * @internal
 */
export type InferStepOutput<T extends z.ZodTypeAny | undefined> =
  T extends z.ZodTypeAny ? z.infer<T> | z.infer<T>[] : Record<string, unknown>;

/**
 * Step result with discriminated union preserved and custom output/payload types.
 * TypeScript narrows based on `status` field.
 * @internal
 */
export type TypedStepResult<TStepSchema extends StepSchemas> =
  | (StepSuccess & {
      output?: InferStepOutput<TStepSchema["output"]>;
      payload?: InferStepOutput<TStepSchema["input"]>;
    })
  | (StepFailure & {
      payload?: InferStepOutput<TStepSchema["input"]>;
    })
  | (StepRunning & {
      payload?: InferStepOutput<TStepSchema["input"]>;
    })
  | (StepSuspended & {
      payload?: InferStepOutput<TStepSchema["input"]>;
    })
  | (StepWaiting & {
      payload?: InferStepOutput<TStepSchema["input"]>;
    });

/**
 * Context object with typed steps based on provided schemas.
 * @internal
 */
export type BuildTypedContext<TSteps extends Record<string, StepSchemas>> = {
  [K in keyof TSteps]?: TypedStepResult<TSteps[K]>;
} & {
  input?: Record<string, unknown>;
};

/**
 * Workflow state with type-safe context based on step schemas.
 * Replaces generic `context` with typed step results for autocomplete and type-safety.
 * Uses discriminated union on `status` to require `result` when workflow succeeds.
 *
 * @example
 * ```ts
 * type MyWorkflow = TypedWorkflowState<{
 *   "step-1": { output: z.object({ result: z.string() }) }
 * }, "step-1">;
 *
 * const state: MyWorkflow = // ...
 * if (state.status === "success") {
 *   state.result.result // ✅ string (NOT undefined!)
 * }
 * if (state.context["step-1"]?.status === "success") {
 *   state.context["step-1"].output.result // ✅ string (type-safe!)
 * }
 * ```
 */
export type TypedWorkflowState<
  TSteps extends Record<string, StepSchemas>,
  TResultStep extends keyof TSteps = never,
> =
  | (Omit<WorkflowRunState, "context" | "result" | "status"> & {
      status: "success";
      context: BuildTypedContext<TSteps>;
      result: TResultStep extends never
        ? Record<string, unknown>
        : InferStepOutput<TSteps[TResultStep]["output"]>;
    })
  | (Omit<WorkflowRunState, "context" | "result" | "status"> & {
      status:
        | "failed"
        | "suspended"
        | "running"
        | "waiting"
        | "pending"
        | "canceled";
      context: BuildTypedContext<TSteps>;
      result?: TResultStep extends never
        ? Record<string, unknown>
        : InferStepOutput<TSteps[TResultStep]["output"]>;
    });

/**
 * Represents a mapping of workflow step identifiers to their corresponding step schemas.
 * Each entry in the record is required to have all properties defined in {@link StepSchemas}.
 *
 * @example
 * ```ts
 * const steps: WorkflowSteps = {
 *   "step-1": { input: z.object({ url: z.string() }), output: z.object({ data: z.string() }) },
 *   "step-2": { output: z.object({ result: z.number() }) }
 * };
 * ```
 */
export type WorkflowSteps = Record<string, StepSchemas>;
