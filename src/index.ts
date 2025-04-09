import { StringSchema } from "./stringSchema";
import { NumberSchema } from "./numberSchema";
import { ObjectSchema } from "./objectSchema";
import { ArraySchema } from "./arraySchema";
import type { Schema } from "./baseSchema";
import { BooleanSchema } from "./booleanSchema";

export const z = {
  string: ({ message }: { message?: string } = {}) =>
    new StringSchema({
      message,
    }),
  number: ({ message }: { message?: string } = {}) =>
    new NumberSchema({
      message,
    }),

  boolean: () => new BooleanSchema(),

  object: <T extends Record<string, any>>(shape: T) =>
    new ObjectSchema<T>(shape),

  array: <T>(items: Schema<T>) => new ArraySchema<T>(items),
};
