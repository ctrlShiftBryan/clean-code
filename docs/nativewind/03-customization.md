# 3. A. Customization

This section covers how to customize NativeWind to fit your specific project requirements.

## 3. B. Content Configuration

NativeWind follows the same `content` rules as Tailwind CSS. The content configuration specifies which files should be scanned for class names.

### Configuration Example

To set up content configuration in your Tailwind CSS configuration file:

```js
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    // Add other file paths that contain Tailwind classes
  ],
  plugins: [require('nativewind/tailwind/css')],
  theme: {
    extend: {},
  },
};
```

For more detailed information and troubleshooting steps, you should refer to the official Tailwind CSS documentation as NativeWind follows the same rules.

## 3. C. Advanced Customization Options

### Making Tailwind Styles Higher Specificity

In some situations, particularly with Next.js, you may need to increase the specificity of your Tailwind styles to prevent them from being overridden by other stylesheets:

```js
module.exports = {
  content: ['./pages/**/*.{js,jsx,ts,tsx}'],
  plugins: [require('nativewind/tailwind/css')],
  important: 'html', // This makes all utility classes have higher specificity
  theme: {
    extend: {},
  },
};
```

### Extending the Theme

You can extend the default theme in your Tailwind configuration:

```js
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#3490dc',
        secondary: '#ffed4a',
        danger: '#e3342f',
      },
      fontFamily: {
        sans: ['OpenSans-Regular'],
        serif: ['Merriweather-Regular'],
        mono: ['SpaceMono-Regular'],
      },
      spacing: {
        72: '18rem',
        84: '21rem',
        96: '24rem',
      },
    },
  },
  plugins: [require('nativewind/tailwind/css')],
};
```

This allows you to create a consistent design system across your application with custom colors, fonts, spacing, and more.
