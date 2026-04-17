# Frontend Styles Directory

This directory contains all global styling for the frontend application.

## 📁 Structure

```
styles/
├── index.css        # Main entry point - imports Tailwind and all other styles
├── variables.css    # CSS custom properties and theme variables
├── animations.css   # Reusable animations and effects
└── scrollbar.css    # Custom scrollbar styling
```

## 📖 File Descriptions

### `index.css` (Main Stylesheet)
- Tailwind CSS imports (@tailwind directives)
- CSS layer organization (base, components, utilities)
- Root theme variables
- Dark mode support
- Custom component classes (.btn-primary, .card, etc.)

### `variables.css`
- **Color Variables**: Brand colors, backgrounds, text colors
- **Spacing System**: Consistent spacing units (xs, sm, md, lg, xl, 2xl)
- **Border Radius**: Predefined border radius values
- **Shadow Definitions**: Shadow utilities for depth

### `animations.css`
- **Keyframe Animations**: fadeIn, slideInUp
- **Utility Classes**: .animate-fade-in, .animate-slide-in-up
- **Hover Effects**: .hover-lift

### `scrollbar.css`
- **Custom Scrollbar Styling**: Brand-colored lightweight scrollbars
- **Support**: Webkit browsers (Chrome, Safari, Edge)

## 🎨 Color System

The application uses a consistent color system:
- **Primary (Brand)**: Emerald 500 (#10B981)
- **Backgrounds**: White (light mode) / Black (dark mode)
- **Text**: Dark gray (light mode) / Light gray (dark mode)

## 🌓 Dark Mode

Dark mode support is implemented via CSS custom properties:
```css
:root { /* Light mode */ }
.dark { /* Dark mode */ }
```

Change the class on the root element to toggle dark mode.

## 💡 Best Practices

1. **Use Tailwind First**: Prefer Tailwind utility classes over custom CSS
2. **CSS Variables**: Use `--` prefixed variables for theming
3. **Animations**: Use predefined keyframes and animation classes
4. **Responsive**: Use Tailwind's breakpoints (sm, md, lg, xl)
5. **Dark Mode**: Always provide `.dark` versions of color variables

## 📝 Adding New Styles

1. **For component-specific styles**: Use Tailwind classes in JSX
2. **For global utilities**: Add to `index.css` in @layer utilities
3. **For theme colors**: Add to `variables.css`
4. **For animations**: Add keyframes and classes to `animations.css`

## 🔗 Related Files

- `tailwind.config.js` - Tailwind configuration (spacing, colors, extends)
- `postcss.config.js` - PostCSS configuration for Tailwind processing
- Component styles - All components use Tailwind utility-first approach
