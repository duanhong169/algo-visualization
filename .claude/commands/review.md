# Code Review

Perform a thorough code review of the current changes or specified file.

## Arguments
- `$ARGUMENTS` — file path or "staged" for staged changes, or empty for all uncommitted changes

## Instructions

Review the code against these criteria and provide a structured report:

### 1. Correctness
- Logic errors, off-by-one, null/undefined handling
- Race conditions in async code
- Missing error handling

### 2. TypeScript
- Any use of `any` — suggest `unknown` + narrowing
- Missing or overly broad types
- Proper use of generics

### 3. React Patterns
- Missing dependency array items in hooks
- State that should be derived instead of stored
- Components that should be split
- Missing cleanup in useEffect
- Missing key props in lists

### 4. Tailwind / Styling
- Inline styles that should be Tailwind classes
- Hardcoded colors/spacing instead of design tokens
- Missing responsive breakpoints
- Missing dark mode support

### 5. Convention Compliance (per CLAUDE.md)
- Naming conventions
- Import ordering
- File structure
- Export style (named, not default)

### 6. Performance
- Unnecessary re-renders (missing memo/useMemo/useCallback where it matters)
- Large bundle imports that could be tree-shaken

### Output Format

```
## 🔍 Code Review: {file/scope}

### ✅ Looks Good
- ...

### ⚠️ Suggestions
- ...

### 🚨 Issues
- ...

### Summary
{1-2 sentence overall assessment}
```
