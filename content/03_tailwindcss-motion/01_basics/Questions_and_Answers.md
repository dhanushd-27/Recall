# Tailwind CSS Motion Basics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. What is Tailwind CSS Motion?

**Question:**
What is the `tailwindcss-motion` plugin? How does it differ from Tailwind's built-in `transition` and `animate` utilities?

**Answer:**
`tailwindcss-motion` is a plugin that adds declarative animation utilities to Tailwind CSS, inspired by Framer Motion's API but implemented as pure CSS utilities.

| Feature               | Built-in Tailwind               | tailwindcss-motion   |
| --------------------- | ------------------------------- | -------------------- |
| Transitions           | `transition-*`, `duration-*`    | Same + enhanced      |
| Keyframe animations   | `animate-spin`, `animate-pulse` | Much more variety    |
| Enter/exit animations | ❌                              | ✅ `motion-preset-*` |
| Spring physics        | ❌                              | ✅ `motion-spring-*` |
| Scroll-driven         | ❌                              | ✅                   |

```html
<!-- Built-in Tailwind -->
<div class="transition-all duration-300 hover:scale-105">Hover me</div>

<!-- tailwindcss-motion -->
<div class="motion-preset-fade-in motion-duration-500">Fades in on mount</div>
```

---

### 2. Basic Motion Presets

**Question:**
List the most commonly used motion presets and explain when to use each.

**Answer:**

```html
<!-- Fade -->
<div class="motion-preset-fade-in">Fade in</div>
<div class="motion-preset-fade-out">Fade out</div>

<!-- Slide -->
<div class="motion-preset-slide-up">Slide up</div>
<div class="motion-preset-slide-down">Slide down</div>
<div class="motion-preset-slide-left">Slide from left</div>
<div class="motion-preset-slide-right">Slide from right</div>

<!-- Scale -->
<div class="motion-preset-expand">Scale up from small</div>
<div class="motion-preset-shrink">Scale down from large</div>

<!-- Combined -->
<div class="motion-preset-fade-in motion-preset-slide-up">Fade + slide up</div>
```

**Use cases:**

- **Fade:** Content appearing/disappearing (modals, toasts).
- **Slide:** Navigation menus, drawers, page transitions.
- **Scale:** Buttons, cards, interactive elements.

---

## 🟡 Intermediate

### 1. Duration, Delay & Easing

**Question:**
How do you control animation timing with tailwindcss-motion? Explain the differences between linear, ease-in, ease-out, and spring easing.

**Answer:**

```html
<!-- Duration -->
<div class="motion-preset-fade-in motion-duration-300">Fast (300ms)</div>
<div class="motion-preset-fade-in motion-duration-1000">Slow (1000ms)</div>

<!-- Delay -->
<div class="motion-preset-fade-in motion-delay-200">Delayed 200ms</div>

<!-- Easing -->
<div class="motion-preset-fade-in motion-ease-linear">Linear</div>
<div class="motion-preset-fade-in motion-ease-in">Ease in (slow start)</div>
<div class="motion-preset-fade-in motion-ease-out">Ease out (slow end)</div>
<div class="motion-preset-fade-in motion-ease-in-out">Ease in-out</div>
<div class="motion-preset-fade-in motion-ease-spring">Spring physics</div>
```

| Easing        | Behavior              | Best for                         |
| ------------- | --------------------- | -------------------------------- |
| `linear`      | Constant speed        | Progress bars, loading           |
| `ease-in`     | Slow start            | Elements exiting                 |
| `ease-out`    | Slow end              | Elements entering (most natural) |
| `ease-in-out` | Slow start + end      | Symmetrical animations           |
| `spring`      | Bouncy, physics-based | Interactive elements, buttons    |

---

### 2. Staggered Animations

**Question:**
How do you create staggered animations for a list of items (e.g., a card grid that animates in one by one)?

**Answer:**

```html
<div class="grid grid-cols-3 gap-4">
  <div class="motion-preset-fade-in motion-delay-0">Card 1</div>
  <div class="motion-preset-fade-in motion-delay-100">Card 2</div>
  <div class="motion-preset-fade-in motion-delay-200">Card 3</div>
  <div class="motion-preset-fade-in motion-delay-300">Card 4</div>
</div>
```

**With React (dynamic stagger):**

```jsx
{
  items.map((item, i) => (
    <div
      key={item.id}
      className="motion-preset-fade-in motion-preset-slide-up"
      style={{ animationDelay: `${i * 100}ms` }}
    >
      {item.name}
    </div>
  ));
}
```

---

## 🔴 Advanced

### 1. Custom Motion Configurations

**Question:**
How do you extend the tailwindcss-motion plugin with custom presets and animations in `tailwind.config.js`?

**Answer:**

```javascript
// tailwind.config.js
module.exports = {
  plugins: [require("tailwindcss-motion")],
  theme: {
    extend: {
      motion: {
        "custom-bounce": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
    },
  },
};
```

```html
<div class="motion-custom-bounce motion-duration-500 motion-iteration-infinite">
  Custom bouncing element
</div>
```

### 2. Performance Considerations

**Question:**
What CSS properties trigger layout vs paint vs composite? How does this affect animation performance? Which tailwindcss-motion utilities are GPU-accelerated?

**Answer:**

| Layer     | Properties                             | Cost         | GPU |
| --------- | -------------------------------------- | ------------ | --- |
| Layout    | `width`, `height`, `margin`, `padding` | ❌ Expensive | ❌  |
| Paint     | `background`, `color`, `box-shadow`    | ⚠️ Medium    | ❌  |
| Composite | `transform`, `opacity`                 | ✅ Cheap     | ✅  |

**All tailwindcss-motion presets use `transform` and `opacity`** — they're GPU-accelerated by default.

**Rules for smooth 60fps animations:**

- ✅ Animate `transform` and `opacity` only.
- ❌ Avoid animating `width`, `height`, `margin`, `top`, `left`.
- Use `will-change: transform` sparingly (only on elements about to animate).
- Use `content-visibility: auto` for off-screen elements.
