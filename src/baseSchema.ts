export type ErrorType = {
  field: string;
  message: string;
  operation: string;
  expectedType?: string;
  receivedValue?: unknown;
  suggestion?: string;
};

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ErrorType[] };

export abstract class Schema<T> {
  abstract parse(value: unknown): ValidationResult<T>;
}
