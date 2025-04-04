import { Schema } from "../baseSchema";
import type { ValidationResult } from "../baseSchema";
import { ValidationStringError } from "./string-types";
import { StringParser } from "./string-parse";
import {
  type CapitalizeStyle,
  type SlugifyType,
  type StringCheck,
} from "./string-types";

export class StringSchema extends Schema<string> {
  private readonly checks: StringCheck[] = [];
  private defaultCheck: unknown;
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

  parse(value: unknown): ValidationResult<string> {
    return new StringParser({
      value,
      checks: this.checks,
      coerceEnabled: this.coerceEnabled,
      defaultError: this.defaultError,
      defaultCheck: this.defaultCheck,
    }).parse();
  }

  min(
    length: number,
    { message = ValidationStringError.TOO_SHORT }: { message?: string } = {}
  ) {
    return this.createMethod("min", length, message);
  }
  max(
    length: number,
    { message = ValidationStringError.TOO_LONG }: { message?: string } = {}
  ) {
    return this.createMethod("max", length, message);
  }
  length(
    length: number,
    {
      message = ValidationStringError.INVALID_LENGTH,
    }: { message?: string } = {}
  ) {
    return this.createMethod("length", length, message);
  }
  startsWith(
    value: string,
    { message = ValidationStringError.START_ERROR }: { message?: string } = {}
  ) {
    return this.createMethod("startsWith", value, message);
  }
  endsWith(
    value: string,
    { message = ValidationStringError.END_ERROR }: { message?: string } = {}
  ) {
    return this.createMethod("endsWith", value, message);
  }
  regex(
    regex: RegExp,
    { message = ValidationStringError.REGEX_ERROR }: { message?: string } = {}
  ) {
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
  includes(
    value: string,
    {
      message = ValidationStringError.INCLUDES_ERROR,
    }: { message?: string } = {}
  ) {
    return this.createMethod("includes", value, message);
  }
  email({
    message = ValidationStringError.INVALID_EMAIL,
  }: { message?: string } = {}) {
    return this.createMethod("email", undefined, message);
  }
  url({
    message = ValidationStringError.INVALID_URL,
  }: { message?: string } = {}) {
    return this.createMethod("url", undefined, message);
  }

  optional() {
    return this.createMethod("optional");
  }

  required({
    message = ValidationStringError.REQUIRED_ERROR,
  }: { message?: string } = {}) {
    return this.createMethod("required", undefined, message);
  }

  default(value: unknown) {
    this.defaultCheck = value;
    return this;
  }

  coerce() {
    this.coerceEnabled = true;
    return this;
  }

  capitalize({
    style = "sentence",
    separator = " ",
  }: { style?: CapitalizeStyle; separator?: string } = {}) {
    return this.createMethod("capitalize", { style, separator });
  }

  slugify(value: SlugifyType = "-") {
    return this.createMethod("slugify", value);
  }

  alphaOnly({
    message = ValidationStringError.ALPHA_ONLY,
  }: { message?: string } = {}) {
    return this.createMethod("alphaOnly", undefined, message);
  }

  alphaNumeric({
    message = ValidationStringError.ALPHA_NUMERIC,
  }: { message?: string } = {}) {
    return this.createMethod("alphaNumeric", undefined, message);
  }

  allowChar(
    value: string,
    { message = ValidationStringError.ALLOW_CHAR }: { message?: string } = {}
  ) {
    return this.createMethod("allowChar", value, message);
  }

  blockChar(
    value: string,
    { message = ValidationStringError.BLOCK_CHAR }: { message?: string } = {}
  ) {
    return this.createMethod("blockChar", value, message);
  }

  censor({
    censor,
    replacement = "*",
    startOffset,
    endOffset,
    censorAll = false,
  }: {
    censor?: string | string[];
    replacement?: string;
    startOffset?: number;
    endOffset?: number;
    censorAll?: boolean;
  } = {}) {
    return this.createMethod("censor", {
      censor,
      replacement,
      startOffset,
      endOffset,
      censorAll,
    });
  }
}
