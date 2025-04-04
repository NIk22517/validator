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

export enum ValidationStringError {
  NOT_A_STRING = "Value must be a string",
  TOO_SHORT = "String is too short",
  TOO_LONG = "String is too long",
  INVALID_LENGTH = "String is not equal",
  START_ERROR = "String must start with specified value",
  END_ERROR = "String must end with specified value",
  REGEX_ERROR = "String does not match regex",
  INVALID_EMAIL = "Invalid email",
  INVALID_URL = "Invalid URL",
  INCLUDES_ERROR = "String must include specified value",
  EXCLUDES_ERROR = "String must exclude specified value",
  REQUIRED_ERROR = "String is required",
  ALPHA_ONLY = "String must contain only letters",
  ALPHA_NUMERIC = "String must contain only letters and numbers",
  ALLOW_CHAR = "String must contain only letters, numbers, and specified characters",
  BLOCK_CHAR = "String must contain only letters, numbers, and not contain specified characters",
}

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
