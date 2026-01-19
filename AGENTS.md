# AGENTS.md

This file provides AI coding agents with technical context and development guidelines for the FlowPilot web application.

## Project Overview

**FlowPilot** is an LLM-powered personal time management agent that helps users decide what to do next, intervenes when procrastination is detected, and provides daily reviews with actionable suggestions.

**Frontend Stack**:

- **Framework**: Svelte 5 (with Runes API)
- **Language**: TypeScript 5.3+
- **Build Tool**: Vite 5.x
- **Package Manager**: pnpm
- **UI Components**: Bits UI, Melt UI (headless components)
- **Styling**: Tailwind CSS 3.4+

**Key Characteristics**:

- Standalone Vite app (NOT SvelteKit)
- Spec-Driven Development (SDD) + Test-Driven Development (TDD)
- No backward compatibility requirements
- Git-based feature tracking

## Commands

### Development

```bash
pnpm dev              # Start dev server with HMR at localhost:5173
pnpm build            # Production build to dist/
pnpm preview          # Preview production build
pnpm check            # TypeScript type checking
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting without changes
```

### Testing

```bash
pnpm test             # Run unit tests with Vitest
pnpm test:ui          # Open Vitest UI
pnpm test:coverage    # Generate coverage report
pnpm test:e2e         # Run E2E tests (Playwright)
```

### Type Checking

```bash
pnpm check            # svelte-check + tsc
pnpm check:watch      # Watch mode for type checking
```

## Development Workflow

### Mandatory Flow: Plan → Code → Test → Review

1. **Plan Phase**
   - Read specification from `./specs/` directory
   - Break down spec into steps/phases
   - Create feature branch: `feat/<phase>-<feature-name>`

2. **Code Phase**
   - Implement ONE feature point at a time
   - Follow Svelte 5 runes patterns (see `.claude/skills/svelte-runes`)
   - Use TypeScript strictly
   - NO backward compatibility needed

3. **Test Phase**
   - Write unit tests for logic (Vitest)
   - Add component tests if UI-heavy
   - Ensure tests pass before commit
   - Target coverage: ≥60% for components, ≥80% for utils

4. **Review & Commit**
   - Self-review against specification
   - Commit with Conventional Commits format
   - Push feature branch
   - Human approval required for merge

### Third-Party Libraries

**REQUIRED**: Read official documentation BEFORE using any library.

**How to use docs**:

- Use `context7` MCP tool to fetch documentation
- Understand core concepts, not just copy examples
- Verify compatibility with Svelte 5

**Pre-approved libraries**:

- **UI**: Bits UI, Melt UI (see `svelte-components` skill)
- **Forms**: TBD
- **HTTP**: TBD
- **Date**: date-fns (recommended)

## Code Style

### TypeScript

**Strict Mode Enabled**:

```json
{
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true
}
```

**Rules**:

- Use explicit types for function parameters and return values
- Prefer `interface` for object shapes
- Use `type` for unions, intersections, primitives
- No `any` unless absolutely necessary (use `unknown` instead)

### Svelte 5 Runes

**Reactivity**:

```svelte
<script lang="ts">
  // ✅ Correct
  let count = $state(0)
  const doubled = $derived(count * 2)

  $effect(() => {
    console.log(count)
  })

  // ❌ Wrong (Svelte 4 syntax)
  let count = 0 // Not reactive in Svelte 5!
  $: doubled = count * 2 // Use $derived instead
</script>
```

**Component Props**:

```svelte
<script lang="ts">
  interface Props {
    title: string
    count?: number
  }

  let { title, count = 0 }: Props = $props()
</script>
```

### Naming Conventions

- **Components**: `PascalCase.svelte` (e.g., `TaskCard.svelte`)
- **Files**: `kebab-case.ts` (e.g., `task-service.ts`)
- **Variables/Functions**: `camelCase`
- **Constants**: `SCREAMING_SNAKE_CASE`
- **Types/Interfaces**: `PascalCase`

### File Organization

```
src/
├── lib/
│   ├── components/      # Reusable components
│   │   ├── ui/         # Base UI components
│   │   └── task/       # Domain-specific components
│   ├── stores/         # Svelte stores (if needed)
│   ├── types/          # TypeScript types
│   ├── utils/          # Utility functions
│   └── api/            # API client
├── App.svelte          # Root component
└── main.ts             # Entry point
```

## Testing Guidelines

### Unit Tests (Vitest)

**Test file naming**: `*.test.ts` or `*.spec.ts`

**Example**:

```typescript
import { describe, it, expect } from 'vitest'
import { formatDate } from './date'

describe('formatDate', () => {
  it('formats date to Chinese locale', () => {
    const date = new Date('2026-01-15')
    expect(formatDate(date)).toBe('2026年1月15日')
  })

  it('handles null/undefined', () => {
    expect(formatDate(null)).toBe('')
  })
})
```

### Component Tests

```typescript
import { render, fireEvent } from '@testing-library/svelte'
import TaskCard from './TaskCard.svelte'

it('triggers start event on button click', async () => {
  const { getByText, component } = render(TaskCard, {
    props: { task: mockTask },
  })

  const handler = vi.fn()
  component.$on('start', handler)

  await fireEvent.click(getByText('开始'))
  expect(handler).toHaveBeenCalled()
})
```

### E2E Tests (Playwright)

- Test critical user flows only
- Keep E2E tests minimal (slow and brittle)
- Focus on happy path + major error cases

## Git & Commit Guidelines

### Branch Naming

```
<type>/<spec-phase>-<short-description>

Examples:
feat/phase1-task-list
feat/phase2-agent-recommendation
fix/task-timer-overflow
refactor/state-management
test/task-service-coverage
```

### Commit Messages (Conventional Commits)

```
<type>(<scope>): <subject>

<optional body>

<optional footer>
```

**Types**:

- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Adding tests
- `docs`: Documentation changes
- `style`: Code formatting
- `perf`: Performance improvements
- `chore`: Build/tooling changes

**Examples**:

```bash
feat(task): implement task list component

Add TaskList component with filtering and sorting.
- Support status filter (pending/completed)
- Sort by priority and due date
- Add unit tests for sorting logic

Closes #123

---

fix(timer): prevent overflow when duration exceeds max int

Use BigInt for duration calculation to prevent overflow.

Fixes #456
```

### Commit Frequency

**Per Feature Point**:

- Complete ONE spec step/phase
- Write tests
- Commit immediately
- Push to feature branch

**Do NOT**:

- Batch multiple features in one commit
- Commit without tests
- Push to main directly (use feature branches)

## Pull Request Guidelines

### Before Creating PR

- [ ] All tests pass (`pnpm test`)
- [ ] Type checking passes (`pnpm check`)
- [ ] Linting passes (`pnpm lint`)
- [ ] Code formatted (`pnpm format`)
- [ ] Commit messages follow convention
- [ ] Feature implemented per specification
- [ ] No `console.log` or debugging code

### PR Template

```markdown
## 📝 Description

Brief description of what this PR does.

## 🎯 Related Spec

Which phase/step from the specification does this implement?

- Reference: `../document/srs-user-story.md` Section X.Y

## ✅ Checklist

- [ ] Spec-compliant implementation
- [ ] Unit tests added
- [ ] Type checking passes
- [ ] No breaking changes (or documented if necessary)

## 🧪 Testing

How to test this feature manually.
```

## Breaking Changes

**Breaking changes are ALLOWED and ENCOURAGED**:

- This is a greenfield project
- Prioritize code quality over backward compatibility
- Refactor freely without glue code
- Document breaking changes in commit messages with `!` suffix:

  ```
  feat(api)!: change task status enum format

  BREAKING CHANGE: Status values changed from snake_case to kebab-case.
  ```

## API Integration

### Backend Communication

**Base URL**: Configure via environment variable

```typescript
// .env
PUBLIC_API_BASE_URL=http://localhost:8080/api/v1
```

**HTTP Client**: TBD (awaiting library selection)

**Error Handling**:

- Handle 401 (redirect to login)
- Handle 403 (show permission error)
- Handle 500 (show generic error)
- Show user-friendly error messages

## Performance Considerations

- Use `$derived` for computed values (auto-memoized)
- Avoid unnecessary `$effect` calls
- Lazy load heavy components
- Use virtual scrolling for long lists (if needed)

## Security Notes

- **Never commit**: API keys, secrets, tokens
- **Sanitize user input**: Especially in forms
- **Use HTTPS**: For production API calls
- **XSS prevention**: Svelte auto-escapes by default (avoid `{@html}` unless necessary)

## Documentation References

**Project Specs**: `../document/`

- `srs-user-story.md` - Requirements and user stories
- `system-design.md` - Architecture and design
- `tech-stack-standards.md` - Technology standards

**Skills**: `.claude/skills/`

- `svelte-components` - Component patterns and libraries
- `svelte-runes` - Reactivity and state management

## Common Pitfalls

### Svelte 5 Migration Gotchas

```svelte
<!-- ❌ Svelte 4 syntax (will break) -->
<div on:click={handler}>

<!-- ✅ Svelte 5 syntax -->
<div onclick={handler}>

<!-- ❌ Old slot syntax -->
<slot />

<!-- ✅ New snippet syntax (for layout components) -->
{@render children?.()}
```

### TypeScript

```typescript
// ❌ Implicit any
function process(data) { ... }

// ✅ Explicit types
function process(data: TaskData): ProcessedTask { ... }

// ❌ Using any
const result: any = await fetch(...)

// ✅ Using unknown + type guard
const result: unknown = await fetch(...)
if (isTaskData(result)) { ... }
```

## Getting Help

1. **Check Documentation First**:
   - Project specs in `./specs/`
   - Skills in `.claude/skills/`
   - This file (AGENTS.md)

2. **Use MCP Tools**:
   - `context7` for library documentation
   - Read official docs before asking

3. **Ask Specific Questions**:
   - Include error messages
   - Show what you've tried
   - Reference relevant spec sections

---

**Last Updated**: 2026-01-17
**Maintained By**: Project team + Claude Code
