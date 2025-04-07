# Task Q&A

**Q1: Could you please provide the key points or a summary of the best practices for using Zustand mentioned in the article `https://tkdodo.eu/blog/working-with-zustand` that you'd like included in the documentation?**

A1: @https://tkdodo.eu/blog/working-with-zustand (Note: Roo cannot access external URLs)

**Q2: Where in the `docs/clean-code` structure should this new Zustand section be added? Should it be a new file (e.g., `13-zustand.md`), or should it be part of an existing file like 'Project Standards' or 'Objects and Data Structures'?**

A2: Create a new file: `docs/clean-code/13-zustand.md`

**Q3: What specific aspects of Zustand usage, in the context of clean code principles, should this new section cover? For example, should we discuss store structure, selector optimization, defining actions, using middleware effectively, or testing strategies?**

A3: (User provided the full content for the section, covering overview, core principles like custom hooks and selectors, advanced patterns, and common mistakes.)

```markdown
# Zustand Best Practices

## Overview

Zustand is a lightweight state management library for React that provides a simple API to create global state stores with a focus on minimal boilerplate. At just 1.1KB (minified + gzipped), it offers Redux-like patterns without the complexity, allowing flexible implementation with optional features like immer integration and middlewares.

## Core Principles

### Use Custom Hooks

Always wrap your Zustand stores in custom hooks to provide cleaner interfaces and prevent accidental subscription to the entire store. This approach avoids unnecessary re-renders when only a specific piece of state changes.

\`\`\`typescript
// ❌ Avoid direct store usage
const bears = useBearStore(state => state.bears);

// ✅ Use custom hooks
export const useBearsCount = () => useBearStore(state => state.bears);
const bears = useBearsCount();
\`\`\`

### Always Use Selectors

Selectors are essential for optimizing performance. They ensure components only re-render when relevant state changes. Always use selectors even with simple stores to maintain consistency and prepare for future state additions.

\`\`\`typescript
// ❌ Avoid subscribing to entire store
const { bears } = useBearStore();

// ✅ Use selectors for specific state
const bears = useBearStore(state => state.bears);
\`\`\`

### Return Stable References from Selectors

Ensure selectors return stable values to prevent unnecessary re-renders. When returning objects or arrays, use shallow comparison instead of the default strict equality check.

\`\`\`typescript
// ❌ Creates new reference on each render
const lionStats = useLionStore(state => ({
count: state.lions,
hungry: state.hungry
}));

// ✅ Use shallow comparison for object/array selectors
const lionStats = useLionStore(
state => ({
count: state.lions,
hungry: state.hungry
}),
shallow
);
\`\`\`

### Keep Business Logic in the Store

Follow the approach of keeping business logic inside the store rather than in components. Define actions that encapsulate state changes, allowing components to simply call these actions.

\`\`\`typescript
// ✅ Define actions in the store
const useBearStore = create((set) => ({
bears: 0,
increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
removeAllBears: () => set({ bears: 0 })
}));
\`\`\`

### Create Multiple Small Stores

Unlike Redux's single store approach, Zustand encourages creating multiple, small stores focused on specific functionality. These can be combined using custom hooks when needed.

## Advanced Patterns

### Context Integration

When component-scoped state is needed, consider combining Zustand with React Context. This approach lets you share store instances through context while maintaining Zustand's optimization benefits.

### Store Creation Within Components

For reusable components requiring isolated state, create stores within components using \`createStore\` instead of the global \`create\` function, sharing the instance via React Context.

## Common Mistakes to Avoid

1. Subscribing to the entire store instead of using selectors
2. Returning new object references from selectors without shallow comparison
3. Including functions/actions in persisted state (when using persistence middleware)
4. Placing business logic in components instead of in the store

## Conclusion

Zustand provides flexibility with minimal constraints, making clean code practices particularly important. By following these patterns, you can create maintainable, performant applications while leveraging Zustand's simplicity and power.
\`\`\`

**Q4: Should the new file `13-zustand.md` be added to the Table of Contents section in `docs/clean-code/01-introduction.md`?**

A4: Yes, add "13. [Zustand](./13-zustand.md)" to the Table of Contents in `01-introduction.md`.

**Q5: The content you provided starts with the heading `# Zustand Best Practices`. Is this the exact title you want for the new `docs/clean-code/13-zustand.md` file, or would you prefer a different main title?**

A5: Let's use "## 13. Zustand Best Practices" to match the numbering style of other files.
```
