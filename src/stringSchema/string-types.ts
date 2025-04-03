import { ValidationStringError } from "../errors";

export type CapitalizeStyle =
  | "sentence"
  | "title"
  | "uppercase"
  | "lowercase"
  | "pascal"
  | "camel";

export type SlugifyType = "-" | "_";

export type StringCheck =
  | { kind: "min" | "max" | "length"; value: number; message: string }
  | {
      kind: "startsWith" | "endsWith" | "includes" | "allowChar" | "blockChar";
      value: string;
      message: string;
    }
  | { kind: "regex"; value: RegExp; message: string }
  | { kind: "trim" | "toLowerCase" | "toUpperCase"; message: string }
  | {
      kind:
        | "email"
        | "url"
        | "optional"
        | "required"
        | "alphaOnly"
        | "alphaNumeric";
      message: string;
    }
  | {
      kind: "capitalize";
      value: {
        style: CapitalizeStyle;
        separator: string;
      };
      message: string;
    }
  | { kind: "slugify"; value: SlugifyType; message: string }
  | {
      kind: "censor";
      value: {
        censor?: string | string[];
        replacement: string;
        startOffset?: number;
        endOffset?: number;
        censorAll?: boolean;
      };
      message: string;
    };

export const ValidationStringErrorMessages = {
  min: ValidationStringError.TOO_SHORT,
  max: ValidationStringError.TOO_LONG,
  length: ValidationStringError.INVALID_LENGTH,
  startsWith: ValidationStringError.START_ERROR,
  endsWith: ValidationStringError.END_ERROR,
  includes: ValidationStringError.INCLUDES_ERROR,
  alphaOnly: ValidationStringError.ALPHA_ONLY,
  alphaNumeric: ValidationStringError.ALPHA_NUMERIC,
};
