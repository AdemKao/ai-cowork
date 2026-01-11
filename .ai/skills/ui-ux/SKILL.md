---
name: ui-ux
description: UI/UX design intelligence for professional frontend development. Use when building UI, creating pages, designing components, landing pages, dashboards, or styling web applications.
---

# UI/UX Design Skill

> Design intelligence for building professional, modern web interfaces.

## Overview

This skill provides guidance for:
- **UI Styles** - Glassmorphism, minimalism, dark mode, etc.
- **Color Palettes** - Industry-specific color schemes
- **Typography** - Font pairings and hierarchy
- **Layouts** - Page structures and patterns
- **Components** - Common UI component patterns
- **Accessibility** - WCAG compliance

---

## How to Use

When building UI/UX:

1. **Identify Project Type** → SaaS, e-commerce, portfolio, dashboard, etc.
2. **Choose Style** → Based on brand/industry
3. **Select Colors** → From curated palettes
4. **Pick Typography** → Font pairings
5. **Build Components** → Following patterns
6. **Verify Quality** → Pre-delivery checklist

---

## UI Styles

### Glassmorphism
```css
.glass-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
}
```
**Best for**: Modern SaaS, dashboards, creative portfolios
**Avoid**: E-commerce product pages, text-heavy content

### Minimalism
```css
.minimal {
  background: #ffffff;
  color: #1a1a1a;
  font-family: 'Inter', sans-serif;
  line-height: 1.6;
}
```
**Best for**: Professional services, portfolios, blogs
**Key**: Generous whitespace, limited color palette

### Dark Mode
```css
:root {
  --bg-primary: #0f0f0f;
  --bg-secondary: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --accent: #3b82f6;
}
```
**Best for**: Developer tools, media apps, gaming
**Key**: Sufficient contrast, reduce eye strain

### Neumorphism
```css
.neumorphic {
  background: #e0e0e0;
  border-radius: 12px;
  box-shadow: 
    8px 8px 16px #bebebe,
    -8px -8px 16px #ffffff;
}
```
**Best for**: Mobile apps, music players, settings UI
**Avoid**: Complex interfaces, accessibility-critical apps

### Bento Grid
```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
.bento-item.large { grid-column: span 2; grid-row: span 2; }
.bento-item.wide { grid-column: span 2; }
.bento-item.tall { grid-row: span 2; }
```
**Best for**: Dashboards, portfolios, feature showcases

---

## Color Palettes

### SaaS / Tech
```css
:root {
  --primary: #3b82f6;      /* Blue */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #10b981;       /* Green - success */
  --background: #0f172a;   /* Dark slate */
  --surface: #1e293b;      /* Lighter slate */
  --text: #f8fafc;         /* Near white */
  --text-muted: #94a3b8;   /* Muted */
}
```

### E-commerce
```css
:root {
  --primary: #f59e0b;      /* Amber - CTA */
  --secondary: #1f2937;    /* Dark gray */
  --accent: #10b981;       /* Green - sale */
  --background: #ffffff;
  --surface: #f9fafb;
  --text: #111827;
  --text-muted: #6b7280;
}
```

### Healthcare
```css
:root {
  --primary: #0ea5e9;      /* Sky blue */
  --secondary: #14b8a6;    /* Teal */
  --accent: #f43f5e;       /* Rose - alerts */
  --background: #f0fdfa;   /* Light teal tint */
  --surface: #ffffff;
  --text: #0f172a;
  --text-muted: #64748b;
}
```

### Fintech
```css
:root {
  --primary: #059669;      /* Emerald */
  --secondary: #1e40af;    /* Blue */
  --accent: #f59e0b;       /* Amber - warnings */
  --background: #ffffff;
  --surface: #f8fafc;
  --text: #0f172a;
  --text-muted: #64748b;
}
```

### Creative / Portfolio
```css
:root {
  --primary: #ec4899;      /* Pink */
  --secondary: #8b5cf6;    /* Purple */
  --accent: #f59e0b;       /* Amber */
  --background: #0a0a0a;   /* Near black */
  --surface: #171717;
  --text: #fafafa;
  --text-muted: #a3a3a3;
}
```

---

## Typography

### Professional / Corporate
```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

h1, h2, h3 { font-weight: 600; }
```

### Modern / Tech
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');

body {
  font-family: 'Space Grotesk', sans-serif;
}
```

### Elegant / Luxury
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=Lato:wght@300;400;700&display=swap');

h1, h2, h3 {
  font-family: 'Playfair Display', serif;
}
body {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
}
```

### Playful / Friendly
```css
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700&display=swap');

body {
  font-family: 'Nunito', sans-serif;
}
```

### Type Scale
```css
:root {
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  --text-4xl: 2.25rem;   /* 36px */
  --text-5xl: 3rem;      /* 48px */
}
```

---

## Layout Patterns

### Landing Page Structure
```
┌─────────────────────────────────────┐
│           NAVBAR (fixed)            │
├─────────────────────────────────────┤
│                                     │
│              HERO                   │
│     Headline + CTA + Visual         │
│                                     │
├─────────────────────────────────────┤
│           SOCIAL PROOF              │
│        Logos / Testimonials         │
├─────────────────────────────────────┤
│            FEATURES                 │
│      3-4 column grid / Bento        │
├─────────────────────────────────────┤
│           HOW IT WORKS              │
│         Steps / Timeline            │
├─────────────────────────────────────┤
│            PRICING                  │
│         2-3 tier cards              │
├─────────────────────────────────────┤
│              CTA                    │
│       Final call to action          │
├─────────────────────────────────────┤
│             FOOTER                  │
└─────────────────────────────────────┘
```

### Dashboard Layout
```
┌──────┬──────────────────────────────┐
│      │         HEADER               │
│      ├──────────────────────────────┤
│ SIDE │                              │
│ BAR  │         CONTENT              │
│      │                              │
│      │   ┌─────┐ ┌─────┐ ┌─────┐   │
│      │   │Card │ │Card │ │Card │   │
│      │   └─────┘ └─────┘ └─────┘   │
│      │                              │
│      │   ┌───────────────────────┐  │
│      │   │       Table/Chart     │  │
│      │   └───────────────────────┘  │
└──────┴──────────────────────────────┘
```

---

## Component Patterns

### Button Hierarchy
```css
/* Primary - Main CTA */
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}
.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Secondary */
.btn-secondary {
  background: transparent;
  color: var(--primary);
  border: 1px solid var(--primary);
}

/* Ghost */
.btn-ghost {
  background: transparent;
  color: var(--text-muted);
}
.btn-ghost:hover {
  color: var(--text);
  background: var(--surface);
}
```

### Card Patterns
```css
.card {
  background: var(--surface);
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}
.card:hover {
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.card.interactive {
  cursor: pointer;
}
```

### Input Fields
```css
.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.2s;
}
.input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.input.error {
  border-color: var(--error);
}
```

---

## Common Rules (MUST FOLLOW)

### Icons
| ✅ Do | ❌ Don't |
|-------|----------|
| Use SVG icons (Heroicons, Lucide) | Use emojis as icons 🎨 🚀 |
| Consistent icon sizing (24x24) | Mix different icon sizes |
| Use Simple Icons for brand logos | Guess brand logo paths |

### Hover States
| ✅ Do | ❌ Don't |
|-------|----------|
| Use color/opacity transitions | Use scale transforms that shift layout |
| Add `cursor: pointer` to clickables | Leave default cursor on interactive elements |
| Smooth transitions (150-300ms) | Instant or too slow (>500ms) |

### Light/Dark Mode
| ✅ Do | ❌ Don't |
|-------|----------|
| `bg-white/80` for glass in light mode | `bg-white/10` (invisible) |
| `#0F172A` for text in light mode | `#94A3B8` for body text |
| Test both modes before delivery | Assume dark mode only |

### Spacing
| ✅ Do | ❌ Don't |
|-------|----------|
| Use consistent spacing scale (4, 8, 12, 16, 24, 32, 48) | Random pixel values |
| Account for fixed navbar height | Content hidden behind fixed elements |
| Responsive padding (mobile vs desktop) | Same padding everywhere |

---

## Pre-Delivery Checklist

### Visual Quality
- [ ] No emojis used as icons
- [ ] All icons from consistent set (Heroicons/Lucide)
- [ ] Brand logos verified (Simple Icons)
- [ ] Hover states don't cause layout shift
- [ ] Colors from defined palette

### Interaction
- [ ] All clickable elements have `cursor: pointer`
- [ ] Hover states provide visual feedback
- [ ] Transitions are smooth (150-300ms)
- [ ] Focus states visible for keyboard navigation

### Light/Dark Mode
- [ ] Light mode text has sufficient contrast (4.5:1)
- [ ] Glass/transparent elements visible in light mode
- [ ] Borders visible in both modes
- [ ] Both modes tested

### Layout
- [ ] Floating elements have proper spacing
- [ ] No content behind fixed navbars
- [ ] Responsive at 320px, 768px, 1024px, 1440px
- [ ] No horizontal scroll on mobile

### Accessibility
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color is not the only indicator
- [ ] `prefers-reduced-motion` respected

---

## Stack-Specific Implementation

### React + Tailwind
```tsx
// Use Tailwind classes
<button className="bg-primary text-white px-6 py-3 rounded-lg 
  hover:opacity-90 transition-all duration-200">
  Get Started
</button>
```

### Vue + CSS
```vue
<template>
  <button class="btn-primary">Get Started</button>
</template>

<style scoped>
.btn-primary {
  @apply bg-primary text-white px-6 py-3 rounded-lg;
  transition: all 0.2s;
}
.btn-primary:hover {
  opacity: 0.9;
}
</style>
```

### Plain HTML + CSS
```html
<button class="btn-primary">Get Started</button>

<style>
.btn-primary {
  background: var(--primary);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}
</style>
```
