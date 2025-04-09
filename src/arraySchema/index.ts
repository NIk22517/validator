import { Schema, type ErrorType, type ValidationResult } from "../baseSchema";

export class ArraySchema<T> extends Schema<T[]> {
  private readonly itemSchema: Schema<T>;

  constructor(items: Schema<T>) {
    super();
    this.itemSchema = items;
  }

  parse(value: unknown): ValidationResult<T[]> {
    if (!Array.isArray(value)) {
      return {
        success: false,
        errors: [
          {
            field: "array",
            message: "Please provide an array",
            operation: "parse",
            expectedType: "array",
            receivedValue: value,
            suggestion: "Provided value is not an array",
          },
        ],
      };
    }

    const resultArray: T[] = [];
    const errors: ErrorType[] = [];

    for (const data of value) {
      const result = this.itemSchema.parse(data);

      if (!result.success) {
        errors.push(
          ...result.errors.map((err) => {
            return {
              ...err,
              field: `Error occur in this field ${JSON.stringify(data)}`,
            };
          })
        );
      } else {
        resultArray.push(result.data);
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
      data: resultArray,
    };
  }
}
