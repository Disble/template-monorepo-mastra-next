---
applyTo: "**/*.ts,**/*.tsx"
---

# Named Exports Over Default Exports

Prefer named exports over default exports except when required by frameworks.

Unless explicitly required by the framework, do not use default exports.

## Bad:
```ts
export default function myFunction() {
  return <div>Hello</div>;
}
```

## Good:
```ts
export function myFunction() {
  return <div>Hello</div>;
}
```

Default exports create confusion from the importing file.

## Bad import:
```ts
import myFunction from "./myFunction";
```

## Good import:
```ts
import { myFunction } from "./myFunction";
```

## Exception:
There are certain situations where a framework may require a default export. For instance, Next.js requires a default export for pages.

```tsx
// This is fine, if required by the framework
export default function MyPage() {
  return <div>Hello</div>;
}
```