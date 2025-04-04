import type { ValidationResult } from "../baseSchema";
import type { NumberCheck } from "./number-types";

export class NumberTransform {
  private value: number;
  constructor(value: number) {
    this.value = value;
  }

  public transform(checks: NumberCheck[]): ValidationResult<number> {
    for (const check of checks) {
      switch (check.kind) {
        case "min":
          if (this.value < check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "min",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be greater than ${check.value}`,
                },
              ],
            };
          }
          break;
        case "max":
          if (this.value > check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "max",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be less than ${check.value}`,
                },
              ],
            };
          }
          break;
        case "int":
          if (!Number.isInteger(this.value)) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "int",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be an integer`,
                },
              ],
            };
          }
          break;
        case "positive":
          if (this.value <= 0) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "positive",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be a positive number`,
                },
              ],
            };
          }
          break;
        case "negative":
          if (this.value >= 0) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "negative",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be a negative number`,
                },
              ],
            };
          }
          break;

        case "float":
          if (Number.isInteger(this.value)) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "float",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: "value must be a float",
                },
              ],
            };
          }
          break;
        case "finite":
          if (!Number.isFinite(this.value)) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "finite",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: "value must be a finite number",
                },
              ],
            };
          }
          break;
        case "nonNegative":
          if (this.value < 0) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "nonNegative",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: "value must be a non-negative number",
                },
              ],
            };
          }
          break;
        case "nonPositive":
          if (this.value > 0) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "nonPositive",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: "value must be a non-positive number",
                },
              ],
            };
          }
          break;
        case "equal":
          if (this.value !== check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "equal",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be equal to ${check.value}`,
                },
              ],
            };
          }
          break;
        case "nonEqual":
          if (this.value === check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "nonEqual",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must not be equal to ${check.value}`,
                },
              ],
            };
          }
          break;

        case "greater":
          if (this.value <= check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "greater",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be greater than ${check.value}`,
                },
              ],
            };
          }
          break;
        case "greaterEqual":
          if (this.value < check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "greaterEqual",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be greater than or equal to ${check.value}`,
                },
              ],
            };
          }
          break;
        case "less":
          if (this.value >= check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "less",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be less than ${check.value}`,
                },
              ],
            };
          }
          break;
        case "lessEqual":
          if (this.value > check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "lessEqual",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be less than or equal to ${check.value}`,
                },
              ],
            };
          }
          break;
        case "multipleOf":
          if (this.value % check.value !== 0) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "multipleOf",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be a multiple of ${check.value}`,
                },
              ],
            };
          }
          break;
        case "safe":
          if (!Number.isSafeInteger(this.value)) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "safe",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: "value must be a safe integer",
                },
              ],
            };
          }
          break;

        case "between": {
          const { min, max, type } = check.value;
          if (
            (type === "inclusive" && (this.value < min || this.value > max)) ||
            (type === "exclusive" && (this.value <= min || this.value >= max))
          ) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "between",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be between (${type}) ${min} and ${max}`,
                },
              ],
            };
          }
          break;
        }
        case "step": {
          const stepValue = check.value;
          const isStepValid =
            Math.abs(
              this.value - Math.round(this.value / stepValue) * stepValue
            ) < Number.EPSILON;

          if (!isStepValid) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "step",
                  expectedType: "number",
                  receivedValue: this.value,
                  suggestion: `value must be a multiple of ${stepValue}`,
                },
              ],
            };
          }
          break;
        }
      }
    }

    return {
      success: true,
      data: this.value,
    };
  }
}
