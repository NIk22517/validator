import { Schema, type ValidationResult } from "../baseSchema";
import { ValidationBooleanError, type CheckType } from "./boolean-types";

export class BooleanSchema extends Schema<boolean> {
  private defaultValue: boolean | null = null;
  private readonly checks: CheckType[] = [];
  private coerceEnable: boolean | null = null;
  private allowNull: boolean = false;
  private allowUndefined: boolean = false;

  private createMethod<T extends CheckType>(
    kind: CheckType["kind"],
    value?: T extends { value: infer V } ? V : never,
    message?: string
  ) {
    this.checks.push({
      kind,
      ...(value !== undefined ? { value } : {}),
      ...(message ? { message } : {}),
    } as T);
    return this;
  }

  private changeToBoolean(value: unknown): boolean {
    if (typeof value === "boolean") return value;

    if (typeof value === "string") {
      const lower = value.toLowerCase();
      if (lower === "true") return true;
      if (lower === "false") return false;
    }

    if (typeof value === "number") {
      if (value === 1) return true;
      if (value === 0) return false;
    }

    return this.defaultValue ?? false;
  }

  parse(value: unknown): ValidationResult<boolean> {
    if (this.coerceEnable) {
      value = this.changeToBoolean(value);
    }
    if (value === null && this.allowNull) {
      return { success: true, data: this.defaultValue ?? false };
    }
    if (value === undefined && this.allowUndefined) {
      return { success: true, data: this.defaultValue ?? false };
    }
    if (typeof value !== "boolean") {
      if (this.defaultValue !== null) {
        return {
          success: true,
          data: this.defaultValue,
        };
      }
      return {
        success: false,
        errors: [
          {
            field: "boolean",
            message: "Provided value is not a boolean",
            operation: "parse",
            expectedType: "boolean",
            receivedValue: value,
            suggestion:
              "Use coercion or transformation to convert the value to boolean",
          },
        ],
      };
    }

    for (const check of this.checks) {
      switch (check.kind) {
        case "isTrue":
          if (value !== true) {
            return {
              success: false,
              errors: [
                {
                  field: "boolean",
                  message: check.message,
                  operation: check.kind,
                  expectedType: "true",
                  receivedValue: value,
                  suggestion: 'Your provided value is not "true"',
                },
              ],
            };
          }
          break;
        case "isFalse":
          if (value !== false) {
            return {
              success: false,
              errors: [
                {
                  field: "boolean",
                  message: check.message,
                  operation: check.kind,
                  expectedType: "false",
                  receivedValue: value,
                  suggestion: 'Your provided value is not "false"',
                },
              ],
            };
          }
          break;
        case "equal":
          if (value !== check.value) {
            return {
              success: false,
              errors: [
                {
                  field: "boolean",
                  message: check.message,
                  operation: check.kind,
                  expectedType: `${value}`,
                  receivedValue: value,
                  suggestion: "Provide a same value",
                },
              ],
            };
          }
          break;
      }
    }

    return {
      success: true,
      data: value,
    };
  }

  nullable() {
    this.allowNull = true;
    return this;
  }

  optional() {
    this.allowUndefined = true;
    return this;
  }

  default(value: boolean) {
    this.defaultValue = value;
    return this;
  }

  isTrue({
    message = ValidationBooleanError.IS_TRUE_ERROR,
  }: { message?: string } = {}) {
    return this.createMethod("isTrue", undefined, message);
  }
  isFalse({
    message = ValidationBooleanError.IS_FALSE_ERROR,
  }: { message?: string } = {}) {
    return this.createMethod("isFalse", undefined, message);
  }

  coerce() {
    this.coerceEnable = true;
    return this;
  }

  equal(
    value: boolean,
    { message = ValidationBooleanError.EQUAL_ERROR }: { message?: string } = {}
  ) {
    return this.createMethod("equal", value, message);
  }
}
