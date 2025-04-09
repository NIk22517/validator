export type CheckType =
  | {
      kind: "isTrue" | "isFalse";
      message: string;
    }
  | {
      kind: "equal";
      value: boolean;
      message: string;
    };

export enum ValidationBooleanError {
  IS_TRUE_ERROR = "Ensure the value is strictly `true`",
  IS_FALSE_ERROR = "Ensure the value is strictly `false`",
  EQUAL_ERROR = "Provided value is not equal to the main value",
}
