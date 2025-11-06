---
applyTo: "*.tsx,*.ts,*.jsx,*.js"
---

# Use HeroUI Instead of shadcn

This project mandates the exclusive use of **HeroUI** components instead of shadcn/ui.

## Requirements:

### 1. Component Selection
- **ALWAYS** prefer HeroUI components over shadcn/ui equivalents
- **NEVER** install or use shadcn/ui packages
- Use the official HeroUI library: `/heroui-inc/heroui`

### 2. Documentation Consultation (MANDATORY)
**BEFORE implementing any HeroUI component**, you **MUST**:

1. **Resolve Library ID**: Use `mcp_context7_resolve-library-id` with "heroui" to get the latest library reference
2. **Fetch Documentation**: Use `mcp_context7_get-library-docs` with the resolved library ID (`/heroui-inc/heroui`) to get current documentation
3. **Check Specific Topics**: When implementing specific components, query the documentation for:
   - Component API and props
   - Accessibility features
   - Theming and customization
   - Integration patterns

### 3. Component Mapping:
```
Button      -> @heroui/react Button
Input       -> @heroui/react Input
Card        -> @heroui/react Card
Modal       -> @heroui/react Modal
Table       -> @heroui/react Table
Form        -> @heroui/react Form components
Dropdown    -> @heroui/react Dropdown
Tabs        -> @heroui/react Tabs
Toast       -> @heroui/react Toast/Snackbar
Avatar      -> @heroui/react Avatar
Badge       -> @heroui/react Badge
Progress    -> @heroui/react Progress
Spinner     -> @heroui/react Spinner
```

### 4. Installation:
```bash
bun add @heroui/react
```

### 5. Documentation Access Requirement
**CRITICAL**: If you cannot access the `mcp_context7_get-library-docs` tool or HeroUI documentation, you **MUST**:

1. Inform the user that HeroUI documentation access is required
2. Request user assistance to enable mcp_context7 access
3. **DO NOT** proceed with HeroUI implementation without current documentation
4. Suggest alternative approaches only after documentation access is confirmed unavailable

### 6. Code Quality Standards:
- Always use TypeScript with HeroUI components
- Implement proper accessibility features provided by HeroUI
- Follow HeroUI's theming system for consistent styling
- Use HeroUI's built-in responsive design utilities
- Handle loading and error states using HeroUI components

### 7. Migration from shadcn/ui:
When migrating existing shadcn/ui components:
1. Consult HeroUI documentation for equivalent components
2. Update imports to use `@heroui/react`
3. Adjust prop names and structures according to HeroUI API
4. Update styling to use HeroUI's theming system
5. Test accessibility compliance