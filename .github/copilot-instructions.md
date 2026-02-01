# Project Architecture and Development Guidelines

This is a Next.js 16 application using the App Router with Tailwind CSS v4 and HeroUI components.

---

## 📚 Instructions & Skills Reference

> **Important for LLMs/Agents:** This project contains detailed instructions and skills in specific locations. **Always read the relevant files before making changes.**

### 📋 Coding Instructions

Located in `.github/instructions/`. Read these files before writing or modifying code:

| File | Description |
|------|-------------|
| `conventional-commits.md` | Commit message format and conventions |
| `default-exports.md` | Rules for default vs named exports |
| `discriminated-unions.md` | TypeScript discriminated union patterns |
| `import-type.md` | Type-only import conventions |
| `interface-extends.md` | Interface extension patterns |
| `optional-properties.md` | Optional property usage guidelines |
| `react19.md` | React 19 specific patterns and features |
| `return-types.md` | Function return type annotations |
| `tailwind-v4.md` | Tailwind CSS v4 usage and migration |
| `throwing.md` | Error handling and throwing patterns |
| `use-bun-instead-of-node-vite-npm-pnpm.md` | Use Bun as the runtime and package manager |
| `use-heroui-instead-shadcn.md` | Use HeroUI components instead of shadcn/ui |
| `use-zod4-instead-zod3.md` | Use Zod v4 for schema validation |

### 🎯 Skills

Located in `.github/skills/`. These contain domain-specific knowledge:

| Skill | Location | Description |
|-------|----------|-------------|
| **vercel-react-best-practices** | `skills/vercel-react-best-practices/` | React and Next.js performance optimization from Vercel Engineering. **Read `SKILL.md` for quick reference and `AGENTS.md` for full documentation with 57 rules across 8 categories.** |
| **web-design-guidelines** | `skills/web-design-guidelines/` | Web Interface Guidelines for UI code reviews and accessibility audits. |

---

## Code Quality Principles

- **DRY (Don't Repeat Yourself)**: Eliminate code duplication through reusable components and custom hooks
- **SOLID Principles**: Apply object-oriented design principles for maintainable architecture
- **KISS (Keep It Simple, Stupid)**: Favor simple solutions over complex ones
- **YAGNI (You Aren't Gonna Need It)**: Avoid adding functionality until it is necessary
- **Modern Standards**: Use current ECMAScript features, TypeScript strict mode, and React best practices
- **TypeScript Paths**: Use configured path aliases (@Components, @Hooks, @Utils, etc.)

---

## Tech Stack Summary

- **Runtime & Package Manager:** Bun
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4
- **UI Components:** HeroUI (not shadcn/ui)
- **Validation:** Zod v4
- **Language:** TypeScript (strict mode)
