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
      errors: [
        {
          field: "value",
          message: ValidationStringError.NOT_A_STRING,
          operation: "type",
          expectedType: "string",
          receivedValue: 123,
          suggestion: "value must be a string",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.TOO_SHORT,
          operation: "min",
          expectedType: "string",
          receivedValue: "hi",
          suggestion: "value must be at least 3 characters long",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.TOO_LONG,
          operation: "max",
          expectedType: "string",
          receivedValue: "hello hello hello",
          suggestion: "value must be at most 10 characters long",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: "Message should be 3 character long",
          operation: "min",
          expectedType: "string",
          receivedValue: "hi",
          suggestion: "value must be at least 3 characters long",
        },
      ],
    });
  });

  test("max length message fails", () => {
    const schema = z.string().max(10, {
      message: "Message should not exceed 10 character",
    });
    expect(schema.parse("hello hello hello")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Message should not exceed 10 character",
          operation: "max",
          expectedType: "string",
          receivedValue: "hello hello hello",
          suggestion: "value must be at most 10 characters long",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.INVALID_LENGTH,
          operation: "length",
          expectedType: "string",
          receivedValue: "hi",
          suggestion: "value must be exactly 5 characters long",
        },
      ],
    });
  });

  test("custom message for length check", () => {
    const schema = z.string().length(5, {
      message: "Message should be 5 character long",
    });
    expect(schema.parse("hi")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Message should be 5 character long",
          operation: "length",
          expectedType: "string",
          receivedValue: "hi",
          suggestion: "value must be exactly 5 characters long",
        },
      ],
    });
  });
});

describe("custom message for string", () => {
  test("custom message for not string", () => {
    const schema = z.string({ message: "Must be string" });
    expect(schema.parse(123)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Must be string",
          operation: "type",
          expectedType: "string",
          receivedValue: 123,
          suggestion: "value must be a string",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.START_ERROR,
          operation: "startsWith",
          expectedType: "string",
          receivedValue: "world hello",
          suggestion: 'value must startsWith "hello"',
        },
      ],
    });
  });

  test("custom message for startsWith", () => {
    const schema = z.string().startsWith("hello", {
      message: "String should start with hello",
    });
    expect(schema.parse("world hello")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String should start with hello",
          operation: "startsWith",
          expectedType: "string",
          receivedValue: "world hello",
          suggestion: 'value must startsWith "hello"',
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.END_ERROR,
          operation: "endsWith",
          expectedType: "string",
          receivedValue: "hello hello",
          suggestion: 'value must endsWith "world"',
        },
      ],
    });
  });
  test("custom message for endsWith", () => {
    const schema = z.string().endsWith("world", {
      message: "String should end with world",
    });
    expect(schema.parse("hello hello")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String should end with world",
          operation: "endsWith",
          expectedType: "string",
          receivedValue: "hello hello",
          suggestion: 'value must endsWith "world"',
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.REGEX_ERROR,
          operation: "regex",
          expectedType: "string",
          receivedValue: "hello",
          suggestion: `value must match the regex ${/^\d+$/}`,
        },
      ],
    });
  });

  test("custom message for regex", () => {
    const schema = z.string().regex(/^\d+$/, {
      message: "String should be a number",
    });
    expect(schema.parse("hello")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String should be a number",
          operation: "regex",
          expectedType: "string",
          receivedValue: "hello",
          suggestion: `value must match the regex ${/^\d+$/}`,
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.INVALID_EMAIL,
          operation: "email",
          expectedType: "string",
          receivedValue: "hello@hello",
          suggestion: "value must be a valid email address",
        },
      ],
    });
  });

  test("custom message for email", () => {
    const schema = z.string().email({
      message: "Invalid email",
    });
    expect(schema.parse("hello@hello")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Invalid email",
          operation: "email",
          expectedType: "string",
          receivedValue: "hello@hello",
          suggestion: "value must be a valid email address",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.INVALID_URL,
          operation: "url",
          expectedType: "string",
          receivedValue: "hello",
          suggestion: "value must be a valid URL",
        },
      ],
    });
  });

  test("custom message for url", () => {
    const schema = z.string().url({
      message: "Invalid URL",
    });
    expect(schema.parse("hello")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "Invalid URL",
          operation: "url",
          expectedType: "string",
          receivedValue: "hello",
          suggestion: "value must be a valid URL",
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.INCLUDES_ERROR,
          operation: "includes",
          expectedType: "string",
          receivedValue: "world",
          suggestion: 'value must includes "hello"',
        },
      ],
    });
  });

  test("custom message for includes", () => {
    const schema = z.string().includes("hello", {
      message: "String should include hello",
    });
    expect(schema.parse("world")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String should include hello",
          operation: "includes",
          expectedType: "string",
          receivedValue: "world",
          suggestion: 'value must includes "hello"',
        },
      ],
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
      errors: [
        {
          field: "value",
          message: ValidationStringError.REQUIRED_ERROR,
          operation: "required",
          expectedType: "string",
          receivedValue: null,
          suggestion: "value must be a string",
        },
      ],
    });
  });

  test("required string with undefined", () => {
    const schema = z.string().required();
    expect(schema.parse(undefined)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: ValidationStringError.REQUIRED_ERROR,
          operation: "required",
          expectedType: "string",
          receivedValue: undefined,
          suggestion: "value must be a string",
        },
      ],
    });
  });

  test("required string with custom message", () => {
    const schema = z.string().required({ message: "String is required" });
    expect(schema.parse(undefined)).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String is required",
          operation: "required",
          expectedType: "string",
          receivedValue: undefined,
          suggestion: "value must be a string",
        },
      ],
    });
  });
});

describe("check all capitilization", () => {
  test("check empty string", () => {
    const schema = z.string().capitalize();
    expect(schema.parse("")).toEqual({ success: true, data: "" });
  });
  test("check capitilization default", () => {
    const schema = z.string().capitalize();
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "Hello world",
    });
  });

  test("check captilization with title", () => {
    const schema = z.string().capitalize({
      style: "title",
    });
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "Hello World",
    });
  });

  test("check captilization with upper", () => {
    const schema = z.string().capitalize({
      style: "uppercase",
    });
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "HELLO WORLD",
    });
  });

  test("check captilization with lower", () => {
    const schema = z.string().capitalize({
      style: "lowercase",
    });
    expect(schema.parse("HELLO WORLD")).toEqual({
      success: true,
      data: "hello world",
    });
  });
  test("check captilization with pascal", () => {
    const schema = z.string().capitalize({
      style: "pascal",
    });
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "HelloWorld",
    });
  });
  test("check captilization with camel", () => {
    const schema = z.string().capitalize({
      style: "camel",
    });
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "helloWorld",
    });
  });
  test("check captilization with custom separator", () => {
    const schema = z.string().capitalize({
      style: "title",
      separator: "-",
    });
    expect(schema.parse("hello-world")).toEqual({
      success: true,
      data: "Hello-World",
    });
  });
  test("check captilization with custom separator", () => {
    const schema = z.string().capitalize({
      style: "title",
      separator: "_",
    });
    expect(schema.parse("hello_world")).toEqual({
      success: true,
      data: "Hello_World",
    });
  });
});

describe("check slugify", () => {
  test("check slugify", () => {
    const schema = z.string().slugify();
    expect(schema.parse("Hello World")).toEqual({
      success: true,
      data: "hello-world",
    });
  });

  test("check slugify with custom separator", () => {
    const schema = z.string().slugify("-");
    expect(schema.parse("Hello World")).toEqual({
      success: true,
      data: "hello-world",
    });
  });

  test("check slugify with custom separator", () => {
    const schema = z.string().slugify("_");
    expect(schema.parse("Hello World")).toEqual({
      success: true,
      data: "hello_world",
    });
  });
});

describe("check string with alpha", () => {
  test("check string with alpha", () => {
    const schema = z.string().alphaOnly();
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });

  test("check string with alpha fails", () => {
    const schema = z.string().alphaOnly();
    expect(schema.parse("hello123")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: ValidationStringError.ALPHA_ONLY,
          operation: "alphaOnly",
          expectedType: "string",
          receivedValue: "hello123",
          suggestion: `value must contain only alphabetic characters`,
        },
      ],
    });
  });

  test("check string with alpha custom message", () => {
    const schema = z.string().alphaOnly({
      message: "String should contain only letters",
    });
    expect(schema.parse("hello123")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String should contain only letters",
          operation: "alphaOnly",
          expectedType: "string",
          receivedValue: "hello123",
          suggestion: `value must contain only alphabetic characters`,
        },
      ],
    });
  });
});

describe("check string with alpha numeric", () => {
  test("check string with alpha numeric", () => {
    const schema = z.string().alphaNumeric();
    expect(schema.parse("hello123")).toEqual({
      success: true,
      data: "hello123",
    });
  });

  test("check string with alpha numeric fails", () => {
    const schema = z.string().alphaNumeric();
    expect(schema.parse("hello!")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: ValidationStringError.ALPHA_NUMERIC,
          operation: "alphaNumeric",
          expectedType: "string",
          receivedValue: "hello!",
          suggestion: `value must contain only alphanumeric characters`,
        },
      ],
    });
  });

  test("check string with alpha numeric custom message", () => {
    const schema = z.string().alphaNumeric({
      message: "String should contain only letters and numbers",
    });
    expect(schema.parse("hello!")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String should contain only letters and numbers",
          operation: "alphaNumeric",
          expectedType: "string",
          receivedValue: "hello!",
          suggestion: `value must contain only alphanumeric characters`,
        },
      ],
    });
  });

  test("check with string only", () => {
    const schema = z.string().alphaNumeric();
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });
});

describe("check string with allow char", () => {
  test("check string with allow char", () => {
    const schema = z.string().allowChar("abc123");
    expect(schema.parse("abc")).toEqual({
      success: true,
      data: "abc",
    });
  });

  test("check string with allow char fails", () => {
    const schema = z.string().allowChar("!@#$%^&*()_+");
    expect(schema.parse("hello123")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: ValidationStringError.ALLOW_CHAR,
          operation: "allowChar",
          expectedType: "string",
          receivedValue: "hello123",
          suggestion: `value must contain only allowed characters`,
        },
      ],
    });
  });

  test("check string with allow char custom message", () => {
    const schema = z.string().allowChar("!@#$%^&*()_+", {
      message:
        "String should contain only letters, numbers, and specified characters",
    });
    expect(schema.parse("hello123")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message:
            "String should contain only letters, numbers, and specified characters",
          operation: "allowChar",
          expectedType: "string",
          receivedValue: "hello123",
          suggestion: `value must contain only allowed characters`,
        },
      ],
    });
  });
});

describe("StringSchema - blockChars", () => {
  test("should allow string without blocked characters", () => {
    const schema = z.string().blockChar("!@#");
    expect(schema.parse("hello")).toEqual({ success: true, data: "hello" });
  });

  test("should fail when string contains blocked characters", () => {
    const schema = z.string().blockChar("!@#", {
      message: "String contains blocked characters: !",
    });
    expect(schema.parse("hello!")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String contains blocked characters: !",
          operation: "blockChar",
          expectedType: "string",
          receivedValue: "hello!",
          suggestion: `value must not contain blocked characters`,
        },
      ],
    });
  });

  test("should fail when multiple blocked characters are present", () => {
    const schema = z.string().blockChar("!@#", {
      message: "String contains blocked characters: @, #",
    });
    expect(schema.parse("test@string#")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String contains blocked characters: @, #",
          operation: "blockChar",
          expectedType: "string",
          receivedValue: "test@string#",
          suggestion: `value must not contain blocked characters`,
        },
      ],
    });
  });

  test("should allow empty string even if blocking characters exist", () => {
    const schema = z.string().blockChar("!@#");
    expect(schema.parse("")).toEqual({ success: true, data: "" });
  });

  test("should not modify the string if it does not contain blocked characters", () => {
    const schema = z.string().blockChar("123");
    expect(schema.parse("abcdef")).toEqual({ success: true, data: "abcdef" });
  });

  test("should allow normal alphanumeric characters when no block is applied", () => {
    const schema = z.string();
    expect(schema.parse("hello123")).toEqual({
      success: true,
      data: "hello123",
    });
  });

  test("should work with multiple blocked characters in a row", () => {
    const schema = z.string().blockChar("!@#", {
      message: "String contains blocked characters: !, @, #",
    });
    expect(schema.parse("!@#test@!")).toEqual({
      success: false,
      errors: [
        {
          field: "value",
          message: "String contains blocked characters: !, @, #",
          operation: "blockChar",
          expectedType: "string",
          receivedValue: "!@#test@!",
          suggestion: `value must not contain blocked characters`,
        },
      ],
    });
  });
});

describe("StringSchema - censor", () => {
  test("should censor sensitive information", () => {
    const schema = z.string().censor({
      censor: "password",
    });
    expect(schema.parse("my password is secret")).toEqual({
      success: true,
      data: "my ******** is secret",
    });
  });

  test("should not modify string if no sensitive information is present", () => {
    const schema = z.string().censor();
    expect(schema.parse("hello world")).toEqual({
      success: true,
      data: "hello world",
    });
  });

  test("should work with multiple sensitive words", () => {
    const schema = z.string().censor({
      censor: ["password", "secret"],
    });

    expect(schema.parse("my password and secret are safe")).toEqual({
      success: true,
      data: "my ******** and ****** are safe",
    });
  });
});
