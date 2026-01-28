import type { z } from "zod";

export interface ValidationErrorAlertProps {
  /**
   * Array of Zod validation issues
   */
  validationError: z.core.$ZodIssue[];

  /**
   * Optional title for the alert
   * @default "Schema Validation Error"
   */
  title?: string;

  /**
   * Optional description message
   * @default "The workflow completed successfully, but the output data doesn't match the expected schema."
   */
  description?: string;
}
