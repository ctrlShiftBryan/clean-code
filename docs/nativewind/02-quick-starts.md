# 2. A. Quick Starts

This section covers how to set up NativeWind with different React Native frameworks and environments.

## 2. B. React Native CLI Setup

Setting up NativeWind with React Native CLI involves a few steps. Once set up, you can start using Tailwind CSS classes in your React Native application.

### Example Implementation

```jsx
/**
 * Sample React Native App with NativeWind
 */

import React from 'react';
import type {Node} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

const Section = ({children, title}): Node => {
  return (
    <View className="mt-8 px-2">
      <Text className="text-2xl text-black dark:text-white">
        {title}
      </Text>
      <Text className="mt-2 text-lg text-black dark:text-white">
        {children}
      </Text>
    </View>
  );
};

const App: () => Node = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const backgroundStyle = "bg-neutral-300 dark:bg-slate-900";

  return (
    <SafeAreaView className={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        className={backgroundStyle}>
        <Header />
        <View className="bg-white dark:bg-black">
          <Section title="Step One">
            Edit <Text className="font-bold">App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
```

## 2. C. Expo Setup

NativeWind can be used with Expo projects. An example of an Expo project with NativeWind can be found on the official GitHub repository.

## 2. D. Solito Setup

Solito is a framework for building cross-platform apps with React Native and Next.js. To set up a Solito project with NativeWind:

```bash
npx create-solito-app@latest my-solito-app -t with-tailwind
```

A Solito project typically consists of two separate applications that share a monorepo (typically an Expo and a Next.js application). You will need to set up each project individually.

Recommendations:

- Use the Babel Plugin for your native app
- Use Next.js via Babel for your Next.js app

For more information, refer to the Solito Tailwind CSS Starter documentation.

## 2. E. Next.js Setup

When using NativeWind with Next.js, there are some common issues to be aware of.

### Common Issues and Solutions

1. **Package Import Errors**

   Errors like:

   ```
   import typeof AccessibilityInfo from './Libraries/Components/AccessibilityInfo/AccessibilityInfo';
   ^^^^^^

   SyntaxError: Cannot use import statement outside a module
   ```

   This signals that you have incorrectly set up React Native Web and/or a dependency needs to be added to `transpilePackages`. This is outside the scope of NativeWind.

2. **Styles Not Being Applied**

   A common issue with Next.js is when styles are imported but overridden by another StyleSheet due to the stylesheet import order. A simple fix is to make the Tailwind styles a higher specificity:

   ```js
   module.exports = {
     content: ['./pages/**/*.{js,jsx,ts,tsx}'],
     plugins: [require('nativewind/tailwind/css')],
     important: 'html',
     theme: {
       extend: {},
     },
   };
   ```
