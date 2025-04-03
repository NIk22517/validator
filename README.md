# validator

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run src/index.ts
```

This project was created using `bun init` in bun v1.2.2. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

# ValidEase - Comprehensive Data Validation Library

A TypeScript library for validating strings with various constraints. This library provides enhanced error messages for better debugging and user feedback. Future updates will include validation for numbers and objects.

## Installation

```sh
npm install validease
```

## Features

- Validate string length (`min`, `max`, `length`)
- Ensure specific prefixes and suffixes (`startsWith`, `endsWith`)
- Check for inclusion of substrings (`includes`)
- Allow or block specific characters (`allowChar`, `blockChar`)
- Apply transformations (`trim`, `toLowerCase`, `toUpperCase`, `capitalize`, `slugify`)
- Validate email and URL formats
- Enforce input requirements (`optional`, `required`)
- Advanced filtering (`alphaOnly`, `alphaNumeric`, `censor`)
- Custom error messages with detailed feedback

## Usage

### Import the Library

```ts
import { z } from "validease";
```

### Basic String Validation

```ts
const schema = z.string();
console.log(schema.parse("Hello")); // { success: true, data: "Hello" }
console.log(schema.parse(123)); // { success: false, errors: [{ message: "Value must be a string", field: "value", expectedType: "string", receivedValue: 123 }] }
```

### Length Constraints

```ts
const schema = z.string().min(5).max(10);
console.log(schema.parse("Hello")); // Success
console.log(schema.parse("Hi")); // Fails: Must be at least 5 characters
console.log(schema.parse("TooLongWord")); // Fails: Must be at most 10 characters
```

### Exact Length

```ts
const schema = z.string().length(5);
console.log(schema.parse("Hello")); // Success
console.log(schema.parse("Hi")); // Fails: Must be exactly 5 characters
```

### Starts With

```ts
const schema = z.string().startsWith("hello");
console.log(schema.parse("hello world")); // Success
console.log(schema.parse("world hello")); // Fails: Must start with "hello"
```

### Ends With

```ts
const schema = z.string().endsWith("end");
console.log(schema.parse("my end")); // Success
console.log(schema.parse("end my")); // Fails: Must end with "end"
```

### Includes

```ts
const schema = z.string().includes("test");
console.log(schema.parse("this is a test")); // Success
console.log(schema.parse("no match here")); // Fails: Must include "test"
```

### Allow or Block Specific Characters

```ts
const schema = z.string().allowChar("abc");
console.log(schema.parse("abc")); // Success
console.log(schema.parse("xyz")); // Fails: Must only contain allowed characters

const schema2 = z.string().blockChar("xyz");
console.log(schema2.parse("hello")); // Success
console.log(schema2.parse("xylophone")); // Fails: Contains blocked characters
```

### Email Validation

```ts
const schema = z.string().email();
console.log(schema.parse("user@example.com")); // Success
console.log(schema.parse("invalid-email")); // Fails: Must be a valid email
```

### URL Validation

```ts
const schema = z.string().url();
console.log(schema.parse("https://example.com")); // Success
console.log(schema.parse("invalid-url")); // Fails: Must be a valid URL
```

### Censoring Words

```ts
const schema = z.string().censor({ censor: ["badword"], replacement: "****" });
console.log(schema.parse("this is a badword")); // Outputs: "this is a ****"
```

### Trimming Whitespace

```ts
const schema = z.string().trim();
console.log(schema.parse("  hello  ")); // Outputs "hello"
```

### Capitalization

```ts
const schema = z.string().capitalize({ style: "title", separator: " " });
console.log(schema.parse("hello world")); // Outputs: "Hello World"
```

### Slugify

```ts
const schema = z.string().slugify("-");
console.log(schema.parse("Hello World!")); // Outputs: "hello-world"
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

ValidEase simplifies validation with detailed error messages for better debugging. You can integrate it into any TypeScript project that requires robust input validation.

## License

MIT
