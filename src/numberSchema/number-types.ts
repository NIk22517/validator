export type NumberCheck =
  | {
      kind:
        | "min"
        | "max"
        | "equal"
        | "nonEqual"
        | "greater"
        | "greaterEqual"
        | "less"
        | "lessEqual"
        | "multipleOf"
        | "step";
      value: number;
      message: string;
    }
  | {
      kind:
        | "int"
        | "positive"
        | "negative"
        | "float"
        | "finite"
        | "nonNegative"
        | "nonPositive"
        | "safe";

      message: string;
    }
  | {
      kind: "between";
      value: {
        min: number;
        max: number;
        type: "inclusive" | "exclusive";
      };
      message: string;
    };

export enum ValidationNumberError {
  NOT_A_NUMBER = "Value must be a number",
  INVALID_INTEGER = "Value must be an integer",
  INVALID_FLOAT = "Value must be a float",
  INVALID_POSITIVE = "Value must be a positive number",
  INVALID_NEGATIVE = "Value must be a negative number",
  INVALID_NON_NEGATIVE = "Value must be a non-negative number",
  INVALID_NON_POSITIVE = "Value must be a non-positive number",
  INVALID_RANGE = "Number is out of range",
  INVALID_MIN = "Number is less than minimum value",
  INVALID_MAX = "Number is greater than maximum value",
  INVALID_EQUAL = "Number is not equal to the expected value",
  INVALID_NOT_EQUAL = "Number is equal to the not expected value",
  INVALID_MULTIPLE_OF = "Number is not a multiple of the expected value",
  INVALID_GREATER = "Number is not greater than the expected value",
  INVALID_GREATER_EQUAL = "Number is not greater than or equal to the expected value",
  INVALID_LESS = "Number is not less than the expected value",
  INVALID_LESS_EQUAL = "Number is not less than or equal to the expected value",
  INVALID_SAFE = "Number is not a safe integer",
  INVALID_BETWEEN = "Number is not between the expected values",
  INVALID_STEP = "Number should be a multiple of the expected step",
}
