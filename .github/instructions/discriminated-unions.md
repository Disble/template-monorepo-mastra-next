---
applyTo: "**/*.ts,**/*.tsx"
---

# Discriminated Unions

Use discriminated unions to model data with different shapes and prevent impossible states.

Proactively use discriminated unions to model data that can be in one of a few different shapes.

## Example for events:
```ts
type UserCreatedEvent = {
  type: "user.created";
  data: { id: string; email: string };
};

type UserDeletedEvent = {
  type: "user.deleted";
  data: { id: string };
};

type Event = UserCreatedEvent | UserDeletedEvent;
```

## Use switch statements to handle discriminated unions:
```ts
const handleEvent = (event: Event) => {
  switch (event.type) {
    case "user.created":
      console.log(event.data.email);
      break;
    case "user.deleted":
      console.log(event.data.id);
      break;
  }
};
```

## Prevent the 'bag of optionals' problem:

### Bad - allows impossible states:
```ts
type FetchingState<TData> = {
  status: "idle" | "loading" | "success" | "error";
  data?: TData;
  error?: Error;
};
```

### Good - prevents impossible states:
```ts
type FetchingState<TData> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: TData }
  | { status: "error"; error: Error };
```