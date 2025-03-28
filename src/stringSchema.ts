import { Schema } from "./baseSchema";
import type { ValidationResult } from "./baseSchema";
import { ValidationStringError } from "./errors";

export type StringCheck =
  | { kind: "default"; message?: string }
  | { kind: "min"; value: number; message?: string }
  | { kind: "max"; value: number; message?: string }
  | { kind: "length"; value: number; message?: string }
  | { kind: "startsWith"; value: string; message?: string }
  | { kind: "endsWith"; value: string; message?: string }
  | { kind: "regex"; regex: RegExp; message?: string }
  | { kind: "trim"; message?: string }
  | { kind: "toLowerCase"; message?: string }
  | { kind: "toUpperCase"; message?: string }
  | { kind: "includes"; value: string; message?: string }
  | { kind: "email"; message?: string }
  | { kind: "url"; message?: string };

export class StringSchema extends Schema<string> {
  private readonly checks: StringCheck[] = [];
  private readonly defaultCheck: StringCheck = { kind: "default" };
  private readonly emailRegex =
    /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
  private doConvert = false;

  constructor({ message }: { message?: string } = {}) {
    super();
    if (message) {
      this.addCheck({ kind: "default", message });
    }
  }

  private addCheck(check: StringCheck) {
    this.checks.push(check);
  }

  parse(value: unknown): ValidationResult<string> {
    if (typeof value !== "string") {
      if (this.defaultCheck.message) {
        return {
          success: true,
          data: this.defaultCheck.message,
        };
      }
      return {
        success: false,
        errors: [
          this.checks.find((el) => el.kind === "default")?.message ??
            ValidationStringError.NOT_A_STRING,
        ],
      };
    }

    let transformedValue = value;

    for (const check of this.checks) {
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
          if (!transformedValue.startsWith(check.value)) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.START_ERROR],
            };
          }
          break;

        case "endsWith":
          if (!transformedValue.endsWith(check.value)) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.END_ERROR],
            };
          }
          break;

        case "regex":
          if (!check.regex.test(transformedValue)) {
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

        case "includes":
          if (!transformedValue.includes(check.value)) {
            return {
              success: false,
              errors: [check.message ?? ValidationStringError.INCLUDES_ERROR],
            };
          }
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
    this.addCheck({ kind: "min", value: length, message });
    return this;
  }

  max(length: number, { message }: { message?: string } = {}) {
    this.addCheck({ kind: "max", value: length, message });
    return this;
  }

  length(length: number, { message }: { message?: string } = {}) {
    this.addCheck({ kind: "length", value: length, message });
    return this;
  }

  startsWith(value: string, { message }: { message?: string } = {}) {
    this.addCheck({ kind: "startsWith", value, message });
    return this;
  }

  endsWith(value: string, { message }: { message?: string } = {}) {
    this.addCheck({ kind: "endsWith", value, message });
    return this;
  }

  regex(regex: RegExp, { message }: { message?: string } = {}) {
    this.addCheck({ kind: "regex", regex, message });
    return this;
  }

  trim() {
    this.addCheck({ kind: "trim" });
    return this;
  }

  toLowerCase() {
    this.addCheck({ kind: "toLowerCase" });
    return this;
  }

  toUpperCase() {
    this.addCheck({ kind: "toUpperCase" });
    return this;
  }

  includes(value: string, { message }: { message?: string } = {}) {
    this.addCheck({ kind: "includes", value, message });
    return this;
  }

  email({ message }: { message?: string } = {}) {
    this.addCheck({ kind: "email", message });
    return this;
  }
  url({ message }: { message?: string } = {}) {
    this.addCheck({ kind: "url", message });
    return this;
  }

  default(value: unknown) {
    this.defaultCheck.message = typeof value === "string" ? value : "";
    return this;
  }
  convert() {
    this.doConvert = true;
    return this;
  }
}
