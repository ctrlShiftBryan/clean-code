# Typography

Typography components in React Native Reusables provide consistent text styling across your application with customizable styles for headings, paragraphs, lists, and other text elements.

## Features

- Consistent text styling across platforms
- Adaptive sizing for different devices
- Support for custom fonts
- Accessibility features built-in

## Installation

Typography components are typically installed as part of the base React Native Reusables package. The main component is `Text`, which serves as the foundation for other typography components.

```bash
npx @react-native-reusables/cli@latest add text
```

## Components

### Text

The base text component that provides consistent styling and accessibility features.

```jsx
import { Text } from '~/components/ui/text';

function TextExample() {
  return (
    <Text className="text-foreground text-base">
      This is a basic text component
    </Text>
  );
}
```

### Headings

Heading components for different levels of headings in your content hierarchy.

```jsx
import { H1, H2, H3, H4, H5, H6 } from '~/components/ui/heading';

function HeadingExample() {
  return (
    <>
      <H1>Heading Level 1</H1>
      <H2>Heading Level 2</H2>
      <H3>Heading Level 3</H3>
      <H4>Heading Level 4</H4>
      <H5>Heading Level 5</H5>
      <H6>Heading Level 6</H6>
    </>
  );
}
```

### Paragraph

A component for styled paragraph text.

```jsx
import { P } from '~/components/ui/paragraph';

function ParagraphExample() {
  return (
    <P className="text-muted-foreground mb-4">
      This is a paragraph of text that demonstrates the paragraph component. It
      includes proper spacing and styling for readability.
    </P>
  );
}
```

### Lists

Components for ordered and unordered lists.

```jsx
import { UL, OL, LI } from '~/components/ui/list';

function ListExample() {
  return (
    <>
      <UL className="my-4">
        <LI>Unordered list item 1</LI>
        <LI>Unordered list item 2</LI>
        <LI>Unordered list item 3</LI>
      </UL>

      <OL className="my-4">
        <LI>Ordered list item 1</LI>
        <LI>Ordered list item 2</LI>
        <LI>Ordered list item 3</LI>
      </OL>
    </>
  );
}
```

### BlockQuote

A component for displaying quoted content.

```jsx
import { BlockQuote } from '~/components/ui/blockquote';

function BlockQuoteExample() {
  return (
    <BlockQuote className="my-6 border-l-4 border-primary pl-4">
      <Text>The quick brown fox jumps over the lazy dog.</Text>
      <Text className="mt-2 text-sm text-muted-foreground">— Anonymous</Text>
    </BlockQuote>
  );
}
```

## Styling

Typography components in React Native Reusables use a utility-based styling approach, allowing you to compose styles using class names. Common typography utility classes include:

- Font size: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, etc.
- Font weight: `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-bold`, etc.
- Text color: `text-foreground`, `text-muted-foreground`, `text-primary`, etc.
- Text alignment: `text-left`, `text-center`, `text-right`, `text-justify`
- Line height: `leading-none`, `leading-tight`, `leading-normal`, `leading-relaxed`, etc.

## Example

```jsx
import { View } from 'react-native';
import { H1, H2 } from '~/components/ui/heading';
import { P } from '~/components/ui/paragraph';
import { Text } from '~/components/ui/text';

export default function TypographyExample() {
  return (
    <View className="p-4">
      <H1 className="text-primary mb-2">Typography Example</H1>
      <H2 className="text-foreground mb-4">Using React Native Reusables</H2>

      <P className="mb-4">
        This example demonstrates various typography components available in
        React Native Reusables.
      </P>

      <Text className="text-sm text-muted-foreground italic">
        Customizable text components for all your needs
      </Text>
    </View>
  );
}
```
