import { StringSchema } from "./stringSchema";
import { NumberSchema } from "./numberSchema";

export const z = {
  string: ({ message }: { message?: string } = {}) =>
    new StringSchema({
      message,
    }),
  number: ({ message }: { message?: string } = {}) =>
    new NumberSchema({
      message,
    }),
};
