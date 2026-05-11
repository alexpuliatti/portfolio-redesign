# Gradient Components Library

A React library for dynamic, animated, and glow-enabled gradient UI primitives.

---

## Installation

This library requires `framer-motion` as a peer dependency:

```bash
npm install framer-motion
```

Import components:
```jsx
import { GradientLine, GradientDivider, GradientBorder, GradientUnderline } from './components/ui';
import { useImageColors } from './hooks/useImageColors';
```

---

## Components

### `<GradientLine />`

The core primitive. A single gradient line supporting vertical/horizontal orientation, multiple animation modes, tapering, segmentation, flow, and glow effects.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | string | `linear-gradient(...)` | CSS background gradient. |
| `orientation` | string | `'vertical'` | `'vertical'` or `'horizontal'`. |
| `thickness` | string | `'4px'` | Minor-axis dimension. |
| `length` | string | `'100%'` | Major-axis dimension. Supports viewport units. |
| `origin` | string | `'top'` | CSS `transform-origin`. |
| `animation` | string | `'none'` | `'none'` \| `'entrance'` \| `'scroll'` \| `'flow'` \| `'breathe'` \| `'draw'`. |
| `scrollProgress` | MotionValue | `null` | External Framer Motion scroll progress value. |
| `glow` | boolean | `false` | Enables neon pulse glow effect. |
| `taper` | string | `null` | `'start'` \| `'end'` \| `'both'` — fades line to a point using CSS masks. |
| `segments` | number | `0` | If > 0, renders as dashed segments via mask. |
| `flowSpeed` | number | `0` | Seconds for one full gradient flow cycle. |
| `delay` | number | `0` | Animation delay in seconds. |
| `className` | string | `''` | Additional CSS classes. |
| `style` | object | `{}` | Additional inline styles. |

#### Animation Modes

- **`none`** — Static line, no animation.
- **`entrance`** — Fades and scales in on mount. Ideal for section dividers.
- **`scroll`** — Scales from 0→1 as the user scrolls. Uses internal `useScroll` or accepts an external `scrollProgress` MotionValue.
- **`flow`** — Continuously translates the background gradient along the line. Set `flowSpeed` to control speed.
- **`breathe`** — Gentle opacity/scale oscillation. Subtler than `glow`.
- **`draw`** — SVG stroke-dashoffset draw-on effect.

#### Examples

```jsx
// Basic entrance
<GradientLine
  gradient="linear-gradient(to right, #4facfe, #00f2fe)"
  orientation="horizontal"
  thickness="3px"
  length="100%"
  animation="entrance"
/>

// Vertical with glow
<GradientLine
  gradient="linear-gradient(to bottom, #a18cd1, #fbc2eb)"
  thickness="4px"
  length="200px"
  glow={true}
  animation="entrance"
/>

// Flowing gradient with taper
<GradientLine
  gradient="linear-gradient(to bottom, #667eea, #764ba2, #f093fb, #667eea)"
  thickness="4px"
  length="100%"
  flowSpeed={2}
  taper="both"
/>

// Scroll-driven progress track
const { scrollYProgress } = useScroll();
<GradientLine
  gradient="linear-gradient(to bottom, #ff6b6b, #feca57, #48dbfb)"
  thickness="3px"
  length="100vh"
  animation="scroll"
  scrollProgress={scrollYProgress}
/>

// Segmented line
<GradientLine
  gradient="linear-gradient(to bottom, #4facfe, #00f2fe)"
  thickness="3px"
  length="200px"
  segments={6}
  animation="entrance"
/>
```

---

### `<GradientDivider />`

A full-width horizontal section separator with an optional centered label.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | string | `linear-gradient(...)` | CSS gradient. |
| `label` | string | `''` | Optional centered text label. |
| `thickness` | string | `'2px'` | Line thickness. |
| `taper` | string | `'both'` | Taper mode. |
| `animation` | string | `'entrance'` | Animation mode. |
| `glow` | boolean | `false` | Enable glow. |

#### Examples

```jsx
// Simple divider
<GradientDivider gradient="linear-gradient(to right, #4facfe, #00f2fe)" />

// With label
<GradientDivider
  gradient="linear-gradient(to right, #f093fb, #f5576c)"
  label="Chapter 2"
  glow={true}
/>
```

---

### `<GradientBorder />`

Wraps any child element with an animated gradient border.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | string | `linear-gradient(135deg, ...)` | CSS gradient for the border. |
| `thickness` | string | `'2px'` | Border thickness. |
| `radius` | string | `'8px'` | Border radius. |
| `glow` | boolean | `false` | Outer glow effect. |
| `animate` | boolean | `false` | Enable continuous gradient rotation. |
| `speed` | number | `3` | Rotation speed in seconds. |

#### Examples

```jsx
// Static border
<GradientBorder gradient="linear-gradient(135deg, #4facfe, #00f2fe)" radius="12px">
  <div>Your content</div>
</GradientBorder>

// Animated with glow
<GradientBorder
  gradient="linear-gradient(135deg, #4facfe, #00f2fe, #43e97b, #fa709a, #4facfe)"
  thickness="2px"
  animate={true}
  speed={4}
  glow={true}
>
  <div>Animated content</div>
</GradientBorder>
```

---

### `<GradientUnderline />`

An inline text element with an animated gradient underline.

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `gradient` | string | `linear-gradient(...)` | CSS gradient. |
| `thickness` | string | `'2px'` | Underline thickness. |
| `trigger` | string | `'always'` | `'always'` or `'hover'`. |
| `glow` | boolean | `false` | Enable glow on underline. |

#### Examples

```jsx
// Always visible
<GradientUnderline gradient="linear-gradient(to right, #4facfe, #00f2fe)">
  highlighted text
</GradientUnderline>

// Hover triggered
<GradientUnderline
  gradient="linear-gradient(to right, #f093fb, #f5576c)"
  trigger="hover"
>
  hover me
</GradientUnderline>
```

---

## Hooks

### `useImageColors(src, options)`

Extracts dominant colors from an image and returns a CSS `linear-gradient` string.

#### Parameters

| Param | Type | Description |
|-------|------|-------------|
| `src` | string | Image source URL. |
| `options.direction` | string | Gradient direction. Default `'to bottom'`. |
| `options.fallbackGradient` | string | Fallback gradient while loading. |
| `options.samples` | number | Number of color bands (default `5`). |

#### Returns

| Key | Type | Description |
|-----|------|-------------|
| `gradient` | string | Generated CSS gradient string. |
| `isLoaded` | boolean | Whether extraction completed successfully. |

#### Example

```jsx
const { gradient, isLoaded } = useImageColors('/photo.jpg', { samples: 5 });

<GradientLine gradient={gradient} glow={true} />
```

---

## CSS Classes Reference

| Class | Purpose |
|-------|---------|
| `.gradient-line-base` | Core positioning and `will-change`. |
| `.gradient-line-glow` | Neon pulse box-shadow and brightness. |
| `.gradient-line-flow` | Continuous background-position animation. |
| `.gradient-line-breathe` | Gentle opacity oscillation. |
| `.gradient-divider` | Full-width flex container for dividers. |
| `.gradient-divider-label` | Label text styling. |
| `.gradient-border-outer` | Border wrapper with gradient background. |
| `.gradient-border-inner` | Inner content with dark background fill. |
| `.gradient-border-animated` | Rotating gradient animation. |
| `.gradient-border-glow` | Border outer glow. |
| `.gradient-underline` | Inline text wrapper. |
| `.gradient-underline-always` | Always-visible underline. |
| `.gradient-underline-hover` | Hover-triggered underline. |
| `.gradient-underline-glow` | Underline glow effect. |
