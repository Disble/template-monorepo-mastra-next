---
applyTo: "src/**/*.tsx,src/**/*.ts"
---

# React 19 Conventions

Follow React 19 usage guidance and conventions.

## Guidelines:
- Prefer new form and action primitives where applicable: `useActionState`, `useFormStatus`
- Use `use()` inside `<Suspense>` for Promise handling in server components where appropriate
- Ref handling: refs can be passed as props; only use `forwardRef` when required by external APIs
- Migrate Shadcn components to ref-as-prop where compatible; keep types correct with `React.ComponentProps<typeof X>`
- Keep types up-to-date with latest `@types/react`. Ensure `tsconfig.json` is compatible with React 19 settings

## Troubleshooting:
- For ref-related issues, audit components still using legacy `forwardRef` unnecessarily
- Verify JSX settings and ensure no conflicting React versions