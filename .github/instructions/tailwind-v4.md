---
applyTo: "src/app/globals.css,src/**/*.css,postcss.config.mjs"
---

# Tailwind CSS v4

Configure Tailwind via CSS-first approach and follow v4 conventions.

## Guidelines:
- Configure Tailwind via CSS-first approach in src/app/globals.css
- Use OKLCH color variables in `:root` and `.dark`, then map them with `@theme inline` to Tailwind tokens
- Prefer `size-*` utilities for square sizing instead of `w-*` plus `h-*` combos where appropriate
- Manage base styles via `@layer base`; ensure default border color is set explicitly if needed
- For animations previously using `tailwindcss-animate`, migrate to a Tailwind v4-compatible library and import globally

## Troubleshooting:
- Ensure variable names in `:root`/`.dark` match those used in `@theme inline` mappings
- Check PostCSS and Tailwind versions if compilation issues arise