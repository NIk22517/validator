import type { ValidationResult } from "../baseSchema";
import { ValidationStringError } from "../errors";
import { StringTransform } from "./string-transform";
import { type StringCheck } from "./string-types";

export class StringParser {
  private value: unknown;
  private readonly checks: StringCheck[];
  private readonly coerceEnabled: boolean;
  private readonly defaultError: string | null | undefined;
  private readonly defaultCheck: unknown = null;

  constructor({
    value,
    checks,
    coerceEnabled,
    defaultError,
    defaultCheck,
  }: {
    value: unknown;
    checks: StringCheck[];
    coerceEnabled: boolean;
    defaultError?: string | null;
    defaultCheck: unknown;
  }) {
    this.value = value;
    this.checks = checks;
    this.coerceEnabled = coerceEnabled;
    this.defaultError = defaultError;
    this.defaultCheck = defaultCheck;
  }

  private coerceToString(value: unknown): string {
    if (typeof value === "string") return value;
    if (typeof value === "number" || typeof value === "boolean")
      return String(value);
    if (typeof value === "undefined" || !value) return "";
    return JSON.stringify(value);
  }

  public parse(): ValidationResult<string> {
    if (this.coerceEnabled) this.value = this.coerceToString(this.value);
    if (typeof this.value !== "string") {
      if (this.checks.find((check) => check.kind === "required")) {
        return {
          success: false,
          errors: [
            {
              field: "value",
              message:
                this.checks.find((check) => check.kind === "required")
                  ?.message ?? ValidationStringError.REQUIRED_ERROR,
              operation: "required",
              expectedType: "string",
              receivedValue: this.value,
              suggestion: "value must be a string",
            },
          ],
        };
      }
      if (this.checks.find((check) => check.kind === "optional")) {
        return { success: true, data: "" };
      }
      return this.defaultCheck
        ? { success: true, data: this.coerceToString(this.defaultCheck) }
        : {
            success: false,
            errors: [
              {
                field: "value",
                message:
                  this.defaultError ?? ValidationStringError.NOT_A_STRING,
                operation: "type",
                expectedType: "string",
                receivedValue: this.value,
                suggestion: "value must be a string",
              },
            ],
          };
    }

    const data = new StringTransform(this.value);
    return data.transform(this.checks);
  }
}
