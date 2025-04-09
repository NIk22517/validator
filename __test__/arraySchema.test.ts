import { describe, expect, test } from "bun:test";
import { z } from "../src";

describe("test array", () => {
  const schema = z.array(z.boolean());

  test("test array boolean", () => {
    expect(schema.parse([])).toEqual({
      success: true,
      data: [],
    });
  });

  test("test array boolean 1", () => {
    expect(schema.parse([""])).toEqual({
      success: false,
      errors: [
        {
          expectedType: "boolean",
          field: 'Error occur in this field ""',
          message: "Provided value is not a boolean",
          operation: "parse",
          receivedValue: "",
          suggestion:
            "Use coercion or transformation to convert the value to boolean",
        },
      ],
    });
  });

  test("test array boolean 2", () => {
    expect(schema.parse([false, true, "hello"])).toEqual({
      success: false,
      errors: [
        {
          expectedType: "boolean",
          field: 'Error occur in this field "hello"',
          message: "Provided value is not a boolean",
          operation: "parse",
          receivedValue: "hello",
          suggestion:
            "Use coercion or transformation to convert the value to boolean",
        },
      ],
    });
  });

  test("test array boolean 3", () => {
    expect(schema.parse([false, true, false])).toEqual({
      success: true,
      data: [false, true, false],
    });
  });
});
