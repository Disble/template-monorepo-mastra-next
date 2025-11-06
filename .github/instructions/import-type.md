---
applyTo: "**/*.ts,**/*.tsx"
---

# Import Type Usage

Use top-level 'import type' when importing TypeScript types.

Use import type whenever you are importing a type.

Prefer top-level `import type` over inline `import { type ... }`.

## Bad:
```ts
import { type User } from "./user";
```

## Good:
```ts
import type { User } from "./user";
```

The reason for this is that in certain environments, the first version's import will not be erased. So you'll be left with:

```ts
// Before transpilation
import { type User } from "./user";

// After transpilation
import "./user";
```