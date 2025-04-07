## 13. Zustand Best Practices

## Overview

Zustand is a lightweight state management library for React that provides a simple API to create global state stores with a focus on minimal boilerplate. At just 1.1KB (minified + gzipped), it offers Redux-like patterns without the complexity, allowing flexible implementation with optional features like immer integration and middlewares.

## Core Principles

### Use Custom Hooks

Always wrap your Zustand stores in custom hooks to provide cleaner interfaces and prevent accidental subscription to the entire store. This approach avoids unnecessary re-renders when only a specific piece of state changes.

```typescript
// ❌ Avoid direct store usage
const bears = useBearStore((state) => state.bears);

// ✅ Use custom hooks
export const useBearsCount = () => useBearStore((state) => state.bears);
const bears = useBearsCount();
```

### Always Use Selectors

Selectors are essential for optimizing performance. They ensure components only re-render when relevant state changes. Always use selectors even with simple stores to maintain consistency and prepare for future state additions.

```typescript
// ❌ Avoid subscribing to entire store
const { bears } = useBearStore();

// ✅ Use selectors for specific state
const bears = useBearStore((state) => state.bears);
```

### Return Stable References from Selectors

Ensure selectors return stable values to prevent unnecessary re-renders. When returning objects or arrays, use shallow comparison instead of the default strict equality check.

```typescript
import { shallow } from 'zustand/shallow'; // Import shallow

// ❌ Creates new reference on each render
const lionStats = useLionStore((state) => ({
  count: state.lions,
  hungry: state.hungry,
}));

// ✅ Use shallow comparison for object/array selectors
const lionStats = useLionStore(
  (state) => ({
    count: state.lions,
    hungry: state.hungry,
  }),
  shallow, // Use the shallow comparer
);
```

### Keep Business Logic in the Store

Follow the approach of keeping business logic inside the store rather than in components. Define actions that encapsulate state changes, allowing components to simply call these actions.

```typescript
// ✅ Define actions in the store
const useBearStore = create((set) => ({
  bears: 0,
  increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
  removeAllBears: () => set({ bears: 0 }),
}));
```

### Create Multiple Small Stores

Unlike Redux's single store approach, Zustand encourages creating multiple, small stores focused on specific functionality. These can be combined using custom hooks when needed.

### Example Store: Structured Approach

This example demonstrates a structured approach to organizing a Zustand store, separating concerns into features, types, actions, hooks, and tests. This promotes maintainability and scalability, especially in larger applications.

**1. Main Store Types (`types.ts`)**

Define the overall shape of the store state and actions by combining feature-specific types. This provides a central definition for the entire store structure.

```typescript
// lib/stores/fileTree/types.ts
import {
  NodesFeature,
  NodesFeatureActions,
} from './features/nodes.feature.types';

export interface FileTreeStoreState {
  nodes: NodesFeature;
  // ... other feature states
}

export type FileTreeStoreActions = NodesFeatureActions; // & OtherFeatureActions;

export type FileTreeStore = FileTreeStoreState & FileTreeStoreActions;
```

**2. Feature-Specific Types (`features/nodes.feature.types.ts`)**

Define types related to a specific feature slice (e.g., 'nodes'). This keeps feature-related definitions colocated.

```typescript
// lib/stores/fileTree/features/nodes.feature.types.ts
export interface NodesFeature {
  isLoading: boolean;
  // ... other node-related state
}

export type NodesFeatureActions = {
  setIsLoading: (isLoading: boolean) => void;
  // ... other node-related actions
};
```

**3. Feature Implementation (`features/nodes.feature.ts`)**

Implement the state slice and actions for a specific feature. Actions are often defined as pure functions outside the `create` call for better testability and separation. The `StateCreator` pattern is used to integrate this feature into the main store.

```typescript
// lib/stores/fileTree/features/nodes.feature.ts
import { StateCreator } from 'zustand';
import { FileTreeStore } from '../types'; // Import main store type
import { NodesFeatureActions, NodesFeature } from './nodes.feature.types'; // Import feature types

// Pure action logic (optional but recommended for testing)
export function setIsLoadingAction(
  state: FileTreeStore,
  isLoading: boolean,
): FileTreeStore {
  return {
    ...state,
    nodes: {
      ...state.nodes,
      isLoading: isLoading,
    },
  };
}

// Default state for this feature slice
export const defaultNodesState: { nodes: NodesFeature } = {
  nodes: {
    isLoading: false,
  },
};

// StateCreator function to integrate actions into the main store
export const createNodesFeatureActions: StateCreator<
  FileTreeStore,
  [['zustand/devtools', never], ['zustand/persist', unknown]], // Example middleware types
  [],
  NodesFeatureActions
> = (set) => ({
  setIsLoading: (isLoading) =>
    set(
      (state) => setIsLoadingAction(state, isLoading),
      false,
      'nodes/setIsLoading',
    ), // Use pure action
  // Action type for devtools
});
```

**4. Store Creation & Hook/Action Exports (`fileTree.store.ts`)**

Create the main store instance using `create`, combining all feature slices and applying necessary middleware (like `devtools` and `persist`). Export custom hooks for selecting state slices (`NodesHooks`) and accessing actions (`NodesActions`) to be used in components.

```typescript
// lib/stores/fileTree/fileTree.store.ts
import { create } from 'zustand';
import { devtools, persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Example storage
import { FileTreeStore } from './types';
import {
  createNodesFeatureActions,
  defaultNodesState,
} from './features/nodes.feature';
// Import other feature creators and default states...

// Create the store with proper typing
const useStore = create<FileTreeStore>()(
  devtools(
    // Apply devtools middleware
    persist(
      // Apply persistence middleware
      (set, get, store) => ({
        ...defaultNodesState, // Spread default state for the feature
        // ... spread other default states
        ...createNodesFeatureActions(set, get, store), // Spread actions for the feature
        // ... spread other feature actions
      }),
      {
        name: 'fileTree-store-app-storage', // Unique name for persistence
        storage: createJSONStorage(() => AsyncStorage), // Define storage medium
      },
    ),
  ),
);

// Export custom hooks for selecting state slices
export const NodesHooks = {
  useIsLoading: () => useStore((state) => state.nodes.isLoading),
  // ... other node hooks
};

// Export hooks for accessing actions (provides stable references)
export const NodesActions = {
  useSetIsLoading: () => useStore((state) => state.setIsLoading),
  // ... other node action hooks
};
```

**5. Unit Tests (`features/nodes.feature.unit.test.ts`)**

Test the pure action logic independently. This makes testing simpler and faster as it doesn't involve the full store setup.

```typescript
// lib/stores/fileTree/features/nodes.feature.unit.test.ts
import { describe, it, expect } from 'vitest'; // Or your testing framework
import type { FileTreeStore } from '../types';
import { setIsLoadingAction, defaultNodesState } from './nodes.feature'; // Import pure action and default state

describe('Nodes Feature Actions', () => {
  // Use default state or a relevant initial state for tests
  const initialState: Partial<FileTreeStore> = {
    ...defaultNodesState,
  };

  describe('setIsLoadingAction', () => {
    it('should set isLoading to true', () => {
      const result = setIsLoadingAction(initialState as FileTreeStore, true);
      expect(result.nodes.isLoading).toBe(true);
      // Example using inline snapshot (if using Vitest/Jest)
      expect(result.nodes).toMatchInlineSnapshot(`
        {
          "isLoading": true,
        }
      `);
    });

    it('should set isLoading to false', () => {
      // Setup state where isLoading is initially true
      const loadingState: FileTreeStore = {
        ...initialState,
        nodes: { ...initialState.nodes, isLoading: true },
      } as FileTreeStore; // Cast needed if using partial initial state

      const result = setIsLoadingAction(loadingState, false);
      expect(result.nodes.isLoading).toBe(false);
      // Example using inline snapshot
      expect(result.nodes).toMatchInlineSnapshot(`
        {
          "isLoading": false,
        }
      `);
    });
  });
});
```

## Advanced Patterns

### Context Integration

When component-scoped state is needed, consider combining Zustand with React Context. This approach lets you share store instances through context while maintaining Zustand's optimization benefits.

### Store Creation Within Components

For reusable components requiring isolated state, create stores within components using `createStore` instead of the global `create` function, sharing the instance via React Context.

## Common Mistakes to Avoid

1.  Subscribing to the entire store instead of using selectors
2.  Returning new object references from selectors without shallow comparison
3.  Including functions/actions in persisted state (when using persistence middleware)
4.  Placing business logic in components instead of in the store

## Conclusion

Zustand provides flexibility with minimal constraints, making clean code practices particularly important. By following these patterns, especially the structured approach with features, types, actions, and hooks, you can create maintainable, performant applications while leveraging Zustand's simplicity and power.
