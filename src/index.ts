import { StringSchema } from "./stringSchema";

export const z = {
  string: ({ message }: { message?: string } = {}) =>
    new StringSchema({
      message,
    }),
};
