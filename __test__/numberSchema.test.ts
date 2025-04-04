import { describe, expect, test } from "bun:test";
import { z } from "../src";
import { ValidationNumberError } from "../src/numberSchema/number-types";

describe("numberSchema", () => {
  test("check string with alpha numeric", () => {
    const schema = z.number();
    expect(schema.parse(123)).toEqual({
      success: true,
      data: 123,
    });
  });

  test("check string with empty string", () => {
    const schema = z.number();
    expect(schema.parse("")).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: "",
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });

  test("check string with boolean", () => {
    const schema = z.number();
    expect(schema.parse(true)).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: true,
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });

  test("check string with object", () => {
    const schema = z.number();
    expect(schema.parse({})).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: {},
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });
  test("check string with array", () => {
    const schema = z.number();
    expect(schema.parse([])).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: [],
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });

  test("check string with null", () => {
    const schema = z.number();
    expect(schema.parse(null)).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: null,
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });

  test("check string with undefined", () => {
    const schema = z.number();
    expect(schema.parse(undefined)).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: undefined,
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });

  test("check string with NaN", () => {
    const schema = z.number();
    expect(schema.parse(NaN)).toEqual({
      success: false,
      errors: [
        {
          field: "number",
          message: ValidationNumberError.NOT_A_NUMBER,
          operation: "parse",
          expectedType: "number",
          receivedValue: NaN,
          suggestion: "Ensure the value is a number",
        },
      ],
    });
  });
});

describe("numberSchema with checks", () => {
  test("check number with min", () => {
    const schema = z.number().min(10, { message: "Value is too small" });
    expect(schema.parse(5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value is too small",
          operation: "min",
          expectedType: "number",
          receivedValue: 5,
          suggestion: "value must be greater than 10",
        },
      ],
    });
  });

  test("check number with max", () => {
    const schema = z.number().max(10, { message: "Value is too large" });
    expect(schema.parse(15)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value is too large",
          operation: "max",
          expectedType: "number",
          receivedValue: 15,
          suggestion: "value must be less than 10",
        },
      ],
    });
  });

  test("check number with int", () => {
    const schema = z.number().int({ message: "Value must be an integer" });
    expect(schema.parse(10.5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be an integer",
          operation: "int",
          expectedType: "number",
          receivedValue: 10.5,
          suggestion: "value must be an integer",
        },
      ],
    });
  });

  test("check number with positive", () => {
    const schema = z.number().positive({ message: "Value must be positive" });
    expect(schema.parse(-5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be positive",
          operation: "positive",
          expectedType: "number",
          receivedValue: -5,
          suggestion: "value must be a positive number",
        },
      ],
    });
  });
  test("check number with negative", () => {
    const schema = z.number().negative({ message: "Value must be negative" });
    expect(schema.parse(5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be negative",
          operation: "negative",
          expectedType: "number",
          receivedValue: 5,
          suggestion: "value must be a negative number",
        },
      ],
    });
  });

  test("check number for float", () => {
    const schema = z.number().float({ message: "Value must be a float" });
    expect(schema.parse(5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be a float",
          operation: "float",
          expectedType: "number",
          receivedValue: 5,
          suggestion: "value must be a float",
        },
      ],
    });
  });

  test("check number for finite", () => {
    const schema = z.number().finite({ message: "Value must be finite" });
    expect(schema.parse(Infinity)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be finite",
          operation: "finite",
          expectedType: "number",
          receivedValue: Infinity,
          suggestion: "value must be a finite number",
        },
      ],
    });
  });

  test("check number for nonNegative", () => {
    const schema = z
      .number()
      .nonNegative({ message: "Value must be non-negative" });
    expect(schema.parse(-5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be non-negative",
          operation: "nonNegative",
          expectedType: "number",
          receivedValue: -5,
          suggestion: "value must be a non-negative number",
        },
      ],
    });
  });

  test("check number for nonPositive", () => {
    const schema = z
      .number()
      .nonPositive({ message: "Value must be non-positive" });
    expect(schema.parse(5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be non-positive",
          operation: "nonPositive",
          expectedType: "number",
          receivedValue: 5,
          suggestion: "value must be a non-positive number",
        },
      ],
    });
  });

  test("check number for equal", () => {
    const schema = z.number().equal(5, { message: "Value must be equal to 5" });
    expect(schema.parse(10)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be equal to 5",
          operation: "equal",
          expectedType: "number",
          receivedValue: 10,
          suggestion: "value must be equal to 5",
        },
      ],
    });
  });

  test("check number for nonEqual", () => {
    const schema = z
      .number()
      .nonEqual(5, { message: "Value must not be equal to 5" });
    expect(schema.parse(5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must not be equal to 5",
          operation: "nonEqual",
          expectedType: "number",
          receivedValue: 5,
          suggestion: "value must not be equal to 5",
        },
      ],
    });
  });

  test("check number for greater", () => {
    const schema = z.number().gt(5, { message: "Value must be greater" });
    expect(schema.parse(3)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be greater",
          operation: "greater",
          expectedType: "number",
          receivedValue: 3,
          suggestion: "value must be greater than 5",
        },
      ],
    });
  });

  test("check number for greaterEqual", () => {
    const schema = z
      .number()
      .gte(5, { message: "Value must be greater or equal" });
    expect(schema.parse(3)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be greater or equal",
          operation: "greaterEqual",
          expectedType: "number",
          receivedValue: 3,
          suggestion: "value must be greater than or equal to 5",
        },
      ],
    });
  });

  test("check number for less", () => {
    const schema = z.number().lt(5, { message: "Value must be less" });
    expect(schema.parse(7)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be less",
          operation: "less",
          expectedType: "number",
          receivedValue: 7,
          suggestion: "value must be less than 5",
        },
      ],
    });
  });

  test("check number for lessEqual", () => {
    const schema = z
      .number()
      .lte(5, { message: "Value must be less or equal" });
    expect(schema.parse(7)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be less or equal",
          operation: "lessEqual",
          expectedType: "number",
          receivedValue: 7,
          suggestion: "value must be less than or equal to 5",
        },
      ],
    });
  });
  test("check number for multipleOf success", () => {
    const schema = z
      .number()
      .multipleOf(5, { message: "Value must be a multiple of 5" });
    expect(schema.parse(10)).toEqual({
      success: true,
      data: 10,
    });
  });

  test("check number for multipleOf", () => {
    const schema = z
      .number()
      .multipleOf(5, { message: "Value must be a multiple of 5" });
    expect(schema.parse(7)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be a multiple of 5",
          operation: "multipleOf",
          expectedType: "number",
          receivedValue: 7,
          suggestion: "value must be a multiple of 5",
        },
      ],
    });
  });

  test("check number for safe", () => {
    const schema = z.number().safe({ message: "Value must be safe" });
    expect(schema.parse(5)).toEqual({
      success: true,
      data: 5,
    });
  });

  test("check number for safe with unsafe value", () => {
    const schema = z.number().safe({ message: "Value must be safe" });

    const unsafeValue = 2 ** 53;

    expect(schema.parse(unsafeValue)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be safe",
          operation: "safe",
          expectedType: "number",
          receivedValue: unsafeValue,
          suggestion: "value must be a safe integer",
        },
      ],
    });
  });

  test("check number for safe with safe value", () => {
    const schema = z.number().safe({ message: "Value must be safe" });
    expect(schema.parse(9007199254740991)).toEqual({
      success: true,
      data: 9007199254740991,
    });
  });

  //default value tests
  test("check number with default value", () => {
    const schema = z.number().default(10);
    expect(schema.parse(undefined)).toEqual({
      success: true,
      data: 10,
    });
  });

  test("check number with default value and coerce", () => {
    const schema = z.number().default(10).coerce();
    expect(schema.parse(undefined)).toEqual({
      success: true,
      data: 10,
    });
  });

  test("check number with default value and coerce with string", () => {
    const schema = z.number().default(10).coerce();
    expect(schema.parse("5")).toEqual({
      success: true,
      data: 5,
    });
  });

  test("check number with default value and coerce with boolean", () => {
    const schema = z.number().default(10).coerce();
    expect(schema.parse(true)).toEqual({
      success: true,
      data: 1,
    });
  });

  test("check number with default value and coerce with object", () => {
    const schema = z.number().default(10).coerce();
    expect(schema.parse({})).toEqual({
      success: true,
      data: 10,
    });
  });

  test("check number with default value and coerce with object", () => {
    const schema = z.number().coerce();
    expect(schema.parse({})).toEqual({
      success: true,
      data: 0,
    });
  });

  test("check number with default value and coerce with array", () => {
    const schema = z.number().default(10).coerce();
    expect(schema.parse([])).toEqual({
      success: true,
      data: 0,
    });
  });

  test("check number with default value and coerce with null", () => {
    const schema = z.number().default(10).coerce();
    expect(schema.parse(null)).toEqual({
      success: true,
      data: 0,
    });
  });

  test("check number with between", () => {
    const schema = z.number().between({
      min: 5,
      max: 10,
      message: "Value must be between 5 and 10",
    });
    expect(schema.parse(7)).toEqual({
      success: true,
      data: 7,
    });
  });

  test("check number with between min", () => {
    const schema = z.number().between({
      min: 5,
      max: 10,
      message: "Value must be between 5 and 10",
    });
    expect(schema.parse(3)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be between 5 and 10",
          operation: "between",
          expectedType: "number",
          receivedValue: 3,
          suggestion: "value must be between (inclusive) 5 and 10",
        },
      ],
    });
  });

  test("check number with exclusive between", () => {
    const schema = z.number().between({
      min: 5,
      max: 10,
      type: "exclusive",
      message: "Value must be between 5 and 10",
    });
    expect(schema.parse(5)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be between 5 and 10",
          operation: "between",
          expectedType: "number",
          receivedValue: 5,
          suggestion: "value must be between (exclusive) 5 and 10",
        },
      ],
    });
  });

  test("check number with step", () => {
    const schema = z.number().step(5, { message: "Value must be a step of 5" });
    expect(schema.parse(7)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Value must be a step of 5",
          operation: "step",
          expectedType: "number",
          receivedValue: 7,
          suggestion: "value must be a multiple of 5",
        },
      ],
    });
  });

  test("check number with step success", () => {
    const schema = z.number().step(5, { message: "Value must be a step of 5" });
    expect(schema.parse(10)).toEqual({
      success: true,
      data: 10,
    });
  });

  test("check number with step success with negative", () => {
    const schema = z
      .number()
      .step(-5, { message: "Value must be a step of -5" });
    expect(schema.parse(-10)).toEqual({
      success: true,
      data: -10,
    });
  });
});
