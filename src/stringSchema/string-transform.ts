import type { ErrorType, ValidationResult } from "../baseSchema";
import { type StringCheck } from "./string-types";

export class StringTransform {
  private transformedValue: string;
  private readonly emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]+)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;

  constructor(value: string) {
    this.transformedValue = value;
  }

  private applyTransformations(
    check: StringCheck
  ): ValidationResult<string> | null {
    switch (check.kind) {
      case "min":
        if (this.transformedValue.length < check.value) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "min",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must be at least ${check.value} characters long`,
              },
            ],
          };
        }
        break;
      case "max":
        if (this.transformedValue.length > check.value) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "max",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must be at most ${check.value} characters long`,
              },
            ],
          };
        }
        break;
      case "length":
        if (this.transformedValue.length !== check.value) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "length",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must be exactly ${check.value} characters long`,
              },
            ],
          };
        }
        break;
      case "startsWith":
      case "endsWith":
      case "includes":
        if (!this.transformedValue[check.kind](check.value)) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: check.kind,
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must ${check.kind} "${check.value}"`,
              },
            ],
          };
        }
        break;
      case "regex":
        if (!check.value.test(this.transformedValue)) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "regex",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must match the regex ${check.value}`,
              },
            ],
          };
        }
        break;
      case "trim":
        this.transformedValue = this.transformedValue.trim();
        break;
      case "toLowerCase":
        this.transformedValue = this.transformedValue.toLowerCase();
        break;
      case "toUpperCase":
        this.transformedValue = this.transformedValue.toUpperCase();
        break;
      case "email":
        if (!this.emailRegex.test(this.transformedValue)) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "email",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must be a valid email address`,
              },
            ],
          };
        }
        break;
      case "url":
        try {
          new URL(this.transformedValue);
        } catch {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "url",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must be a valid URL`,
              },
            ],
          };
        }
        break;
      case "capitalize":
        switch (check.value?.style) {
          case "sentence":
            this.transformedValue =
              this.transformedValue.charAt(0).toUpperCase() +
              this.transformedValue.slice(1);
            break;
          case "title":
            this.transformedValue = this.transformedValue
              .split(check.value?.separator)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(check.value?.separator);
            break;
          case "uppercase":
            this.transformedValue = this.transformedValue.toUpperCase();
            break;
          case "lowercase":
            this.transformedValue = this.transformedValue.toLowerCase();
            break;
          case "pascal":
            this.transformedValue = this.transformedValue
              .split(check.value.separator)
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(check.value.separator.trim());
            break;
          case "camel": {
            const words = this.transformedValue.split(check.value.separator);
            this.transformedValue =
              words[0].toLowerCase() +
              words
                .slice(1)
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join("");
            break;
          }
        }
        break;
      case "slugify":
        this.transformedValue = this.transformedValue
          .toLowerCase()
          .trim()
          .replace(/\s+/g, check.value)
          .replace(/[^a-z0-9-_]/g, "");
        break;
      case "alphaOnly":
        if (!/^[a-zA-Z]+$/.test(this.transformedValue)) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "alphaOnly",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must contain only alphabetic characters`,
              },
            ],
          };
        }
        break;
      case "alphaNumeric":
        if (!/^[a-zA-Z0-9]+$/.test(this.transformedValue)) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "alphaNumeric",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must contain only alphanumeric characters`,
              },
            ],
          };
        }
        break;
      case "allowChar":
        if (!new RegExp(`^[${check.value}]+$`).test(this.transformedValue)) {
          return {
            success: false,
            errors: [
              {
                field: "value",
                message: check.message,
                operation: "allowChar",
                expectedType: "string",
                receivedValue: this.transformedValue,
                suggestion: `value must contain only allowed characters`,
              },
            ],
          };
        }
        break;
      case "blockChar": {
        const blockSet = new Set(check.value.split(""));
        for (const char of this.transformedValue) {
          if (blockSet.has(char)) {
            return {
              success: false,
              errors: [
                {
                  field: "value",
                  message: check.message,
                  operation: "blockChar",
                  expectedType: "string",
                  receivedValue: this.transformedValue,
                  suggestion: `value must not contain blocked characters`,
                },
              ],
            };
          }
        }
        break;
      }
      case "censor": {
        const {
          censor,
          replacement = "*",
          startOffset,
          endOffset,
          censorAll,
        } = check.value;
        if (censorAll) {
          this.transformedValue = replacement.repeat(
            this.transformedValue.length
          );
        } else if (
          typeof startOffset === "number" &&
          typeof endOffset === "number"
        ) {
          const start = Math.max(0, startOffset);
          const end = Math.min(this.transformedValue.length, endOffset);
          if (start < end) {
            this.transformedValue =
              this.transformedValue.slice(0, start) +
              replacement.repeat(end - start) +
              this.transformedValue.slice(end);
          }
        } else if (Array.isArray(censor) && censor.length > 0) {
          const censorSet = new Set(censor);
          this.transformedValue = this.transformedValue.replace(
            /\b\w+\b/g,
            (word) =>
              censorSet.has(word) ? replacement.repeat(word.length) : word
          );
        } else if (typeof censor === "string" && censor.trim() !== "") {
          const regex = new RegExp(`\\b${censor}\\b`, "gi");
          this.transformedValue = this.transformedValue.replace(
            regex,
            (match) => replacement.repeat(match.length)
          );
        }
        break;
      }
    }
    return null;
  }

  public transform(checks: StringCheck[]): ValidationResult<string> {
    let errors: ErrorType[] = [];

    for (const check of checks) {
      if (check.kind === "optional" || check.kind === "required") continue;

      const result = this.applyTransformations(check);

      if (result && !result.success) {
        errors.push(...result.errors);
        break;
      }
    }

    return errors.length
      ? { success: false, errors }
      : { success: true, data: this.transformedValue };
  }
}
