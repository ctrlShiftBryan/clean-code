# Navigation Menu

The Navigation Menu component provides a flexible and accessible way to create dropdown navigation in your React Native application.

## Features

- Dropdown menus with customizable content
- Support for nested navigation items
- Responsive design for both web and mobile platforms
- Accessible interface elements

## Example Usage

```jsx
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem value="getting-started">
      <NavigationMenuTrigger>
        <Text className="text-foreground">Getting Started</Text>
      </NavigationMenuTrigger>
      <NavigationMenuContent>
        <View role="list" className="grid gap-3 p-4">
          <ListItem href="/docs/installation" title="Installation">
            <Text>How to install dependencies and structure your app.</Text>
          </ListItem>
          <ListItem href="/docs/typography" title="Typography">
            <Text>Styles for headings, paragraphs, lists...etc</Text>
          </ListItem>
        </View>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```

## Components

### NavigationMenu

The root component that contains all navigation elements.

### NavigationMenuList

Contains the navigation items in a horizontal list.

### NavigationMenuItem

Individual navigation item that can contain a trigger and content.

### NavigationMenuTrigger

The button that opens a dropdown menu.

### NavigationMenuContent

The content displayed when a navigation menu item is triggered.

### NavigationMenuLink

A navigable link that can be used within the navigation menu.

### ListItem

A styled list item that can be used within navigation menu content.
