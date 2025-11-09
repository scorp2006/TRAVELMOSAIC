# TripMosaic UI/UX Design System

## Design Philosophy

**TripMosaic** combines elegance with functionality through a sophisticated glass morphism design language. The interface evokes the premium feel of luxury travel while maintaining the clarity and usability required for complex trip planning.

### Core Principles
- **Glass Morphism**: Frosted glass effects with subtle transparency
- **Minimalist Monochrome**: Black and white base with strategic color accents
- **3D Depth**: Subtle 3D elements that enhance without overwhelming
- **Fluid Interactions**: Smooth animations that feel natural and responsive
- **Travel-Inspired**: Visual elements that evoke exploration and wanderlust

---

## Color Palette

### Base Colors
```css
--pure-black: #000000;
--deep-black: #0a0a0a;
--soft-black: #1a1a1a;
--pure-white: #ffffff;
--off-white: #f8f9fa;
--light-gray: #e9ecef;
--mid-gray: #adb5bd;
```

### Travel Accent Colors
```css
/* Ocean & Sky */
--ocean-blue: #0077be;
--sky-blue: #63b3ed;
--deep-ocean: #004d7a;

/* Sunset & Adventure */
--sunset-orange: #ff6b35;
--golden-hour: #f7931e;
--coral: #ff8b94;

/* Nature */
--forest-green: #2d6a4f;
--mint: #52b788;

/* Luxe Metallics */
--gold: #d4af37;
--silver: #c0c0c0;
```

### Usage Guidelines
- **Primary Actions**: Ocean Blue (`#0077be`)
- **Success States**: Mint (`#52b788`)
- **Warnings**: Golden Hour (`#f7931e`)
- **Highlights**: Sunset Orange (`#ff6b35`)
- **Backgrounds**: Pure White with glass overlay
- **Text**: Pure Black on light, Pure White on dark

---

## Typography

### Font Families
```css
--font-display: 'Space Grotesk', sans-serif;  /* Headings, Logo */
--font-body: 'Inter', sans-serif;             /* Body text, UI */
--font-mono: 'JetBrains Mono', monospace;     /* Code, Data */
```

### Type Scale
```css
/* Display */
--text-hero: clamp(64px, 8vw, 120px);
--text-h1: clamp(48px, 6vw, 72px);
--text-h2: clamp(36px, 4vw, 56px);
--text-h3: clamp(28px, 3vw, 40px);

/* Body */
--text-large: 20px;
--text-body: 16px;
--text-small: 14px;
--text-tiny: 12px;

/* Weight */
--weight-light: 300;
--weight-normal: 400;
--weight-medium: 500;
--weight-semibold: 600;
--weight-bold: 700;
```

---

## Glass Morphism System

### Glass Card - Standard
```css
.glass-card {
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.06),
              inset 0 1px 1px rgba(255, 255, 255, 0.8);
  border-radius: 20px;
}
```

### Glass Card - Dark Mode
```css
.glass-card-dark {
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(40px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3),
              inset 0 1px 1px rgba(255, 255, 255, 0.05);
  border-radius: 20px;
}
```

### Glass Navigation
```css
.glass-nav {
  background: rgba(255, 255, 255, 0.35);
  backdrop-filter: blur(50px) saturate(200%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
}
```

### Glass Button
```css
.glass-btn {
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.4);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.glass-btn:hover {
  background: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.12);
}
```

---

## Component Library

### 1. Navigation Bar
**Design**: Fixed glass navigation with blur effect
- Height: 80px
- Logo: Space Grotesk, 24px
- Nav items: Inter, 14px, uppercase, letter-spacing 1px
- CTA button: Glass button with ocean blue accent on hover

### 2. Hero Section
**Design**: Full viewport height with 3D city sphere
- Left: Hero content (60% width)
  - Title: Space Grotesk, 120px, gradient effect
  - Subtitle: Inter, 20px, semi-transparent
  - CTA buttons: Glass buttons with magnetic effect
- Right: Interactive 3D sphere (40% width)
  - Fibonacci distribution of city images
  - Drag-to-rotate functionality
  - Smooth momentum physics
  - Image size: 80px circular

### 3. Trip Cards
**Design**: Glass morphism cards with hover effects
```
┌─────────────────────────────┐
│ 🌆 City Image (16:9)       │
├─────────────────────────────┤
│ Trip Name                   │
│ Date Range                  │
│ ─────────────────          │
│ 👤 3 travelers  💰 $2,450  │
└─────────────────────────────┘
```
- Border radius: 20px
- Hover: Lift 8px, increase shadow
- Overlay: Glass gradient on image
- Status indicator: Colored dot (blue=planning, green=ongoing, gray=completed)

### 4. Interactive Map Component
**Design**: Full-screen map with glass overlay controls
- Map: Google Maps with custom dark/light styling
- Controls: Glass buttons floating over map
- Route visualization: Animated path with gradient
- Markers: Custom 3D pin markers with city photos
- Info cards: Glass cards that slide in from bottom

### 5. Expense Tracker
**Design**: Minimalist financial dashboard
- Charts: Animated donut chart with glass segments
- Category pills: Glass tags with category colors
- Total display: Large number with currency symbol
- List items: Glass rows with receipt icons

### 6. AI Generator Interface
**Design**: Conversational chat-like interface
```
┌──────────────────────────────────────┐
│  🤖 AI Trip Planner                  │
├──────────────────────────────────────┤
│                                      │
│  [User message - glass bubble]       │
│                                      │
│          [AI response - glass]       │
│          [Generated itinerary card]  │
│                                      │
└──────────────────────────────────────┘
│  [Glass input with send button]     │
└──────────────────────────────────────┘
```
- Messages: Alternating alignment (user right, AI left)
- Bubbles: Glass morphism with subtle shadows
- Typing indicator: Animated dots
- Generated itinerary: Expandable glass cards with timeline

### 7. Timeline Component
**Design**: Vertical timeline with day cards
```
      ┌─────────┐
    ╭─┤  Day 1  ├─╮
    │ └─────────┘ │
    │   Morning   │
    │   • Activity│
    │   Afternoon │
    │   • Activity│
    ├─────────────┤
      ┌─────────┐
    ├─┤  Day 2  ├─┤
    │ └─────────┘ │
```
- Connected with gradient line
- Day cards: Glass with day number badge
- Activities: Indented glass mini-cards
- Time stamps: Monospace font, muted color
- Icons: Custom travel icons (plane, hotel, food, activity)

### 8. Collaborative Features
**Design**: Real-time indicators and avatars
- User avatars: Circular, 40px, stacked with overlap
- Live cursor: Colored cursor with username label
- Activity feed: Glass sidebar with live updates
- Notifications: Floating glass toast notifications

---

## 3D Elements & Visual Effects

### 1. **3D City Sphere** (Hero)
- Location: Landing page hero, right side
- Sphere radius: 350px
- Images: 30 circular city photos (80px each)
- Distribution: Fibonacci sphere algorithm
- Interaction: Drag to rotate, momentum physics
- Lighting: Depth-based opacity (front brighter, back faded)
- Shadow: Triple-layer drop shadow for depth

### 2. **Animated Route Path** (Map)
- 3D arc connecting cities
- Gradient color from origin to destination
- Animated travel direction indicator
- Pulsing waypoint markers

### 3. **Floating Cards** (Dashboard)
- Subtle 3D tilt on hover
- Perspective: 1000px
- Rotation: Max 10deg based on mouse position
- Shadow: Dynamic shadow that moves with tilt

### 4. **Parallax Scroll Effects**
- Background elements move slower than foreground
- Create depth illusion
- Apply to hero background, feature sections

### 5. **Loading States**
- Animated plane flying across screen
- Spinning globe loader
- Skeleton screens with shimmer effect

### 6. **Transition Animations**
- Page transitions: Slide with fade
- Card entrance: Stagger from bottom
- Route animations: Path drawing animation

---

## Page Layouts

### Landing Page
```
┌────────────────────────────────────────┐
│  GLASS NAVIGATION                      │
├────────────────────────────────────────┤
│                                        │
│  HERO SECTION (100vh)                  │
│  [Content Left | 3D Sphere Right]      │
│                                        │
├────────────────────────────────────────┤
│  FEATURES SECTION                      │
│  [2x2 Glass Card Grid]                 │
├────────────────────────────────────────┤
│  HOW IT WORKS                          │
│  [Timeline: Plan → Collaborate → Go]   │
├────────────────────────────────────────┤
│  TESTIMONIALS                          │
│  [Carousel of glass cards]             │
├────────────────────────────────────────┤
│  CTA SECTION                           │
│  [Centered with button]                │
├────────────────────────────────────────┤
│  FOOTER (Glass, transparent)           │
└────────────────────────────────────────┘
```

### Dashboard
```
┌────────────────────────────────────────┐
│  GLASS NAVIGATION                      │
├────┬───────────────────────────────────┤
│ S  │  DASHBOARD HEADER                 │
│ I  │  [Stats: Active Trips | Budget]   │
│ D  ├───────────────────────────────────┤
│ E  │  YOUR TRIPS                       │
│ B  │  ┌─────┐ ┌─────┐ ┌─────┐         │
│ A  │  │Trip │ │Trip │ │Trip │         │
│ R  │  │Card │ │Card │ │Card │         │
│    │  └─────┘ └─────┘ └─────┘         │
│ G  ├───────────────────────────────────┤
│ L  │  UPCOMING ACTIVITIES              │
│ A  │  [Timeline list]                  │
│ S  │                                   │
│ S  │                                   │
└────┴───────────────────────────────────┘
```

### Trip Planning Workspace
```
┌────────────────────────────────────────┐
│  TRIP NAVIGATION (Tabs: Itinerary |   │
│  Map | Expenses | Collaborators)       │
├────────────────────────┬───────────────┤
│                        │               │
│  ITINERARY (Timeline)  │  INFO PANEL   │
│                        │  [Glass Card] │
│  ┌─────────┐          │  • Dates      │
│  │  Day 1  │          │  • Budget     │
│  │Activities│          │  • People     │
│  └─────────┘          │  • Status     │
│  ┌─────────┐          │               │
│  │  Day 2  │          │  [Map Preview]│
│  └─────────┘          │               │
│                        │  [Actions]    │
│  [+ Add Day]           │               │
│                        │               │
└────────────────────────┴───────────────┘
```

### Map View
```
┌────────────────────────────────────────┐
│  [Full-screen Google Map]              │
│                                        │
│  ┌─────────┐ (Floating Controls)      │
│  │ Search  │                           │
│  └─────────┘                           │
│                                        │
│  [City Markers with photos]            │
│  [Route lines between cities]          │
│                                        │
│  ┌──────────────────────┐ (Bottom)    │
│  │ Selected Place Card  │              │
│  │ [Image | Info | Add] │              │
│  └──────────────────────┘              │
└────────────────────────────────────────┘
```

### AI Generator
```
┌────────────────────────────────────────┐
│  AI TRIP PLANNER                       │
├────────────────────────────────────────┤
│                                        │
│  [Chat interface with messages]        │
│                                        │
│  User: "Plan 5 days in Tokyo"          │
│                                        │
│  AI: "I've created an itinerary..."    │
│  ┌────────────────────────┐           │
│  │ TOKYO ITINERARY        │           │
│  │ Day 1: Arrival         │           │
│  │ Day 2: Culture         │           │
│  │ [View Full | Edit]     │           │
│  └────────────────────────┘           │
│                                        │
├────────────────────────────────────────┤
│  [Input field] [Send button]           │
└────────────────────────────────────────┘
```

---

## Responsive Design

### Breakpoints
```css
--mobile: 480px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1440px;
```

### Mobile Adaptations
- **Navigation**: Hamburger menu with slide-in drawer
- **3D Sphere**: Reduce size to 250px, center below hero text
- **Grid layouts**: Single column
- **Glass effects**: Reduce blur for performance (20px instead of 40px)
- **Custom cursor**: Disabled on touch devices
- **Tilt effects**: Disabled on mobile

---

## Animation System

### Timing Functions
```css
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1);
--ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
--ease-elastic: cubic-bezier(0.68, -0.6, 0.32, 1.6);
```

### Standard Transitions
- **Fast**: 150ms (hover states, clicks)
- **Medium**: 300ms (cards, modals)
- **Slow**: 600ms (page transitions, complex animations)

### Scroll Animations (GSAP ScrollTrigger)
- **Fade In Up**: Start 80% viewport, duration 0.8s
- **Stagger**: 0.15s between items
- **Parallax**: -50px to 50px range

### Micro-interactions
- **Button Press**: Scale 0.95, duration 150ms
- **Card Hover**: Translate Y -8px, shadow increase
- **Input Focus**: Border glow, scale 1.02
- **Loading**: Pulse opacity 0.5-1, infinite

---

## Accessibility

### Color Contrast
- Minimum 4.5:1 for normal text
- Minimum 3:1 for large text
- Test all accent colors against backgrounds

### Focus States
- Visible outline on all interactive elements
- Outline: 2px solid ocean-blue with 2px offset
- Skip to content link for keyboard users

### Screen Readers
- Semantic HTML (header, nav, main, aside, footer)
- ARIA labels for icon-only buttons
- Alt text for all images
- Live regions for dynamic content updates

### Keyboard Navigation
- Tab order follows visual order
- Arrow keys for custom components
- Escape to close modals
- Enter/Space for button activation

---

## Performance Considerations

### Image Optimization
- City photos: WebP format, 400x400px max
- Lazy loading for below-fold images
- Blur placeholder while loading
- Responsive srcset for different screen sizes

### Animation Performance
- Use `transform` and `opacity` only (GPU accelerated)
- `will-change` for elements that will animate
- Reduce motion for users with prefers-reduced-motion
- RequestAnimationFrame for custom animations

### Glass Effects
- Limit backdrop-filter to visible areas only
- Reduce blur on mobile (40px → 20px)
- Disable on older browsers with graceful fallback

### Code Splitting
- Route-based code splitting
- Lazy load heavy libraries (Three.js, GSAP)
- Defer non-critical CSS

---

## Dark Mode Support

### Implementation Strategy
- Light mode: Default (white background, black text)
- Dark mode: Toggle in settings
- System preference detection
- Persistent user choice in localStorage

### Dark Mode Colors
```css
/* Dark Mode Variables */
--dm-background: #000000;
--dm-surface: #0a0a0a;
--dm-text: #ffffff;
--dm-text-secondary: rgba(255, 255, 255, 0.7);

/* Glass in Dark Mode */
--dm-glass: rgba(26, 26, 26, 0.6);
--dm-glass-border: rgba(255, 255, 255, 0.1);
```

---

## Design Tokens (Final Reference)

```javascript
export const tokens = {
  colors: {
    black: '#000000',
    white: '#ffffff',
    oceanBlue: '#0077be',
    skyBlue: '#63b3ed',
    sunsetOrange: '#ff6b35',
    goldenHour: '#f7931e',
    mint: '#52b788',
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
    xxxl: '64px',
  },

  borderRadius: {
    sm: '8px',
    md: '12px',
    lg: '20px',
    xl: '28px',
    full: '9999px',
  },

  shadows: {
    glass: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
    card: '0 4px 24px rgba(0, 0, 0, 0.08)',
    elevated: '0 12px 48px rgba(0, 0, 0, 0.12)',
  },

  blur: {
    sm: '20px',
    md: '40px',
    lg: '60px',
  },
};
```

---

## Summary

This design system prioritizes:
✅ **Visual Clarity**: Glass morphism without sacrificing readability
✅ **Premium Feel**: Sophisticated black/white with strategic color use
✅ **Travel Context**: Colors and imagery evoke exploration
✅ **Smooth Interactions**: Every animation feels intentional and polished
✅ **Accessibility**: WCAG AA compliance throughout
✅ **Performance**: Optimized for smooth 60fps experiences

The TripMosaic UI should feel like a luxury travel magazine that came to life - elegant, inspiring, and effortlessly functional.
