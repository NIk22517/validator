import { Schema, type ValidationResult } from "../baseSchema";
import { NumberParser } from "./number-parse";
import { ValidationNumberError, type NumberCheck } from "./number-types";

export class NumberSchema extends Schema<number> {
  private readonly defaultError: string | null = null;
  private coerceEnabled = false;
  private defaultValue: number | null = null;
  private readonly checks: NumberCheck[] = [];
  constructor({ message }: { message?: string } = {}) {
    super();
    this.defaultError = message ?? null;
  }

  private createMethod<T extends NumberCheck>(
    kind: T["kind"],
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

  parse(value: unknown): ValidationResult<number> {
    return new NumberParser().parse({
      value,
      checks: this.checks,
      defaultError: this.defaultError,
      defaultValue: this.defaultValue,
      coerceEnabled: this.coerceEnabled,
    });
  }

  min(
    value: number,
    { message = ValidationNumberError.INVALID_MIN }: { message?: string } = {}
  ) {
    return this.createMethod("min", value, message);
  }

  max(
    value: number,
    { message = ValidationNumberError.INVALID_MAX }: { message?: string } = {}
  ) {
    return this.createMethod("max", value, message);
  }
  int({
    message = ValidationNumberError.INVALID_INTEGER,
  }: { message?: string } = {}) {
    return this.createMethod("int", undefined, message);
  }

  positive({
    message = ValidationNumberError.INVALID_POSITIVE,
  }: { message?: string } = {}) {
    return this.createMethod("positive", undefined, message);
  }
  negative({
    message = ValidationNumberError.INVALID_NEGATIVE,
  }: { message?: string } = {}) {
    return this.createMethod("negative", undefined, message);
  }

  float({
    message = ValidationNumberError.INVALID_FLOAT,
  }: { message?: string } = {}) {
    return this.createMethod("float", undefined, message);
  }
  finite({
    message = ValidationNumberError.INVALID_FLOAT,
  }: { message?: string } = {}) {
    return this.createMethod("finite", undefined, message);
  }
  nonNegative({
    message = ValidationNumberError.INVALID_NON_NEGATIVE,
  }: { message?: string } = {}) {
    return this.createMethod("nonNegative", undefined, message);
  }
  nonPositive({
    message = ValidationNumberError.INVALID_NON_POSITIVE,
  }: { message?: string } = {}) {
    return this.createMethod("nonPositive", undefined, message);
  }

  equal(
    value: number,
    { message = ValidationNumberError.INVALID_EQUAL }: { message?: string } = {}
  ) {
    return this.createMethod("equal", value, message);
  }
  nonEqual(
    value: number,
    {
      message = ValidationNumberError.INVALID_NOT_EQUAL,
    }: { message?: string } = {}
  ) {
    return this.createMethod("nonEqual", value, message);
  }

  gt(
    value: number,
    {
      message = ValidationNumberError.INVALID_GREATER,
    }: { message?: string } = {}
  ) {
    return this.createMethod("greater", value, message);
  }

  gte(
    value: number,
    {
      message = ValidationNumberError.INVALID_GREATER_EQUAL,
    }: { message?: string } = {}
  ) {
    return this.createMethod("greaterEqual", value, message);
  }

  lt(
    value: number,
    { message = ValidationNumberError.INVALID_LESS }: { message?: string } = {}
  ) {
    return this.createMethod("less", value, message);
  }
  lte(
    value: number,
    {
      message = ValidationNumberError.INVALID_LESS_EQUAL,
    }: { message?: string } = {}
  ) {
    return this.createMethod("lessEqual", value, message);
  }

  multipleOf(
    value: number,
    {
      message = ValidationNumberError.INVALID_MULTIPLE_OF,
    }: { message?: string } = {}
  ) {
    return this.createMethod("multipleOf", value, message);
  }

  safe({
    message = ValidationNumberError.INVALID_SAFE,
  }: { message?: string } = {}) {
    return this.createMethod("safe", undefined, message);
  }

  default(value: number) {
    this.defaultValue = value;
    return this;
  }

  coerce() {
    this.coerceEnabled = true;
    return this;
  }

  between({
    min,
    max,
    type = "inclusive",
    message = ValidationNumberError.INVALID_BETWEEN,
  }: {
    min: number;
    max: number;
    type?: "inclusive" | "exclusive";
    message?: string;
  }) {
    return this.createMethod("between", { min, max, type }, message);
  }

  step(
    value: number,
    { message = ValidationNumberError.INVALID_STEP }: { message?: string } = {}
  ) {
    return this.createMethod("step", value, message);
  }
}
