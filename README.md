# HUS Analyzer

**AI-powered content analysis platform** built on a production-ready monorepo architecture. Combines a Next.js 16 frontend with a Mastra AI agents backend to deliver intelligent analysis of YouTube videos, stories, and narrative content.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Bun](https://img.shields.io/badge/Bun-1.3-FBF0DF?logo=bun&logoColor=black)
![Turborepo](https://img.shields.io/badge/Turborepo-2.7-EF4444?logo=turborepo&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?logo=postgresql&logoColor=white)
![Mastra](https://img.shields.io/badge/Mastra-1.1-8B5CF6)
![Biome](https://img.shields.io/badge/Biome-2.3-60A5FA?logo=biome&logoColor=white)

---

## Features

### YouTube Analysis
- Download and parse SRT captions from any YouTube video
- Generate timestamped chapters with AI-powered summarization
- Real-time workflow monitoring with step-by-step progress

### Narrative & Story Analysis
Run a multi-agent analysis pipeline that evaluates content across six dimensions simultaneously:

| Agent | What it analyzes |
|-------|-----------------|
| **Opening Hook Analyzer** | Emotional anchoring, implicit questions, investment rhythm |
| **Narrative Structure Analyzer** | Story arc, pacing, structural coherence |
| **Continuity Error Detector** | Plot holes, timeline inconsistencies, contradictions |
| **Emotional Resonance Analyzer** | Reader engagement, emotional impact, empathy triggers |
| **Character Depth Analyzer** | Tridimensionality scoring, transformation arcs, psychological layers |
| **Prose Discipline Analyzer** | Writing quality, voice consistency, stylistic patterns |

### Platform
- Google OAuth authentication via Better Auth
- Dashboard with real-time workflow status tracking
- PostgreSQL with vector embeddings for semantic memory

---

## Architecture

```
hus-analyzer/
├── apps/
│   ├── web/                    # Next.js 16 — App Router, React 19, HeroUI
│   └── api/                    # Mastra AI — Agents, workflows, tools
├── packages/
│   ├── db/                     # Drizzle ORM — PostgreSQL + pgvector
│   ├── ui/                     # Shared components — HeroUI re-exports
│   ├── envs/                   # Environment validation — t3-env + Zod 4
│   ├── shared-types/           # Shared Zod schemas and TypeScript types
│   └── typescript-config/      # Shared tsconfig presets
├── turbo.json
├── biome.json
└── package.json
```

### How it works

```
┌─────────────┐     HTTP      ┌─────────────────────┐     SQL      ┌────────────┐
│   Next.js   │ ───────────── │   Mastra AI API     │ ──────────── │ PostgreSQL │
│   Web App   │  Mastra Client│                     │  Drizzle ORM │  + pgvector│
│  (port 4000)│               │  Agents / Workflows │              │            │
└─────────────┘               └─────────────────────┘              └────────────┘
       │                              │                                    │
       │                              │                                    │
  Better Auth                  Google Gemini                         Vector Store
  Google OAuth                Ollama (local)                    Semantic Memory
```

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Runtime** | Bun | 1.3.6 |
| **Monorepo** | Turborepo | 2.7 |
| **Frontend** | Next.js (App Router) | 16 |
| **UI Library** | React | 19 |
| **Components** | HeroUI | 3.0 beta |
| **Styling** | Tailwind CSS v4 | 4.1 |
| **AI Framework** | Mastra | 1.1 |
| **AI Models** | Google Gemini 2.5 / 3 Flash | - |
| **Local Models** | Ollama | - |
| **Database** | PostgreSQL + pgvector | - |
| **ORM** | Drizzle | 0.44 |
| **Auth** | Better Auth | 1.4 |
| **Validation** | Zod 4 | 4.1 |
| **Forms** | React Hook Form | 7.71 |
| **URL State** | nuqs | 2.8 |
| **Code Quality** | Biome | 2.3 |
| **Language** | TypeScript | 5.9 |

---

## Prerequisites

- **Bun** >= 1.3.6 &mdash; [Install Bun](https://bun.sh)
- **Node.js** >= 18
- **PostgreSQL** with the `pgvector` extension
- **Google Cloud** project with OAuth credentials
- **Google Gemini API** key
- *(Optional)* **Ollama** for local model inference

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/your-username/hus-analyzer.git
cd hus-analyzer
bun install
```

### 2. Set up the database

Create a PostgreSQL database and enable the vector extension:

```sql
CREATE DATABASE hus_analyzer;
\c hus_analyzer
CREATE EXTENSION IF NOT EXISTS vector;
```

If you use the local Electric + Postgres Docker stack, this project expects PostgreSQL on port `54321` and database `electric`.

### 3. Configure environment variables

**`apps/api/.env`**

```env
DATABASE_URL=postgresql://postgres:password@localhost:54321/electric
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-api-key
```

**`apps/web/.env`**

```env
DATABASE_URL=postgresql://postgres:password@localhost:54321/electric
BETTER_AUTH_URL=http://localhost:4000
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_MASTRA_BASE_URL=http://localhost:4111
```

**`packages/db/.env`**

```env
DATABASE_URL=postgresql://postgres:password@localhost:54321/electric
```

Security note: values above are local development examples. Do not commit production credentials. Prefer secret managers or local untracked env files.

### 4. Push the database schema

```bash
cd packages/db
bun run push
```

For migration-based workflows (recommended), run:

```bash
cd packages/db
bun run migrate
```

Preflight check before migrating:

```bash
# PowerShell
Test-NetConnection localhost -Port 54321
```

If this fails, PostgreSQL is not reachable and new tables will not be created.

### 5. Start development

```bash
# Run all apps
bun run dev

# Or run individually
turbo dev --filter=web   # Next.js on port 4000
turbo dev --filter=api   # Mastra API
```

---

## Development

### Commands

| Command | Description |
|---------|------------|
| `bun run dev` | Start all apps in development mode |
| `bun run build` | Build all apps and packages |
| `bun run check-types` | Run TypeScript type checking across the monorepo |
| `bun run format-and-lint` | Check code style with Biome |
| `bun run format-and-lint:fix` | Auto-fix code style issues |
| `bun run syncpackages` | Sync dependency versions with Sherif |

### Database Commands

Run from `packages/db`:

| Command | Description |
|---------|------------|
| `bun run generate` | Generate Drizzle migrations |
| `bun run migrate` | Run pending migrations |
| `bun run push` | Push schema directly to the database |
| `bun run studio` | Open Drizzle Studio (visual DB browser) |

### Filtering by App

Turborepo lets you target specific apps:

```bash
turbo build --filter=web
turbo build --filter=api
turbo dev --filter=web
```

---

## AI Agents & Workflows

### Model Configuration

The API uses a tiered model strategy:

| Tier | Model | Use Case |
|------|-------|----------|
| **Light** | Ollama (local, 20B) | Fast local inference |
| **High** | Gemini 2.5 Flash Lite | Balanced speed/quality |
| **Heavy** | Gemini 3 Flash Preview | Complex analysis tasks |

### Workflows

**YouTube Chapters Workflow**
1. Downloads captions from a YouTube video URL
2. Parses SRT format into structured text
3. Generates timestamped chapters using AI

**Wattpad Analysis Workflow**
1. Extracts chapter content via browser automation
2. Runs six analysis agents in parallel
3. Consolidates results into a unified report

### Semantic Memory

Agents have access to a vector-based semantic memory system:
- **Embeddings**: Ollama Qwen3 (768 dimensions)
- **Storage**: PostgreSQL with pgvector
- **Recall**: Top-3 semantic search with message range context

---

## Project Conventions

### Commit Messages

```
<type>[scope]: <description>
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Enforced via Commitlint + Lefthook git hooks.

### TypeScript

- Top-level `import type` for type-only imports
- Named exports by default
- Return types declared for top-level functions
- Result types (`{ ok: true; value } | { ok: false; error }`) for error handling
- Discriminated unions over bags of optionals

### Code Quality

- **Biome** for linting and formatting (replaces ESLint + Prettier)
- **Sherif** for dependency version synchronization
- **ls-lint** for file naming conventions
- **Lefthook** for pre-commit hooks

---

## Links

- [Turborepo Documentation](https://turborepo.com/docs)
- [Mastra AI Documentation](https://mastra.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [HeroUI Components](https://heroui.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Better Auth](https://www.better-auth.com)
- [Bun Runtime](https://bun.sh/docs)
- [Biome](https://biomejs.dev)

---

## License

Private project. All rights reserved.
