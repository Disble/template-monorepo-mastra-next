---
applyTo: "**"
---

# Conventional Commits

Always use conventional commits format for all Git commits.

Use the format: `<type>[scope]: <description>`

## Types to use:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes
- `refactor`: Code restructuring
- `test`: Adding/fixing tests
- `chore`: Maintenance tasks

## Examples:
```
feat: add user login
fix: resolve login bug
docs: update README
refactor(auth): simplify validation
feat!: breaking API change

BREAKING CHANGE: remove old endpoint
```

Use present tense, imperative mood for descriptions. Keep description under 50 characters. Add body and footer for breaking changes.