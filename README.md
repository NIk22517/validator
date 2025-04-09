# ValidEase - String Validation Library

A TypeScript library for validating strings with various constraints. This library provides enhanced error messages for better debugging and user feedback.

## Installation

```sh
npm install validease
```

## Table of Contents

- [String Validation](#string-validation)
- [Number Validation](#number-validation)
- [Boolean Validation](#boolean-validation)
- [Array Validation](#array-validation)
- [Object Validation](#object-validation)

## String Validation (#string-validation)

ValidEase provides a simple and intuitive API for validating strings. It allows you to set various constraints on string inputs, such as length, format, and character restrictions.
This library is designed to be easy to use and integrate into your TypeScript projects.
It provides detailed error messages to help you understand why a validation failed, making it easier to debug and provide feedback to users.
It is built with TypeScript, ensuring type safety and better developer experience.

## Features(#features)

- [Validate string length](#length-constraints) (`min`, `max`, `length`)
- [Ensure specific prefixes and suffixes](#starts-with) (`startsWith`, `endsWith`)
- [Check for inclusion of substrings](#includes) (`includes`)
- [Allow or block specific characters](#allow-or-block-specific-characters) (`allowChar`, `blockChar`)
- [Apply transformations](#string-transformations) (`trim`, `toLowerCase`, `toUpperCase`, `capitalize`, `slugify`)
- [Validate email and URL formats](#email-validation)
- [Enforce input requirements](#required-and-optional) (`optional`, `required`)
- [Advanced filtering](#advanced-filtering) (`alphaOnly`, `alphaNumeric`, `censor`)
- Custom error messages with detailed feedback

## Usage

### Import the Library

```ts
import { z } from "validease";
```

## Methods

### [Basic String Validation](#basic-string-validation)

```ts
const schema = z.string();
console.log(schema.parse("Hello")); // { success: true, data: "Hello" }
console.log(schema.parse(123)); // { success: false, errors: [{ message: "Value must be a string", field: "value", expectedType: "string", receivedValue: 123 }] }
```

### [Length Constraints](#length-constraints)

```ts
const schema = z.string().min(5).max(10);
console.log(schema.parse("Hello")); // Success
console.log(schema.parse("Hi")); // Fails: Must be at least 5 characters
console.log(schema.parse("TooLongWord")); // Fails: Must be at most 10 characters
```

### [Exact Length](#exact-length)

```ts
const schema = z.string().length(5);
console.log(schema.parse("Hello")); // Success
console.log(schema.parse("Hi")); // Fails: Must be exactly 5 characters
```

### [Starts With](#starts-with)

```ts
const schema = z.string().startsWith("hello");
console.log(schema.parse("hello world")); // Success
console.log(schema.parse("world hello")); // Fails: Must start with "hello"
```

### [Ends With](#ends-with)

```ts
const schema = z.string().endsWith("end");
console.log(schema.parse("my end")); // Success
console.log(schema.parse("end my")); // Fails: Must end with "end"
```

### [Includes](#includes)

```ts
const schema = z.string().includes("test");
console.log(schema.parse("this is a test")); // Success
console.log(schema.parse("no match here")); // Fails: Must include "test"
```

### [Allow or Block Specific Characters](#allow-or-block-specific-characters)

```ts
const schema = z.string().allowChar("abc");
console.log(schema.parse("abc")); // Success
console.log(schema.parse("xyz")); // Fails: Must only contain allowed characters

const schema2 = z.string().blockChar("xyz");
console.log(schema2.parse("hello")); // Success
console.log(schema2.parse("xylophone")); // Fails: Contains blocked characters
```

### [Email Validation](#email-validation)

```ts
const schema = z.string().email();
console.log(schema.parse("user@example.com")); // Success
console.log(schema.parse("invalid-email")); // Fails: Must be a valid email
```

### [URL Validation](#url-validation)

```ts
const schema = z.string().url();
console.log(schema.parse("https://example.com")); // Success
console.log(schema.parse("invalid-url")); // Fails: Must be a valid URL
```

### [Censoring Words](#censoring-words)

```ts
const schema = z.string().censor({ censor: ["badword"], replacement: "****" });
console.log(schema.parse("this is a badword")); // Outputs: "this is a ****"
```

### [String Transformations](#string-transformations)

```ts
const schema = z.string().trim();
console.log(schema.parse("  hello  ")); // Outputs "hello"

const schema2 = z.string().capitalize({ style: "each", separator: " " });
console.log(schema2.parse("hello world")); // Outputs: "Hello World"

const schema3 = z.string().slugify();
console.log(schema3.parse("Hello World!")); // Outputs: "hello-world"
```

### [Required and Optional](#required-and-optional)

```ts
const schema = z.string().required();
console.log(schema.parse("")); // Fails: Required field

const schema2 = z.string().optional();
console.log(schema2.parse(undefined)); // Success
```

### [Advanced Filtering](#advanced-filtering)

```ts
const schema = z.string().alphaOnly();
console.log(schema.parse("hello123")); // Fails: Only alphabetic characters allowed
console.log(schema.parse("hello")); // Success

const schema2 = z.string().alphaNumeric();
console.log(schema2.parse("hello123")); // Success
console.log(schema2.parse("hello!@#")); // Fails
```

## Custom Error Messages

```ts
const schema = z.string().min(5, { message: "Input is too short!" });
console.log(schema.parse("Hi"));
// { success: false, errors: [{ message: "Input is too short!", field: "value", expectedType: "string", receivedValue: "Hi" }] }
```

## Advanced Error Handling

If you want to customize how errors are returned:

```ts
const schema = z.string().startsWith("hello");
const result = schema.parse("world hello");
if (!result.success) {
  console.log(result.errors);
}
```

## Number Validation(#number-validation)

ValidEase also supports number validation with similar constraints as string validation. You can validate numbers with minimum, maximum, and exact values.

Here’s an enhanced version of the **Number Validation** section in your `README.md`, now including **all supported number validation methods** in ValidEase, such as: `min`, `max`, `int`, `float`, `positive`, `negative`, `nonNegative`, `nonPositive`, `multipleOf`, `between`, `greaterThan`, `lessThan`, and more if relevant.

---

## Number Validation

ValidEase provides a simple and intuitive API for validating numbers. It allows you to set various constraints on number inputs, such as range, exact value, and positivity.
This library is designed to be easy to use and integrate into your TypeScript projects.
It provides detailed error messages to help you understand why a validation failed, making it easier to debug and provide feedback to users.

## Features

- [Validate number range](#range-checks) (`min`, `max`, `between`)
- [Exact value checks](#exact-match) (`equals`)
- [Greater than / Less than checks](#greaterthan--lessthan) (`greaterThan`, `lessThan`)
- [Integer and float checks](#integer-and-float-checks) (`int`, `float`)
- [Positivity checks](#positivity-checks) (`positive`, `negative`, `nonNegative`, `nonPositive`)
- [Multiple of checks](#multiple-of) (`multipleOf`)
- [Required and optional](#required-and-optional) (`required`, `optional`)
- [Custom error messages](#custom-error-messages) with detailed feedback
- [Advanced error handling](#advanced-error-handling)
- [Basic number validation](#basic-number-validation)
- [Custom error messages](#custom-error-messages)
- [Advanced error handling](#advanced-error-handling)

### [Basic Number Validation](#basic-number-validation)

```ts
const schema = z.number();
console.log(schema.parse(42)); // Success
console.log(schema.parse("42")); // Fails: Value must be a number
```

### [Range Checks](#range-checks)

```ts
const schema = z.number().min(10).max(100);
console.log(schema.parse(50)); // Success
console.log(schema.parse(5)); // Fails: Must be at least 10
console.log(schema.parse(150)); // Fails: Must be at most 100
```

```ts
const schema = z.number().between({
  min: 10,
  max: 100,
});
console.log(schema.parse(50)); // Success
console.log(schema.parse(5)); // Fails: Must be between 10 and 100
console.log(schema.parse(150)); // Fails: Must be between 10 and 100
```

### [Exact Match](#exact-match)

```ts
const schema = z.number().equals(42);
console.log(schema.parse(42)); // Success
console.log(schema.parse(50)); // Fails: Must be equal to 42
```

### [GreaterThan / LessThan](#greaterthan--lessthan)

```ts
const schema = z.number().gt(10);
console.log(schema.parse(15)); // Success
console.log(schema.parse(5)); // Fails: Must be greater than 10
console.log(schema.parse(10)); // Fails: Must be greater than 10
```

```ts
const schema = z.number().lt(100);
console.log(schema.parse(50)); // Success
console.log(schema.parse(150)); // Fails: Must be less than 100
console.log(schema.parse(100)); // Fails: Must be less than 100
```

### [Integer and Float Checks](#integer-and-float-checks)

```ts
const schema = z.number().int();
console.log(schema.parse(42)); // Success
console.log(schema.parse(42.5)); // Fails: Must be an integer
```

```ts
const schema = z.number().float();
console.log(schema.parse(42.5)); // Success
console.log(schema.parse(42)); // Fails: Must be a float
```

### [Positivity Checks](#positivity-checks)

```ts
const schema = z.number().positive();
console.log(schema.parse(42)); // Success
console.log(schema.parse(-42)); // Fails: Must be positive
```

```ts
const schema = z.number().negative();
console.log(schema.parse(-42)); // Success
console.log(schema.parse(42)); // Fails: Must be negative
```

```ts
const schema = z.number().nonNegative();
console.log(schema.parse(0)); // Success
console.log(schema.parse(-42)); // Fails: Must be non-negative
```

```ts
const schema = z.number().nonPositive();
console.log(schema.parse(0)); // Success
console.log(schema.parse(42)); // Fails: Must be non-positive
```

### [Multiple Of](#multiple-of)

```ts
const schema = z.number().multipleOf(5);
console.log(schema.parse(10)); // Success
console.log(schema.parse(12)); // Fails: Must be a multiple of 5
```

### [Required and Optional](#required-and-optional)

```ts
const schema = z.number().required();
console.log(schema.parse(undefined)); // Fails: Required field
console.log(schema.parse(42)); // Success
```

```ts
const schema = z.number().optional();
console.log(schema.parse(undefined)); // Success
console.log(schema.parse(42)); // Success
```

### [Custom Error Messages](#custom-error-messages)

```ts
const schema = z.number().min(10, { message: "Input is too low!" });
console.log(schema.parse(5));
// { success: false, errors: [{ message: "Input is too low!", field: "value", expectedType: "number", receivedValue: 5 }] }
```

### [Advanced Error Handling](#advanced-error-handling)

If you want to customize how errors are returned:

```ts
const schema = z.number().greaterThan(10);
const result = schema.parse(5);
if (!result.success) {
  console.log(result.errors);
}
```

## Boolean Validation

ValidEase provides validation utilities for boolean values, allowing you to enforce true/false expectations and handle optional values.

### Features

- Boolean type validation
- Enforce specific values (`true`, `false`)
- Optional and required
- Custom error messages
- Advanced error handling

### [Basic Boolean Validation](#basic-boolean-validation)

```ts
const schema = z.boolean();
console.log(schema.parse(true)); // Success
console.log(schema.parse("true")); // Fails: Must be a boolean
```

### [Strict Boolean Match](#strict-boolean-match)

```ts
const schema = z.boolean().equals(true);
console.log(schema.parse(true)); // Success
console.log(schema.parse(false)); // Fails: Must be true
```

### [Optional](#required-and-optional)

```ts
const schema2 = z.boolean().optional();
console.log(schema2.parse(undefined)); // Success
```

---

## Array Validation

ValidEase supports validation of arrays, including item type checks, minimum/maximum length, uniqueness, and more.

### Features

- Enforce array item types

### [Basic Array Validation](#basic-array-validation)

```ts
const schema = z.array(z.string());
console.log(schema.parse(["a", "b", "c"])); // Success
console.log(schema.parse(["a", 1])); // Fails: Element must be a string
```

---

## Object Validation

ValidEase allows you to validate object shapes, including nested structures, required keys, and specific value types.

### Features

- Schema validation for object properties
- Nested object validation
- Optional and required keys
- Custom error messages
- Advanced error handling

### [Basic Object Validation](#basic-object-validation)

```ts
const schema = z.object({
  name: z.string().required(),
  age: z.number().optional(),
});
console.log(schema.parse({ name: "Alice" })); // Success
console.log(schema.parse({ age: 25 })); // Fails: name is required
```

### [Nested Object Validation](#nested-object-validation)

```ts
const schema = z.object({
  user: z.object({
    email: z.string().email(),
    profile: z.object({
      bio: z.string().optional(),
    }),
  }),
});
console.log(
  schema.parse({
    user: {
      email: "test@example.com",
      profile: { bio: "Developer" },
    },
  })
); // Success
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, features, or improvements.

## License

MIT
