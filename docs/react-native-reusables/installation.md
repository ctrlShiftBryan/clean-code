# Installation

This guide will help you set up React Native Reusables in your project.

## Prerequisites

Before installing React Native Reusables, make sure you have:

- A React Native project set up
- Node.js and npm/yarn installed
- Basic understanding of React and React Native

## Installation Methods

There are two main ways to install React Native Reusables components:

### 1. Using the CLI (Recommended)

The React Native Reusables CLI is the easiest way to add components to your project. It helps set up the required dependencies and configuration.

First, install the CLI globally:

```bash
npm install -g @react-native-reusables/cli
```

Then, you can add components to your project:

```bash
# Add a specific component
npx @react-native-reusables/cli@latest add button

# Add multiple components
npx @react-native-reusables/cli@latest add button card tabs
```

### 2. Manual Installation

If you prefer to have more control over the installation process, you can manually add components to your project:

1. Create the appropriate directory structure:

```bash
mkdir -p components/ui
```

2. Copy the component code into your project. For example, for the Button component:

```tsx
// components/ui/button.tsx
import * as React from 'react';
import { Pressable } from 'react-native';
import { cn } from '~/lib/utils';
import { Text } from './text';

const Button = React.forwardRef<
  React.ElementRef<typeof Pressable>,
  React.ComponentPropsWithoutRef<typeof Pressable> & {
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
  }
>(
  (
    { className, variant = 'default', size = 'default', children, ...props },
    ref,
  ) => {
    return (
      <Pressable
        className={cn(
          'rounded-md web:focus-visible:ring-ring web:ring-offset-background inline-flex items-center web:justify-center whitespace-nowrap text-sm font-medium web:ring-offset-2 web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:disabled:pointer-events-none web:disabled:opacity-50',
          {
            'bg-primary text-primary-foreground web:hover:bg-primary/90 active:bg-primary/90':
              variant === 'default',
            'bg-destructive text-destructive-foreground web:hover:bg-destructive/90 active:bg-destructive/90':
              variant === 'destructive',
            'border-input web:hover:bg-accent web:hover:text-accent-foreground border bg-background active:bg-accent active:text-accent-foreground':
              variant === 'outline',
            'bg-secondary text-secondary-foreground web:hover:bg-secondary/80 active:bg-secondary/80':
              variant === 'secondary',
            'web:hover:bg-accent web:hover:text-accent-foreground active:bg-accent active:text-accent-foreground':
              variant === 'ghost',
            'text-primary web:underline-offset-4 web:hover:underline':
              variant === 'link',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </Pressable>
    );
  },
);

Button.displayName = 'Button';

export { Button };
```

3. Make sure to also create the utility functions needed by the components:

```tsx
// lib/utils.ts
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

## Required Dependencies

React Native Reusables relies on several key dependencies:

- `clsx` and `tailwind-merge` for handling class names
- `@rn-primitives/<component>` for component primitives
- Tailwind CSS for styling

Install these with:

```bash
npm install clsx tailwind-merge
```

For specific components, you may need additional packages which the CLI will help you install.

## Project Structure

A typical project structure with React Native Reusables looks like:

```
my-app/
├── components/
│   └── ui/
│       ├── button.tsx
│       ├── card.tsx
│       ├── tabs.tsx
│       └── ...
├── lib/
│   └── utils.ts
├── app/
│   └── ...
└── ...
```

## Next Steps

After installing React Native Reusables components:

1. Start using the components in your application
2. Customize the components to match your design system
3. Create your own reusable components based on the provided patterns

For more information on specific components, check the documentation for each component.
