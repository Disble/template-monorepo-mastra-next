import * as z from "zod";
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
/**
 * Deeply flattens an array or object to its core elements.
 * Useful for validating Mastra data that might be wrapped in multiple array layers
 * due to parallel or foreach blocks.
 */
// biome-ignore lint/suspicious/noExplicitAny: Recursive flattening utility returns mixed types
function deepFlat(data: unknown): any {
  // Handle Arrays
  if (Array.isArray(data)) {
    const flattened = data.flat(10);
    return (flattened as unknown[]).map((item) => deepFlat(item));
  }

  // Handle Objects (plain objects, not null, not Date/Error etc.)
  if (
    typeof data === "object" &&
    data !== null &&
    Object.getPrototypeOf(data) === Object.prototype
  ) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = deepFlat(value);
    }
    return result;
  }

  return data;
}

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
          const processedPayload = deepFlat(stepData.payload);
          const isArray = Array.isArray(processedPayload);
          const validationSchema = isArray
            ? z.array(schemas.input)
            : schemas.input;
          const payloadResult = validationSchema.safeParse(processedPayload);
          if (!payloadResult.success) {
            ctx.addIssue({
              code: "custom",
              message: `Invalid payload for step "${stepId}": ${JSON.stringify(payloadResult.error.issues, null, 2)}`,
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
          const processedOutput = deepFlat(stepData.output);
          const isArray = Array.isArray(processedOutput);
          const validationSchema = isArray
            ? z.array(schemas.output)
            : schemas.output;
          const outputResult = validationSchema.safeParse(processedOutput);
          if (!outputResult.success) {
            ctx.addIssue({
              code: "custom",
              message: `Invalid output for step "${stepId}": ${JSON.stringify(outputResult.error.issues, null, 2)}`,
              path: ["context", stepId, "output"],
            });
          }
        }
      }

      // Validate result field if present
      const resultSchema = stepSchemas[resultStep as string]?.output;
      if (resultSchema && data.result) {
        const processedResult = deepFlat(data.result);
        const isArray = Array.isArray(processedResult);
        const validationSchema = isArray ? z.array(resultSchema) : resultSchema;

        const resultValidation = validationSchema.safeParse(processedResult);
        if (!resultValidation.success) {
          ctx.addIssue({
            code: "custom",
            message: `Invalid workflow result: ${JSON.stringify(resultValidation.error.issues, null, 2)}`,
            path: ["result"],
          });
        }
      }
    })
    .transform((data) => data as TypedWorkflowState<TSteps, TResultStep>);
}
