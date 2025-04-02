import { Schema } from "./baseSchema";
import type { ValidationResult } from "./baseSchema";
import { ValidationStringError } from "./errors";

export type StringCheck =
  | { kind: "min" | "max" | "length"; value: number; message?: string }
  | {
      kind: "startsWith" | "endsWith" | "includes";
      value: string;
      message?: string;
    }
  | { kind: "regex"; value: RegExp; message?: string } // Ensure 'value' is RegExp instead of 'regex'
  | { kind: "trim" | "toLowerCase" | "toUpperCase"; message?: string }
  | { kind: "email" | "url"; message?: string }
  | { kind: "optional" | "required"; message?: string };

const ValidationStringErrorMessages = {
  startsWith: ValidationStringError.START_ERROR,
  endsWith: ValidationStringError.END_ERROR,
  includes: ValidationStringError.INCLUDES_ERROR,
};

export class StringSchema extends Schema<string> {
  private readonly checks: StringCheck[] = [];
  private readonly emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]+)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  private defaultCheck: string | null = null;
  private readonly defaultError: string | null = null;
  private coerceEnabled = false;

  constructor({ message }: { message?: string } = {}) {
    super();
    this.defaultError = message ?? null;
  }

  private addCheck<T extends StringCheck>(check: T) {
    this.checks.push(check);
  }

  private createMethod<T extends StringCheck>(
    kind: T["kind"],
    value?: T extends { value: infer V } ? V : never,
    message?: string
  ) {
    this.addCheck({
      kind,
      ...(value !== undefined ? { value } : {}),
      message,
    } as T);
    return this;
  }

  private coerceToString(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (typeof value === "undefined" || !value) return "";
    return JSON.stringify(value);
  }

  parse(value: unknown): ValidationResult<string> {
    if (this.coerceEnabled) value = this.coerceToString(value);

    if (typeof value !== "string") {
      if (this.checks.find((check) => check.kind === "required")) {
        return {
          success: false,
          errors: [
            this.checks.find((check) => check.kind === "required")?.message ??
              ValidationStringError.REQUIRED_ERROR,
          ],
        };
      }
      if (this.checks.find((check) => check.kind === "optional")) {
        return { success: true, data: "" };
      }
      return this.defaultCheck
        ? { success: true, data: this.defaultCheck }
        : {
            success: false,
            errors: [this.defaultError ?? ValidationStringError.NOT_A_STRING],
          };
    }

    let transformedValue = value;
    for (const check of this.checks) {
      if (check.kind === "optional" || check.kind === "required") continue;
      switch (check.kind) {
        case "min":
          if (transformedValue.length < check.value) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.TOO_SHORT],
            };
          }
          break;
        case "max":
          if (transformedValue.length > check.value) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.TOO_LONG],
            };
          }
          break;
        case "length":
          if (transformedValue.length !== check.value) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.INVALID_LENGTH],
            };
          }
          break;
        case "startsWith":
        case "endsWith":
        case "includes":
          if (!transformedValue[check.kind](check.value)) {
            return {
              success: false,
              errors: [
                check.message ?? ValidationStringErrorMessages[check.kind],
              ],
            };
          }
          break;
        case "regex":
          if (!check.value.test(transformedValue)) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.REGEX_ERROR],
            };
          }
          break;
        case "trim":
          transformedValue = transformedValue.trim();
          break;
        case "toLowerCase":
          transformedValue = transformedValue.toLowerCase();
          break;
        case "toUpperCase":
          transformedValue = transformedValue.toUpperCase();
          break;
        case "email":
          if (!this.emailRegex.test(transformedValue)) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.INVALID_EMAIL],
            };
          }
          break;
        case "url":
          try {
            new URL(transformedValue);
          } catch {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.INVALID_URL],
            };
          }
          break;
      }
    }
    return { success: true, data: transformedValue };
  }

  min(length: number, { message }: { message?: string } = {}) {
    return this.createMethod("min", length, message);
  }
  max(length: number, { message }: { message?: string } = {}) {
    return this.createMethod("max", length, message);
  }
  length(length: number, { message }: { message?: string } = {}) {
    return this.createMethod("length", length, message);
  }
  startsWith(value: string, { message }: { message?: string } = {}) {
    return this.createMethod("startsWith", value, message);
  }
  endsWith(value: string, { message }: { message?: string } = {}) {
    return this.createMethod("endsWith", value, message);
  }
  regex(regex: RegExp, { message }: { message?: string } = {}) {
    return this.createMethod("regex", regex, message);
  }
  trim() {
    return this.createMethod("trim");
  }
  toLowerCase() {
    return this.createMethod("toLowerCase");
  }
  toUpperCase() {
    return this.createMethod("toUpperCase");
  }
  includes(value: string, { message }: { message?: string } = {}) {
    return this.createMethod("includes", value, message);
  }
  email({ message }: { message?: string } = {}) {
    return this.createMethod("email", undefined, message);
  }
  url({ message }: { message?: string } = {}) {
    return this.createMethod("url", undefined, message);
  }

  optional() {
    return this.createMethod("optional");
  }

  required({ message }: { message?: string } = {}) {
    return this.createMethod("required", undefined, message);
  }

  default(value: unknown) {
    this.defaultCheck = this.coerceToString(value);
    return this;
  }

  coerce() {
    this.coerceEnabled = true;
    return this;
  }
}
