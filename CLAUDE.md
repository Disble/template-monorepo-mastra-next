# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Install dependencies
bun install

# Development (all apps)
bun run dev

# Development (specific app)
turbo dev --filter=web   # Next.js app on port 4000
turbo dev --filter=api   # Mastra API

# Build
bun run build
turbo build --filter=web
turbo build --filter=api

# Type checking
bun run check-types

# Linting and formatting
bun run format-and-lint        # Check
bun run format-and-lint:fix    # Fix

# Database (packages/db)
bun run generate   # Generate Drizzle migrations
bun run migrate    # Run migrations
bun run push       # Push schema to database
bun run studio     # Open Drizzle Studio
```

### Database preflight (important)

- Local Docker setup in this repo typically uses: `postgresql://postgres:password@localhost:54321/electric`
- Before `bun run migrate`, verify connectivity to PostgreSQL:

```powershell
Test-NetConnection localhost -Port 54321
```

- If connectivity fails, migrations will not be applied (tables will not appear), even if migration files were generated.
- Keep credentials in local `.env` files only; never commit production secrets.

## Architecture

This is a Turborepo monorepo with:

### Apps
- **`apps/web`**: Next.js 16 with App Router, React 19, HeroUI components, Tailwind CSS v4
- **`apps/api`**: Mastra AI agents framework with workflows and tools

### Packages
- **`@repo/ui`**: Shared React components using HeroUI (re-exports from `@heroui/react`)
- **`@repo/db`**: Drizzle ORM with PostgreSQL
- **`@repo/envs`**: Environment validation with t3-env and Zod 4
- **`@repo/shared-types`**: Shared TypeScript types
- **`@repo/typescript-config`**: Shared TypeScript configurations

### Mastra API Structure (`apps/api/src/mastra/`)
- `agents/` - AI agents (weather, YouTube chapters, story analysis agents)
- `tools/` - Agent tools
- `workflows/` - Multi-step workflows
- `memory/` - Vector store and embeddings
- `mcp/` - MCP server integration

## Tech Stack Requirements

- **Runtime/Package Manager**: Bun (not Node.js, npm, or pnpm)
- **UI Components**: HeroUI (not shadcn/ui)
- **Validation**: Zod 4 (not Zod 3)
- **Styling**: Tailwind CSS v4 (CSS-first configuration)
- **React**: 19 (use `useActionState`, `useFormStatus`, refs as props)

## TypeScript Conventions

- **Imports**: Use top-level `import type { X }` (not inline `{ type X }`)
- **Exports**: Prefer named exports; use default only when framework requires it (e.g., Next.js pages)
- **Return types**: Declare for top-level functions, except React components
- **Discriminated unions**: Use for data with different shapes (prevents bag of optionals)
- **Error handling**: Use Result types (`{ ok: true; value } | { ok: false; error }`) for explicit handling

## Commit Convention

```
<type>[scope]: <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## Zod 4 Breaking Changes

```typescript
// String formats are top-level
z.email()      // not z.string().email()
z.uuid()       // not z.string().uuid()

// Object variants are top-level
z.strictObject({...})  // not z.object({}).strict()
z.looseObject({...})   // not z.object({}).passthrough()

// Record requires both key and value schemas
z.record(z.string(), z.string())  // not z.record(z.string())
```
