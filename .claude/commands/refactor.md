# Refactor Code

Analyze and refactor the specified code following project conventions.

## Arguments
- `$ARGUMENTS` — file path or component/function name to refactor, plus optional goal (e.g., "src/components/Header.tsx extract nav logic into hook")

## Instructions

### Step 1: Analyze
- Read the target file(s)
- Identify code smells: long functions, deep nesting, duplicated logic, unclear names, mixed concerns

### Step 2: Plan
Present the refactoring plan BEFORE making changes:
```
## Refactoring Plan: {target}
1. {change description} — {reason}
2. {change description} — {reason}
...
```

### Step 3: Execute (after user confirms)
Apply the refactoring following these principles:
- **Preserve behavior** — refactoring must not change what the code does
- **Extract, don't rewrite** — prefer extracting functions/hooks/components over rewriting from scratch
- **One thing at a time** — each change should be independently reviewable
- Follow all CLAUDE.md conventions

### Common Refactoring Patterns
- **Long component** → Extract sub-components + custom hooks
- **Repeated fetch logic** → Extract into a custom hook
- **Complex conditional rendering** → Extract into smaller components or use early returns
- **Mixed concerns** → Separate business logic (hooks/utils) from presentation (components)
- **Prop drilling** → Consider context or composition patterns
- **Magic numbers/strings** → Extract to constants

### Step 4: Verify
- Run `npm run type-check` to confirm no type errors
- Run `npm run lint` to confirm style compliance
- Run related tests if they exist
