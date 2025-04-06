# Table

The Table component provides a way to display tabular data in your React Native application.

## Installation

### Using CLI

```bash
npx @react-native-reusables/cli@latest add table
```

### Manual Installation

Create a file at `~/components/ui/table.tsx` with the following content:

```tsx
import * as TablePrimitive from '@rn-primitives/table';
import * as React from 'react';
import { cn } from '~/lib/utils';
import { TextClassContext } from '~/components/ui/text';

const Table = React.forwardRef<
  TablePrimitive.RootRef,
  TablePrimitive.RootProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Root
    ref={ref}
    className={cn('w-full caption-bottom text-sm', className)}
    {...props}
  />
));
Table.displayName = 'Table';

const TableHeader = React.forwardRef<
  TablePrimitive.HeaderRef,
  TablePrimitive.HeaderProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Header
    ref={ref}
    className={cn('border-border [&_tr]:border-b', className)}
    {...props}
  />
));
TableHeader.displayName = 'TableHeader';

const TableBody = React.forwardRef<
  TablePrimitive.BodyRef,
  TablePrimitive.BodyProps
>(({ className, style, ...props }, ref) => (
  <TablePrimitive.Body
    ref={ref}
    className={cn('flex-1 border-border [&_tr:last-child]:border-0', className)}
    style={[{ minHeight: 2 }, style]}
    {...props}
  />
));
TableBody.displayName = 'TableBody';

const TableFooter = React.forwardRef<
  TablePrimitive.FooterRef,
  TablePrimitive.FooterProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Footer
    ref={ref}
    className={cn('bg-muted/50 font-medium [&>tr]:last:border-b-0', className)}
    {...props}
  />
));
TableFooter.displayName = 'TableFooter';

const TableRow = React.forwardRef<
  TablePrimitive.RowRef,
  TablePrimitive.RowProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Row
    ref={ref}
    className={cn(
      'flex-row border-border border-b web:transition-colors web:hover:bg-muted/50 web:data-[state=selected]:bg-muted',
      className,
    )}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

const TableHead = React.forwardRef<
  TablePrimitive.HeadRef,
  TablePrimitive.HeadProps
>(({ className, ...props }, ref) => (
  <TextClassContext.Provider value="text-muted-foreground">
    <TablePrimitive.Head
      ref={ref}
      className={cn(
        'h-12 px-4 text-left justify-center font-medium [&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  </TextClassContext.Provider>
));
TableHead.displayName = 'TableHead';

const TableCell = React.forwardRef<
  TablePrimitive.CellRef,
  TablePrimitive.CellProps
>(({ className, ...props }, ref) => (
  <TablePrimitive.Cell
    ref={ref}
    className={cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', className)}
    {...props}
  />
));
TableCell.displayName = 'TableCell';

export {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
```

## Usage Example

```jsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table';
import { Text } from '~/components/ui/text';

export default function TableExample() {
  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Developer' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Designer' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Manager' },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <Text>ID</Text>
          </TableHead>
          <TableHead>
            <Text>Name</Text>
          </TableHead>
          <TableHead>
            <Text>Email</Text>
          </TableHead>
          <TableHead>
            <Text>Role</Text>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <Text>{row.id}</Text>
            </TableCell>
            <TableCell>
              <Text>{row.name}</Text>
            </TableCell>
            <TableCell>
              <Text>{row.email}</Text>
            </TableCell>
            <TableCell>
              <Text>{row.role}</Text>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

## Components

### Table

The root component that wraps all table elements.

### TableHeader

Contains the header row of the table.

### TableBody

Contains the body rows of the table.

### TableFooter

Contains the footer row of the table.

### TableRow

Represents a row in the table.

### TableHead

A header cell in the table header.

### TableCell

A standard cell in the table body.
