"use client";

import { Card } from "@repo/ui/heroui";
import type { ValidationErrorAlertProps } from "./validation-error-alert.type";

/**
 * Validation Error Alert Component
 * Displays Zod validation errors in a user-friendly format
 */
export function ValidationErrorAlert({
  validationError,
  title = "Schema Validation Error",
  description = "The workflow completed successfully, but the output data doesn't match the expected schema. This usually indicates a mismatch between the API response and the validation schema.",
}: ValidationErrorAlertProps) {
  // Format JSON with proper line breaks and unescaped quotes
  const formattedErrors = JSON.stringify(validationError, null, 2)
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"');

  return (
    <Card className="bg-danger/10 border border-danger-soft-hover">
      <div className="p-6">
        <h4 className="text-lg font-semibold text-danger mb-3 flex items-center gap-2">
          <span>⚠️</span>
          {title}
        </h4>
        <p className="text-foreground/80 mb-4">{description}</p>
        <details className="mt-4">
          <summary className="cursor-pointer text-sm font-medium text-foreground/70 hover:text-foreground mb-2">
            View validation errors
          </summary>
          <div className="bg-content1 rounded-lg p-4 mt-2 max-h-96 overflow-auto">
            <pre className="text-xs text-foreground/80 whitespace-pre-wrap font-mono">
              {formattedErrors}
            </pre>
          </div>
        </details>
      </div>
    </Card>
  );
}
