# ValidEase - String Validation Library

A TypeScript library for validating strings with various constraints. This library provides enhanced error messages for better debugging and user feedback.

## Installation

```sh
npm install validease
```

## Features

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

## Conclusion

ValidEase simplifies string validation with detailed error messages for better debugging. You can integrate it into any TypeScript project that requires robust input validation.

## License

MIT
