import { describe, expect, test } from "bun:test";
import { z } from "../src";

describe("test obj", () => {
  const schema = z.object({
    name: z.string().min(3),
    age: z.number().min(30),
    is_verify: z.boolean(),
  });
  test("obj", () => {
    expect(
      schema.parse({
        name: "hi",
        age: "",
      })
    ).toEqual({
      success: false,
      errors: [
        {
          expectedType: "string",
          field: "name",
          message: "String is too short",
          operation: "min",
          receivedValue: "hi",
          suggestion: "value must be at least 3 characters long",
        },
        {
          expectedType: "number",
          field: "age",
          message: "Value must be a number",
          operation: "parse",
          receivedValue: "",
          suggestion: "Ensure the value is a number",
        },
        {
          expectedType: "boolean",
          field: "is_verify",
          message: "Provided value is not a boolean",
          operation: "parse",
          receivedValue: undefined,
          suggestion:
            "Use coercion or transformation to convert the value to boolean",
        },
      ],
    });
  });

  test("obj 2", () => {
    expect(
      schema.parse({
        name: "hey",
        is_verify: false,
      })
    ).toEqual({
      success: false,
      errors: [
        {
          expectedType: "number",
          field: "age",
          message: "Value must be a number",
          operation: "parse",
          receivedValue: undefined,
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });

  test("obj 3", () => {
    expect(
      schema.parse({
        name: "hey",
        age: 30,
        is_verify: false,
      })
    ).toEqual({
      success: true,
      data: {
        name: "hey",
        age: 30,
        is_verify: false,
      },
    });
  });
});

describe("test obj array", () => {
  const schema = z.object({
    name: z.array(z.string()),
  });

  test("obj array 1", () => {
    expect(
      schema.parse({
        name: "hey",
      })
    ).toEqual({
      success: false,
      errors: [
        {
          expectedType: "array",
          field: "name",
          message: "Please provide an array",
          operation: "parse",
          receivedValue: "hey",
          suggestion: "Provided value is not an array",
        },
      ],
    });
  });

  test("obj array 1", () => {
    expect(
      schema.parse({
        name: ["hey"],
      })
    ).toEqual({
      success: true,
      data: {
        name: ["hey"],
      },
    });
  });
});
