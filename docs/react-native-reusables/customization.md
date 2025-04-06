# Customization

React Native Reusables is designed to be highly customizable, allowing you to adapt the components to match your application's design system.

## Styling Approach

React Native Reusables uses a utility-based styling approach similar to Tailwind CSS. This enables you to:

- Apply styles directly with className props
- Create consistent design patterns
- Customize components without modifying their source code

## Theme Customization

### Colors

To customize colors, you can create a theme configuration file:

```tsx
// lib/theme.ts
export const theme = {
  colors: {
    primary: '#0070f3',
    secondary: '#7928ca',
    background: '#ffffff',
    foreground: '#1f2937',
    muted: '#f3f4f6',
    'muted-foreground': '#6b7280',
    destructive: '#ef4444',
    'destructive-foreground': '#ffffff',
    // Add more colors as needed
  },
  // Other theme values
};
```

Then use these colors in your components:

```tsx
import { theme } from '~/lib/theme';

// In your component
<View style={{ backgroundColor: theme.colors.primary }}>
  <Text style={{ color: theme.colors.foreground }}>Themed Text</Text>
</View>;
```

### Typography

You can customize typography by defining font styles in your theme:

```tsx
// lib/theme.ts
export const theme = {
  // ...other theme values
  fonts: {
    sans: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
    serif: 'Georgia, serif',
    mono: 'Menlo, Monaco, Consolas, monospace',
  },
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeights: {
    thin: '100',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};
```

## Component Customization

### Extending Components

You can extend existing components to create customized versions:

```tsx
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

// Create a custom primary button with specific styling
export function PrimaryButton({ className, ...props }) {
  return (
    <Button
      className={cn('bg-blue-600 text-white px-6 py-3 rounded-full', className)}
      {...props}
    />
  );
}
```

### Using the cn Utility

The `cn` utility function is a powerful tool for combining class names conditionally:

```tsx
import { View, Text } from 'react-native';
import { cn } from '~/lib/utils';

function StatusBadge({ status, className, ...props }) {
  return (
    <View
      className={cn(
        'px-2 py-1 rounded-full',
        {
          'bg-green-100 text-green-800': status === 'success',
          'bg-red-100 text-red-800': status === 'error',
          'bg-yellow-100 text-yellow-800': status === 'warning',
          'bg-blue-100 text-blue-800': status === 'info',
        },
        className,
      )}
      {...props}
    >
      <Text>{status}</Text>
    </View>
  );
}
```

## Responsive Design

React Native Reusables supports responsive design with special prefixes:

```jsx
<View className="flex-row web:flex-col tablet:flex-row">
  {/* Will be row on mobile and tablet, column on web */}
</View>
```

Common responsive prefixes include:

- `web:` - Apply styles only on web platforms
- `native:` - Apply styles only on native platforms (iOS/Android)
- `sm:`, `md:`, `lg:`, `xl:` - Apply styles at specific breakpoints

## Dark Mode Support

You can implement dark mode support using the following approach:

```tsx
import { useColorScheme } from 'react-native';
import { createContext, useContext } from 'react';

// Create a theme context
const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

// Theme provider component
export function ThemeProvider({ children }) {
  const colorScheme = useColorScheme();
  const [isDark, setIsDark] = useState(colorScheme === 'dark');

  // Toggle theme function
  const toggleTheme = () => setIsDark(!isDark);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook to use theme
export function useTheme() {
  return useContext(ThemeContext);
}
```

Then in your components:

```jsx
import { useTheme } from '~/lib/theme';

function ThemedComponent() {
  const { isDark } = useTheme();

  return (
    <View
      className={cn(
        'p-4 rounded-md',
        isDark ? 'bg-gray-800 text-white' : 'bg-white text-gray-800',
      )}
    >
      <Text>This component respects dark mode</Text>
    </View>
  );
}
```

## Custom Animations

For custom animations, you can combine React Native Reusables with animation libraries like React Native Reanimated:

```jsx
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Button } from '~/components/ui/button';
import { View } from 'react-native';

function AnimatedCard() {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePress = () => {
    scale.value = withSpring(scale.value === 1 ? 1.1 : 1);
  };

  return (
    <View className="p-4">
      <Animated.View
        style={animatedStyle}
        className="bg-white rounded-xl p-6 shadow-lg"
      >
        <Text className="text-lg font-bold">Animated Card</Text>
        <Text className="text-gray-500 mt-2">
          This card animates when you press the button below
        </Text>
      </Animated.View>

      <Button onPress={handlePress} className="mt-4">
        <Text>Animate</Text>
      </Button>
    </View>
  );
}
```
