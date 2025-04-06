# Material Top Tabs

Material Top Tabs provide a tab navigation interface similar to those found in Material Design applications, allowing users to swipe between content views.

## Features

- Swipeable tab navigation
- Material Design styling
- Customizable appearance
- Platform-adaptive behavior

## Installation

Material Top Tabs are typically implemented using the `@react-navigation/material-top-tabs` package alongside React Native Reusables components.

```bash
npm install @react-navigation/material-top-tabs react-native-tab-view
```

## Example Usage

```jsx
import * as React from 'react';
import { View, Text } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { NavigationContainer } from '@react-navigation/native';

// Import your custom styling components from React Native Reusables
import { styled } from '~/lib/styling';

const Tab = createMaterialTopTabNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
    </View>
  );
}

export default function MaterialTopTabExample() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#6200ee',
          tabBarInactiveTintColor: '#939393',
          tabBarIndicatorStyle: {
            backgroundColor: '#6200ee',
          },
          tabBarLabelStyle: {
            fontSize: 14,
            fontWeight: '500',
          },
          tabBarStyle: {
            backgroundColor: '#ffffff',
            elevation: 1,
          },
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
```

## Customization

Material Top Tabs can be customized using the following options:

- `tabBarActiveTintColor`: Color for active tab labels
- `tabBarInactiveTintColor`: Color for inactive tab labels
- `tabBarIndicatorStyle`: Style for the tab indicator
- `tabBarLabelStyle`: Style for tab labels
- `tabBarStyle`: Style for the tab bar container
- `swipeEnabled`: Enable or disable swiping between tabs
- `tabBarPosition`: Position of the tab bar ('top' or 'bottom')

## Integration with React Native Reusables

To integrate Material Top Tabs with React Native Reusables components, you can:

1. Use the styling utilities from React Native Reusables
2. Apply consistent theme colors from your app's theme
3. Combine with other React Native Reusables components to create a cohesive UI

```jsx
import { useTheme } from '~/lib/theme';

// Inside your component
const theme = useTheme();

<Tab.Navigator
  screenOptions={{
    tabBarActiveTintColor: theme.colors.primary,
    tabBarInactiveTintColor: theme.colors.muted,
    tabBarIndicatorStyle: {
      backgroundColor: theme.colors.primary,
    },
    // Other styling based on your theme
  }}
>
  {/* Tab screens */}
</Tab.Navigator>;
```
