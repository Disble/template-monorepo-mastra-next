import { workflowRunStateSchema } from "./workflow-validation.schema";
import type {
  StepSchemas,
  TypedWorkflowState,
} from "./workflow-validation.type";

/**
 * Workflow Validation Helpers
 * Generic validation utilities for workflow schemas
 */

/**
 * Creates a Zod schema that validates workflow data and returns type-safe results.
 *
 * Use this to validate workflow state with custom step schemas.
 * After `safeParse()`, the result has full type-safety - no castings needed.
 *
 * @param stepSchemas - Record of step IDs mapped to their input/output Zod schemas
 * @param resultStep - Step ID whose output defines the workflow result type (required)
 * @returns Zod schema that validates and transforms to `TypedWorkflowState<TSteps, TResultStep>`
 *
 * @example
 * ```ts
 * const schema = createWorkflowSchema(
 *   {
 *     "download": { output: z.object({ data: z.string() }) },
 *     "process": { output: z.object({ result: z.number() }) }
 *   },
 *   "process" // ← Result type from this step
 * );
 *
 * const result = schema.safeParse(workflowData);
 * if (result.success) {
 *   result.data.context["download"]?.output?.data // ✅ string
 *   result.data.result // ✅ { result: number } (type-safe!)
 * }
 * ```
 */
export function createWorkflowSchema<
  TSteps extends Record<string, StepSchemas>,
  TResultStep extends keyof TSteps,
>(stepSchemas: TSteps, resultStep: TResultStep) {
  return workflowRunStateSchema
    .superRefine((data, ctx) => {
      for (const [stepId, schemas] of Object.entries(stepSchemas)) {
        const stepData = data.context[stepId];

        if (!stepData) continue;

        // Validate input/payload
        if (schemas.input && "payload" in stepData && stepData.payload) {
          const payloadResult = schemas.input.safeParse(stepData.payload);
          if (!payloadResult.success) {
            ctx.addIssue({
              code: "custom",
              message: `Invalid payload for step "${stepId}"`,
              path: ["context", stepId, "payload"],
            });
          }
        }

        // Validate output
        if (
          schemas.output &&
          "status" in stepData &&
          stepData.status === "success" &&
          "output" in stepData &&
          stepData.output
        ) {
          const outputResult = schemas.output.safeParse(stepData.output);
          if (!outputResult.success) {
            ctx.addIssue({
              code: "custom",
              message: `Invalid output for step "${stepId}": ${outputResult.error.message}`,
              path: ["context", stepId, "output"],
            });
          }
        }
      }

      // Validate result field if present
      const resultSchema = stepSchemas[resultStep as string]?.output;
      if (resultSchema && data.result) {
        const resultValidation = resultSchema.safeParse(data.result);
        if (!resultValidation.success) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid workflow result: ${resultValidation.error.message}`,
            path: ["result"],
          });
        }
      }
    })
    .transform((data) => data as TypedWorkflowState<TSteps, TResultStep>);
}
