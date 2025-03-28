export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] };

export abstract class Schema<T> {
  abstract parse(value: unknown): ValidationResult<T>;
}
