import { expect, test, describe } from "bun:test";
import { z } from "../src/index";
import { ValidationStringError } from "../src/errors";

describe("test pass value is string or not", () => {
  test("Valid string should pass", () => {
    const schema = z.string();
    expect(schema.parse("Hello")).toEqual({ success: true, data: "Hello" });
  });

  test("on-string should fail", () => {
    const schema = z.string();
    expect(schema.parse(123)).toEqual({
      success: false,
      errors: [ValidationStringError.NOT_A_STRING],
    });
  });
  test("Empty string should pass", () => {
    const schema = z.string();
    expect(schema.parse("")).toEqual({ success: true, data: "" });
  });
});

describe("test min max length for string", () => {
  test("min length check", () => {
    const schema = z.string().min(3);
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });

  test("min length check fails", () => {
    const schema = z.string().min(3);
    expect(schema.parse("hi")).toEqual({
      success: false,
      errors: [ValidationStringError.TOO_SHORT],
    });
  });

  test("max length check", () => {
    const schema = z.string().min(3).max(12);
    expect(schema.parse("hello hello")).toEqual({
      success: true,
      data: "hello hello",
    });
  });

  test("max length check", () => {
    const schema = z.string().min(3).max(10);
    expect(schema.parse("hello hello hello")).toEqual({
      success: false,
      errors: [ValidationStringError.TOO_LONG],
    });
  });
});

describe("custom error message for min max string", () => {
  test("min length message fails", () => {
    const schema = z.string().min(3, {
      message: "Message should be 3 character long",
    });
    expect(schema.parse("hi")).toEqual({
      success: false,
      errors: ["Message should be 3 character long"],
    });
  });

  test("max length message fails", () => {
    const schema = z.string().max(10, {
      message: "Message should not exceed 10 character",
    });
    expect(schema.parse("hello hello hello")).toEqual({
      success: false,
      errors: ["Message should not exceed 10 character"],
    });
  });
});

describe("check string length", () => {
  test("length check", () => {
    const schema = z.string().length(5);
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });

  test("length check fails", () => {
    const schema = z.string().length(5);
    expect(schema.parse("hi")).toEqual({
      success: false,
      errors: [ValidationStringError.INVALID_LENGTH],
    });
  });

  test("custom message for length check", () => {
    const schema = z.string().length(5, {
      message: "Message should be 5 character long",
    });
    expect(schema.parse("hi")).toEqual({
      success: false,
      errors: ["Message should be 5 character long"],
    });
  });
});

describe("custom message for string", () => {
  test("custom message for not string", () => {
    const schema = z.string({ message: "Must be string" });
    expect(schema.parse(123)).toEqual({
      success: false,
      errors: ["Must be string"],
    });
  });
});

describe("string to lower case", () => {
  test("convert string to lower case", () => {
    const schema = z.string().toLowerCase();
    expect(schema.parse("HELLO")).toEqual({ success: true, data: "hello" });
  });
});

describe("string to upper case", () => {
  test("convert string to upper case", () => {
    const schema = z.string().toUpperCase();
    expect(schema.parse("hello")).toEqual({ success: true, data: "HELLO" });
  });
});

describe("string trim", () => {
  test("trim string", () => {
    const schema = z.string().trim();
    expect(schema.parse(" hello ")).toEqual({ success: true, data: "hello" });
  });
});

describe("string startsWith", () => {
  test("string startsWith", () => {
    const schema = z.string().startsWith("hello");
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "hello world",
    });
  });

  test("string startsWith fails", () => {
    const schema = z.string().startsWith("hello");
    expect(schema.parse("world hello")).toEqual({
      success: false,
      errors: [ValidationStringError.START_ERROR],
    });
  });

  test("custom message for startsWith", () => {
    const schema = z.string().startsWith("hello", {
      message: "String should start with hello",
    });
    expect(schema.parse("world hello")).toEqual({
      success: false,
      errors: ["String should start with hello"],
    });
  });
});

describe("string endsWith", () => {
  test("string endsWith", () => {
    const schema = z.string().endsWith("world");
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "hello world",
    });
  });

  test("string endsWith fails", () => {
    const schema = z.string().endsWith("world");
    expect(schema.parse("hello hello")).toEqual({
      success: false,
      errors: [ValidationStringError.END_ERROR],
    });
  });
  test("custom message for endsWith", () => {
    const schema = z.string().endsWith("world", {
      message: "String should end with world",
    });
    expect(schema.parse("hello hello")).toEqual({
      success: false,
      errors: ["String should end with world"],
    });
  });
});

describe("string regex", () => {
  test("string regex", () => {
    const schema = z.string().regex(/^\d+$/);
    expect(schema.parse("123")).toEqual({ success: true, data: "123" });
  });

  test("string regex fails", () => {
    const schema = z.string().regex(/^\d+$/);
    expect(schema.parse("hello")).toEqual({
      success: false,
      errors: [ValidationStringError.REGEX_ERROR],
    });
  });

  test("custom message for regex", () => {
    const schema = z.string().regex(/^\d+$/, {
      message: "String should be a number",
    });
    expect(schema.parse("hello")).toEqual({
      success: false,
      errors: ["String should be a number"],
    });
  });
});

describe("email validation", () => {
  test("email validation", () => {
    const schema = z.string().email();
    expect(schema.parse("hello@hello.com")).toEqual({
      success: true,
      data: "hello@hello.com",
    });
  });

  test("email validation fails", () => {
    const schema = z.string().email();
    expect(schema.parse("hello@hello")).toEqual({
      success: false,
      errors: [ValidationStringError.INVALID_EMAIL],
    });
  });

  test("custom message for email", () => {
    const schema = z.string().email({
      message: "Invalid email",
    });
    expect(schema.parse("hello@hello")).toEqual({
      success: false,
      errors: ["Invalid email"],
    });
  });
});

describe("url validation", () => {
  test("url validation", () => {
    const schema = z.string().url();
    expect(schema.parse("https://www.google.com")).toEqual({
      success: true,
      data: "https://www.google.com",
    });
  });

  test("url validation fails", () => {
    const schema = z.string().url();
    expect(schema.parse("hello")).toEqual({
      success: false,
      errors: [ValidationStringError.INVALID_URL],
    });
  });

  test("custom message for url", () => {
    const schema = z.string().url({
      message: "Invalid URL",
    });
    expect(schema.parse("hello")).toEqual({
      success: false,
      errors: ["Invalid URL"],
    });
  });
});

describe("string includes", () => {
  test("string includes", () => {
    const schema = z.string().includes("hello");
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "hello world",
    });
  });

  test("string includes fails", () => {
    const schema = z.string().includes("hello");
    expect(schema.parse("world")).toEqual({
      success: false,
      errors: [ValidationStringError.INCLUDES_ERROR],
    });
  });

  test("custom message for includes", () => {
    const schema = z.string().includes("hello", {
      message: "String should include hello",
    });
    expect(schema.parse("world")).toEqual({
      success: false,
      errors: ["String should include hello"],
    });
  });
});

describe("default value for string", () => {
  test("default value for string", () => {
    const schema = z.string().default("hello");
    expect(schema.parse(undefined)).toEqual({ success: true, data: "hello" });
  });
  test("default value for string", () => {
    const schema = z.string().default("hello");
    expect(schema.parse("world")).toEqual({ success: true, data: "world" });
  });
});

describe("start coerce", () => {
  test("start coerce number", () => {
    const schema = z.string().coerce();
    expect(schema.parse(123)).toEqual({ success: true, data: "123" });
  });

  test("start coerce boolean", () => {
    const schema = z.string().coerce();
    expect(schema.parse(true)).toEqual({ success: true, data: "true" });
  });

  test("start coerce null", () => {
    const schema = z.string().coerce();
    expect(schema.parse(null)).toEqual({ success: true, data: "" });
  });
  test("start coerce undefined", () => {
    const schema = z.string().coerce();
    expect(schema.parse(undefined)).toEqual({ success: true, data: "" });
  });
  test("start coerce object", () => {
    const schema = z.string().coerce();
    expect(schema.parse({})).toEqual({
      success: true,
      data: "{}",
    });
  });
  test("start coerce array", () => {
    const schema = z.string().coerce();

    expect(schema.parse([1, 2, 3])).toEqual({
      success: true,
      data: "[1,2,3]",
    });
  });
});

describe("optional string", () => {
  test("optional string", () => {
    const schema = z.string().optional();
    expect(schema.parse(undefined)).toEqual({ success: true, data: "" });
  });

  test("optional string with value", () => {
    const schema = z.string().optional();
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });

  test("optional string with null", () => {
    const schema = z.string().optional();
    expect(schema.parse(null)).toEqual({ success: true, data: "" });
  });
  test("optional string with number", () => {
    const schema = z.string().optional();
    expect(schema.parse(123)).toEqual({ success: true, data: "" });
  });
});

describe("required string", () => {
  test("required string", () => {
    const schema = z.string().required();
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });

  test("required string with null", () => {
    const schema = z.string().required();
    expect(schema.parse(null)).toEqual({
      success: false,
      errors: [ValidationStringError.REQUIRED_ERROR],
    });
  });

  test("required string with undefined", () => {
    const schema = z.string().required();
    expect(schema.parse(undefined)).toEqual({
      success: false,
      errors: [ValidationStringError.REQUIRED_ERROR],
    });
  });

  test("required string with custom message", () => {
    const schema = z.string().required({ message: "String is required" });
    expect(schema.parse(undefined)).toEqual({
      success: false,
      errors: ["String is required"],
    });
  });
});
