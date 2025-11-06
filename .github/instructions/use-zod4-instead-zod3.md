---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
---
# Use Zod 4 Instead of Zod 3

## Import Changes
```ts
// Zod 4 (new)
import { z } from "zod";
import { z } from "zod/v4"; // also available

// Access core utilities
import { z } from "zod/v4/core";
```

## Major Breaking Changes

### 1. Object Methods → Top-Level Functions
```ts
// Zod 3 ❌
z.object({ name: z.string() }).strict();
z.object({ name: z.string() }).passthrough();

// Zod 4 ✅
z.strictObject({ name: z.string() });
z.looseObject({ name: z.string() });
```

### 2. String Format Methods → Top-Level Functions
```ts
// Zod 3 ❌
z.string().email();
z.string().uuid();
z.string().url();
z.string().ip();
z.string().cidr();

// Zod 4 ✅
z.email();
z.uuid(); // or z.uuidv4(), z.uuidv7(), etc.
z.url();
z.ipv4(); // or z.ipv6()
z.cidrv4(); // or z.cidrv6()
```

### 3. Record Schema Changes
```ts
// Zod 3 ❌
z.record(z.string()); // single argument

// Zod 4 ✅
z.record(z.string(), z.string()); // key and value schemas required
```

### 4. Error Customization
```ts
// Zod 3 ❌
z.string({
  required_error: "This field is required",
  invalid_type_error: "Not a string",
});

z.string().min(5, { message: "Too short." });

// Zod 4 ✅
z.string({ 
  error: (issue) => issue.input === undefined 
    ? "This field is required" 
    : "Not a string" 
});

z.string().min(5, { error: "Too short." });
```

### 5. Default Values with Transforms
```ts
// Zod 3 ❌
const schema = z.string()
  .transform(val => val.length)
  .default("tuna"); // default applied before transform

// Zod 4 ✅
const schema = z.string()
  .transform(val => val.length)
  .default(0); // default must match output type

// Alternative: Use .prefault() for old behavior
const schema = z.string()
  .transform(val => val.length)
  .prefault("tuna"); // applies default before transform
```

### 6. Coerce Input Type Changes
```ts
const schema = z.coerce.string();
type schemaInput = z.input<typeof schema>;

// Zod 3: string
// Zod 4: unknown (more accurate)
```

### 7. ZodType Generic Structure
```ts
// Zod 3 ❌
class ZodType<Output, Def extends z.ZodTypeDef, Input = Output>

// Zod 4 ✅
class ZodType<Output = unknown, Input = unknown>
```

## New Features in Zod 4

### 1. Enhanced Discriminated Unions
```ts
const MyResult = z.discriminatedUnion("status", [
  z.object({ status: z.literal("success"), data: z.string() }),
  z.object({ status: z.union([z.literal("error"), z.literal("failed")]) }),
  z.object({ status: z.literal("pending").transform(val => val.toUpperCase()) }),
]);
```

### 2. Recursive Schemas (No Type Casting)
```ts
const Category = z.object({
  name: z.string(),
  get subcategories(){
    return z.array(Category)
  }
});

type Category = z.infer<typeof Category>;
// { name: string; subcategories: Category[] }
```

### 3. Refinements with Method Chaining
```ts
// Zod 4 ✅ - Now works!
z.string()
  .refine(val => val.includes("@"))
  .min(5);
```

### 4. File Validation
```ts
const fileSchema = z.file()
  .min(10_000) // minimum size in bytes
  .max(1_000_000) // maximum size in bytes
  .type("image/png"); // MIME type
```

### 5. Template Literals
```ts
const hello = z.templateLiteral(["hello, ", z.string()]);
// `hello, ${string}`

const cssUnits = z.enum(["px", "em", "rem", "%"]);
const css = z.templateLiteral([z.number(), cssUnits]);
// `${number}px` | `${number}em` | `${number}rem` | `${number}%`
```

### 6. JSON Schema Conversion
```ts
const mySchema = z.object({
  name: z.string(), 
  points: z.number()
});

z.toJSONSchema(mySchema);
// => {
//   type: "object",
//   properties: {
//     name: {type: "string"},
//     points: {type: "number"},
//   },
//   required: ["name", "points"],
// }
```

### 7. Multiple Literal Values
```ts
// Zod 4 ✅
const httpCodes = z.literal([200, 201, 202, 204, 206, 207, 208, 226]);

// Previously in Zod 3 ❌
const httpCodes = z.union([
  z.literal(200),
  z.literal(201),
  // ... many more
]);
```

### 8. Enhanced Enums
```ts
enum Color {
  Red = "red",
  Green = "green",
  Blue = "blue",
}

// Zod 4 ✅
const ColorSchema = z.enum(Color);

// Access values
ColorSchema.enum.Red; // ✅ => "red"
```

### 9. Pretty Error Formatting
```ts
const myError = new z.ZodError([...]);
z.prettifyError(myError);
// => ✖ Unrecognized key: "extraField"
//    ✖ Invalid input: expected string, received number
//      → at username
```

## Removed Features

### 1. Static .create() Methods
```ts
// Zod 3 ❌
z.ZodString.create();

// Use factory functions instead
z.string();
```

### 2. Refine Overload with Message Function
```ts
// Zod 3 ❌ - Removed
const longString = z.string().refine(
  (val) => val.length > 10,
  (val) => ({ message: `${val} is not more than 10 characters` })
);
```

### 3. ctx.path in .superRefine()
```ts
// Zod 3 ❌ - No longer available
z.string().superRefine((val, ctx) => {
  ctx.path; // ❌ removed
});
```
