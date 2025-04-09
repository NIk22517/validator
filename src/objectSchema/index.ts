import { Schema, type ErrorType, type ValidationResult } from "../baseSchema";

type InferShape<T extends Record<string, Schema<any>>> = {
  [K in keyof T]: T[K] extends Schema<infer R> ? R : never;
};

export class ObjectSchema<T extends Record<string, Schema<any>>> extends Schema<
  InferShape<T>
> {
  private readonly shape: T;

  constructor(shape: T) {
    super();
    this.shape = shape;
  }

  parse(input: unknown): ValidationResult<InferShape<T>> {
    if (typeof input !== "object" || input === null || Array.isArray(input)) {
      return {
        success: false,
        errors: [
          {
            field: "",
            message: "Value must be a valid object",
            operation: "parse",
            expectedType: "object",
            receivedValue: input,
            suggestion: "Please provide a correct object",
          },
        ],
      };
    }

    const result = {} as InferShape<T>;
    const errors: ErrorType[] = [];

    for (const key in this.shape) {
      const schema = this.shape[key];

      const value = (input as Record<string, unknown>)[key];
      const parsed = schema.parse(value);

      if (!parsed.success) {
        parsed.errors?.forEach((err) => {
          errors.push({
            ...err,
            field: key,
          });
        });
      } else {
        result[key as keyof T] = parsed.data;
      }
    }

    if (errors.length > 0) {
      return {
        success: false,
        errors,
      };
    }

    return {
      success: true,
      data: result,
    };
  }
}
