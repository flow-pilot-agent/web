# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FlowPilot is a Svelte 5 + TypeScript + Vite web application. This is a standalone Svelte app (not SvelteKit), optimized for simplicity and direct Vite integration.

## Commands

### Development
```bash
pnpm dev          # Start development server with HMR
pnpm build        # Build for production (outputs to dist/)
pnpm preview      # Preview production build locally
pnpm check        # Run type checking with svelte-check and tsc
```

Package manager: **pnpm** (not npm or yarn)

## Architecture

### Svelte 5 Runes

This project uses **Svelte 5** with the new runes API. Key differences from Svelte 4:

- **Reactivity**: Use `$state()` for reactive state, not `let` declarations
- **Derived values**: Use `$derived()` instead of `$:` labels
- **Effects**: Use `$effect()` instead of `$:` statements with side effects
- **Props**: Props are still passed as regular function parameters but component internals use runes

Example from Counter.svelte:
```svelte
<script lang="ts">
  let count: number = $state(0)  // Not: let count = 0
  const increment = () => {
    count += 1
  }
</script>
```

### Application Entry Point

- **HTML**: `index.html` - Entry point with `<div id="app">`
- **TS Entry**: `src/main.ts` - Uses Svelte 5's `mount()` API (not `new App()`)
- **Root Component**: `src/App.svelte` - Main application component
- **Global Styles**: `src/app.css` - Imported in main.ts

### Component Structure

- Components are in `src/lib/` directory
- Use `.svelte` extension for components
- TypeScript support via `lang="ts"` in script tags
- Scoped styles within `<style>` blocks

### Build Configuration

- **Vite**: Standard Vite config with Svelte plugin
- **TypeScript**: Extends `@tsconfig/svelte` base config
- **Preprocessing**: `vitePreprocess()` handles TypeScript, SCSS, PostCSS in components
- **Target**: ES2022, ESNext modules
- **Type Checking**: Enabled for both .ts and .js files (checkJs: true)

### Important Notes

1. **No SvelteKit**: This is a Vite app, not SvelteKit - no file-based routing or server-side features
2. **HMR State**: Not preserved by default - use external stores for persistent state during development
3. **Mount API**: Use Svelte 5's `mount()` function, not the old `new Component()` constructor
4. **IDE**: VS Code with Svelte extension recommended

## Development Workflow

### Spec-Driven + Test-Driven Development

This project strictly follows **SDD (Spec-Driven Development)** + **TDD (Test-Driven Development)**:

1. **Plan → Code → Test** (Loop)
   - Define specification/plan first
   - Implement based on specification
   - Write tests to verify implementation
   - Repeat loop until feature complete
   - Human approval for final acceptance

2. **Spec-First Approach**
   - Every feature must have clear specification first
   - Specification should be detailed enough to guide coding directly
   - Complete step-by-step per spec phase
   - **Create new branch and commit immediately after completing each feature point**

3. **Test Requirements**
   - All new features must have corresponding tests
   - Tests should cover core logic and edge cases
   - Test commands: `pnpm test` (unit tests), `pnpm test:e2e` (E2E tests)

### Breaking Changes Policy

**No backward compatibility required**:
- Feel free to make breaking changes
- No need for glue code to maintain compatibility
- Refactor directly without preserving old interfaces
- This is a new project - prioritize code quality over compatibility

### Git Workflow

**Feature branch strategy**:
```bash
# Create separate branch per feature point
git checkout -b feat/<spec-phase>-<feature-name>

# Example: Create task list feature for spec phase 1
git checkout -b feat/phase1-task-list

# Commit after completion
git add .
git commit -m "feat(task): implement task list component"
git push origin feat/phase1-task-list
```

**Commit Convention** (Conventional Commits):
- `feat`: New feature
- `fix`: Bug fix
- `refactor`: Code refactoring
- `test`: Test-related changes
- `docs`: Documentation updates

### Third-Party Libraries

**Read official documentation before use**:
- Always read official docs before using any third-party library
- Understand core concepts and best practices
- Use **context7** or similar MCP tools to fetch documentation
- Avoid blindly copying example code

**Recommended libraries**:
- UI Components: Bits UI, Melt UI (see `.claude/skills/svelte-components`)
- State Management: Svelte 5 runes (see `.claude/skills/svelte-runes`)
- Forms: TBD
- HTTP Client: TBD

## Project Documentation

**Documentation location**: `/document/` directory
- `srs-user-story.md` - Software Requirements Specification
- `system-design.md` - System Design Document
- `tech-stack-standards.md` - Technology Stack Standards

**Important**: Always reference these documents before coding to ensure implementation follows design specifications.

## Skills

This project provides two Claude Code skills:
- `svelte-components` - Svelte component patterns and third-party component library integration
- `svelte-runes` - Svelte 5 runes reactive system guide

Use `/skills` command to view available skills.
