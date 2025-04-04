import type { ValidationResult } from "../baseSchema";
import { NumberTransform } from "./number-transform";
import { ValidationNumberError, type NumberCheck } from "./number-types";

export class NumberParser {
  parse({
    value,
    checks,
    defaultError,
    defaultValue,
    coerceEnabled,
  }: {
    value: unknown;
    checks: NumberCheck[];
    defaultError?: string | null;
    defaultValue: number | null;
    coerceEnabled: boolean;
  }): ValidationResult<number> {
    if (coerceEnabled) {
      if (typeof value === "string") {
        if (!isNaN(Number(value))) {
          value = Number(value);
        } else {
          value = 0;
        }
      } else if (typeof value === "boolean") {
        value = Number(value);
      } else if (typeof value === "object") {
        if (value === null) {
          value = 0;
        } else if (Array.isArray(value)) {
          value = value.length ?? defaultValue ?? 0;
        } else {
          value = defaultValue ?? 0;
        }
      }
    }

    if (typeof value !== "number" || isNaN(value)) {
      if (defaultValue) {
        return {
          success: true,
          data: defaultValue,
        };
      }
      return {
        success: false,
        errors: [
          {
            field: "number",
            message: defaultError ?? ValidationNumberError.NOT_A_NUMBER,
            operation: "parse",
            expectedType: "number",
            receivedValue: value,
            suggestion: "Ensure the value is a number",
          },
        ],
      };
    }

    return new NumberTransform(value).transform(checks);
  }
}
