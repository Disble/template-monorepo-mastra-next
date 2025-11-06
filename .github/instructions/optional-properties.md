---
applyTo: "**/*.ts,**/*.tsx"
---

# Avoid Optional Properties

Use undefined union types instead of optional properties to avoid hidden bugs.

Use optional properties extremely sparingly. Only use them when the property is truly optional, and consider whether bugs may be caused by a failure to pass the property.

In the example below we always want to pass user ID to `AuthOptions`. This is because if we forget to pass it somewhere in the code base, it will cause our function to be not authenticated.

## Bad:
```ts
type AuthOptions = {
  userId?: string;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```

## Good:
```ts
type AuthOptions = {
  userId: string | undefined;
};

const func = (options: AuthOptions) => {
  const userId = options.userId;
};
```