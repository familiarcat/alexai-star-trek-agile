# CSS Implementation Guide

## Design Tokens

### Colors
- Primary: var(--lcars-primary)
- Secondary: var(--lcars-secondary)
- Accent: var(--lcars-accent)

### Typography
- Font Family: var(--lcars-font-family)
- Font Sizes: var(--lcars-font-size-{size})

### Spacing
- Spacing Scale: var(--lcars-spacing-{size})

### Icons
- Icon Sizes: var(--lcars-icon-size-{size})
- Icon Opacity: var(--lcars-icon-opacity-{level})

## Usage Examples

```css
.button {
  background-color: var(--lcars-primary);
  padding: var(--lcars-spacing-md);
  font-size: var(--lcars-font-size-base);
}

.icon {
  width: var(--lcars-icon-size-accent);
  opacity: var(--lcars-icon-opacity-primary);
}
```
