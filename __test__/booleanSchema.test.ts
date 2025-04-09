import { describe, expect, test } from "bun:test";
import { z } from "../src";
import { ValidationBooleanError } from "../src/booleanSchema/boolean-types";

describe("test boolean schema", () => {
  test("boolean test to check value is boolean", () => {
    const schema = z.boolean();
    expect(schema.parse("")).toEqual({
      success: false,
      errors: [
        {
          field: "boolean",
          message: "Provided value is not a boolean",
          operation: "parse",
          expectedType: "boolean",
          receivedValue: "",
          suggestion:
            "Use coercion or transformation to convert the value to boolean",
        },
      ],
    });
  });

  test("value is boolean", () => {
    const schema = z.boolean();
    expect(schema.parse(false)).toEqual({
      success: true,
      data: false,
    });
  });
});

describe("test to check default value", () => {
  test("provide default", () => {
    const schema = z.boolean().default(false);
    expect(schema.parse("")).toEqual({
      success: true,
      data: false,
    });
  });
});

describe("check value is true", () => {
  test("true value", () => {
    const schema = z.boolean().isTrue();
    expect(schema.parse(true)).toEqual({
      success: true,
      data: true,
    });
  });

  test("fail condition", () => {
    const schema = z.boolean().isTrue();
    expect(schema.parse(false)).toEqual({
      success: false,
      errors: [
        {
          field: "boolean",
          message: ValidationBooleanError.IS_TRUE_ERROR,
          operation: "isTrue",
          expectedType: "true",
          receivedValue: false,
          suggestion: 'Your provided value is not "true"',
        },
      ],
    });
  });

  test("fail custom message", () => {
    const schema = z.boolean().isTrue({
      message: "Provide true value",
    });
    expect(schema.parse(false)).toEqual({
      success: false,
      errors: [
        {
          field: "boolean",
          message: "Provide true value",
          operation: "isTrue",
          expectedType: "true",
          receivedValue: false,
          suggestion: 'Your provided value is not "true"',
        },
      ],
    });
  });
});

describe("test for coerce", () => {
  test("success", () => {
    const schema = z.boolean().coerce();
    expect(schema.parse("")).toEqual({
      success: true,
      data: false,
    });
  });

  test("success", () => {
    const schema = z.boolean().coerce();
    expect(schema.parse(1)).toEqual({
      success: true,
      data: true,
    });
  });

  test("success", () => {
    const schema = z.boolean().coerce().default(true);
    expect(schema.parse("")).toEqual({
      success: true,
      data: true,
    });
  });
});

describe("check value equal", () => {
  const schema = z.boolean().equal(false);
  test("equal check", () => {
    expect(schema.parse(false)).toEqual({
      success: true,
      data: false,
    });
  });

  test("equal fail", () => {
    expect(schema.parse(true)).toEqual({
      success: false,
      errors: [
        {
          field: "boolean",
          message: ValidationBooleanError.EQUAL_ERROR,
          operation: "equal",
          expectedType: `${true}`,
          receivedValue: true,
          suggestion: "Provide a same value",
        },
      ],
    });
  });
});

describe("test null ", () => {
  const schema = z.boolean();
  test("test null", () => {
    expect(schema.nullable().parse(null)).toEqual({
      success: true,
      data: false,
    });
  });

  test("test null default", () => {
    expect(schema.default(true).nullable().parse(null)).toEqual({
      success: true,
      data: true,
    });
  });
});

describe("test  undefined", () => {
  const schema = z.boolean();
  test("test undefined", () => {
    expect(schema.optional().parse(undefined)).toEqual({
      success: true,
      data: false,
    });
  });

  test("test undefined default", () => {
    expect(schema.default(true).optional().parse(undefined)).toEqual({
      success: true,
      data: true,
    });
  });
});
