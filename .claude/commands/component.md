# Generate React Component

Create a new React component with the project's standard structure.

## Arguments
- `$ARGUMENTS` — component name and optional description (e.g., "UserCard a card displaying user info")

## Instructions

1. Parse the first word of `$ARGUMENTS` as the component name (PascalCase). The rest is the description.
2. Create the following files:

### `src/components/{Name}/{Name}.tsx`
```tsx
import { cn } from '@/lib/utils';

export interface {Name}Props {
  className?: string;
  // TODO: add props
}

export function {Name}({ className }: {Name}Props) {
  return (
    <div className={cn('', className)}>
      {/* TODO: implement */}
    </div>
  );
}
```

### `src/components/{Name}/{Name}.test.tsx`
```tsx
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { {Name} } from './{Name}';

describe('{Name}', () => {
  it('renders without crashing', () => {
    render(<{Name} />);
    // TODO: add meaningful assertions
  });
});
```

### `src/components/{Name}/index.ts`
```ts
export { {Name} } from './{Name}';
export type { {Name}Props } from './{Name}';
```

3. If a description was provided, flesh out the props and JSX based on it.
4. Follow all conventions from CLAUDE.md (named exports, cn() for classes, etc.).
