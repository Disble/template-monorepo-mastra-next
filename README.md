````markdown
# HUS Analyzer

Monorepo basado en Turborepo que incluye una API con agentes de Mastra y una aplicación web Next.js.

## Requisitos

- Node.js >= 18
- Bun 1.3.1 (gestor de paquetes)

## Instalación

```sh
bun install
```

## Estructura del Proyecto

Este monorepo incluye las siguientes aplicaciones y paquetes:

### Apps

- `api`: API con agentes de IA usando [Mastra](https://mastra.com)
  - Weather Agent: Agente para consultar información meteorológica
  - Herramientas personalizadas para los agentes
- `web`: Aplicación [Next.js](https://nextjs.org/) con App Router

### Packages

- `@repo/ui`: Biblioteca de componentes React compartidos (Button, Card, Code)
- `@repo/typescript-config`: Configuraciones de TypeScript compartidas

Cada paquete/app está 100% escrito en [TypeScript](https://www.typescriptlang.org/).

## Herramientas de Desarrollo

El proyecto incluye las siguientes herramientas configuradas:

- [TypeScript](https://www.typescriptlang.org/) para tipado estático
- [Biome](https://biomejs.dev/) para linting y formateo de código
- [Commitlint](https://commitlint.js.org/) para mensajes de commit convencionales
- [Lefthook](https://github.com/evilmartians/lefthook) para git hooks
- [Sherif](https://github.com/QuiiBz/sherif) para sincronización de dependencias
- [ls-lint](https://ls-lint.org/) para validación de nombres de archivos

## Comandos Disponibles

### Desarrollo

Para ejecutar todas las apps en modo desarrollo:

```sh
bun run dev
```

Para ejecutar una app específica:

```sh
turbo dev --filter=web   # Solo la app web
turbo dev --filter=api   # Solo la API
```

### Build

Para construir todas las apps:

```sh
bun run build
```

Para construir una app específica:

```sh
turbo build --filter=web
turbo build --filter=api
```

### Verificación de Tipos

```sh
bun run check-types
```

### Formateo y Linting

```sh
bun run format-and-lint        # Verificar
bun run format-and-lint:fix    # Corregir automáticamente
```

### Sincronización de Dependencias

```sh
bun run syncpackages
```

### Configurar Git Hooks

```sh
bun run lefthook-sync
```

## Mastra AI Agents

El proyecto incluye agentes de IA construidos con Mastra en la aplicación `api`:

### Weather Agent

Agente especializado en proporcionar información meteorológica precisa. El agente:
- Solicita ubicación si no se proporciona
- Traduce nombres de ubicaciones al inglés si es necesario
- Proporciona detalles como humedad, viento y precipitación
- Usa Google Gemini 2.5 Pro como modelo de lenguaje

## Caché Remoto (Remote Caching)

Turborepo puede usar [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching) para compartir artefactos de caché entre máquinas, lo que te permite compartir cachés de construcción con tu equipo y pipelines de CI/CD.

Para habilitar Remote Caching con Vercel:

```sh
turbo login
turbo link
```

## Enlaces Útiles

Aprende más sobre Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)

Documentación de Mastra:
- [Mastra Documentation](https://mastra.com/docs)
- [Agents](https://mastra.com/docs/agents)
- [Tools](https://mastra.com/docs/tools)

````

## Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turborepo.com/docs/crafting-your-repository/running-tasks)
- [Caching](https://turborepo.com/docs/crafting-your-repository/caching)
- [Remote Caching](https://turborepo.com/docs/core-concepts/remote-caching)
- [Filtering](https://turborepo.com/docs/crafting-your-repository/running-tasks#using-filters)
- [Configuration Options](https://turborepo.com/docs/reference/configuration)
- [CLI Usage](https://turborepo.com/docs/reference/command-line-reference)
