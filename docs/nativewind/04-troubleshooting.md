# 4. A. Troubleshooting

This section covers common issues you might encounter when using NativeWind and provides solutions to help you overcome them.

## 4. B. Common Next.js Issues

### Package Import Errors

If you encounter errors like:

```
import typeof AccessibilityInfo from './Libraries/Components/AccessibilityInfo/AccessibilityInfo';
^^^^^^

SyntaxError: Cannot use import statement outside a module
```

This typically indicates an incorrect setup of React Native Web and/or a dependency that needs to be added to `transpilePackages`. This issue is outside the scope of NativeWind, but is related to the Next.js React Native Web integration.

### Styles Not Being Applied

A common issue with Next.js is when your NativeWind styles are imported but overridden by another StyleSheet due to the stylesheet import order.

#### Solution:

Make the Tailwind styles a higher specificity by adding the `important` flag to your Tailwind configuration:

```js
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('nativewind/tailwind/css')],
  important: 'html', // Makes Tailwind styles higher specificity
  theme: {
    extend: {},
  },
};
```

## 4. C. Cross-Platform Styling Issues

### Platform-Specific Styling

Sometimes you might need different styles for different platforms. NativeWind supports conditional styling based on platforms:

```jsx
<View className="bg-red-500 ios:bg-blue-500 android:bg-green-500">
  {/* This will be red on web, blue on iOS, and green on Android */}
</View>
```

### Unsupported CSS Properties

Not all CSS properties available in web applications are supported in React Native. If you're using a property that doesn't work in React Native, you might need to use platform-specific styling or find an alternative approach.

## 4. D. Content Configuration Issues

If your styles aren't being applied, it might be due to incorrectly configured content paths:

1. Ensure your `tailwind.config.js` file properly specifies all files that contain Tailwind classes:

```js
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    // Include all files that contain Tailwind classes
  ],
  // rest of your config
};
```

2. Make sure you have the NativeWind plugin properly configured:

```js
plugins: [require('nativewind/tailwind/css')],
```

3. For monorepo setups, ensure your content configuration includes paths to shared components:

```js
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/ui/**/*.{js,jsx,ts,tsx}', // Shared UI components
  ],
  // rest of your config
};
```

## 4. E. Build and Performance Issues

### Large Bundle Sizes

If you notice your application bundle is considerably larger after adding NativeWind, consider:

1. Using a custom configuration that includes only the utilities you need
2. Purging unused styles in production builds
3. Breaking your application into smaller chunks if using web platforms

### Slow Development Builds

If your development builds are slow after adding NativeWind:

1. Consider using Bun or other faster JavaScript runtimes
2. Use the JIT mode of Tailwind when possible
3. Limit the content files scanned by restricting your content configuration to only necessary paths
