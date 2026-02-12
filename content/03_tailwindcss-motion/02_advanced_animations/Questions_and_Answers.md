# Advanced Tailwind CSS Animations

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Combining Multiple Animations

**Question:**
Combine multiple motion presets on one element.

**Answer:**

```html
<!-- Combine fade + slide + scale -->
<div
  class="motion-preset-fade-in motion-preset-slide-up motion-preset-expand motion-duration-500"
>
  Combined animation
</div>

<!-- Combine with different timings -->
<div
  class="
  motion-preset-fade-in motion-duration-300
  motion-preset-slide-up motion-duration-500
"
>
  Different durations per property
</div>
```

**The plugin composes CSS `@keyframes` together** — each preset adds its animation to the element's `animation` shorthand property.

---

### 2. Responsive Animations

**Question:**
Different animations at different breakpoints.

**Answer:**

```html
<!-- No animation on mobile, fade on tablet, slide on desktop -->
<div
  class="
  motion-preset-none
  md:motion-preset-fade-in
  lg:motion-preset-slide-up
"
>
  Responsive animation
</div>

<!-- Shorter duration on mobile -->
<div
  class="
  motion-preset-fade-in
  motion-duration-200
  md:motion-duration-500
"
>
  Faster on mobile
</div>
```

**Disable all animations on mobile** for better performance on low-end devices.

---

## 🟡 Intermediate

### 1. Scroll-Driven Animations

**Question:**
Scroll-triggered animations without JavaScript.

**Answer:**

```html
<!-- CSS scroll-driven animation (modern browsers) -->
<div class="motion-preset-fade-in motion-timeline-scroll">
  Animates as you scroll
</div>
```

**Under the hood**, this uses the CSS `animation-timeline: scroll()` property (supported in Chrome 115+, Firefox 110+):

```css
.motion-timeline-scroll {
  animation-timeline: scroll();
  animation-range: entry 0% entry 100%;
}
```

**Fallback for unsupported browsers:** Use Intersection Observer with a simple fade class toggle:

```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("motion-preset-fade-in");
      }
    });
  },
  { threshold: 0.1 },
);
```

---

### 2. Animation States with Variants

**Question:**
Animations for hover, focus, and group states.

**Answer:**

```html
<!-- Hover animation -->
<button class="hover:motion-preset-expand motion-duration-200">
  Grows on hover
</button>

<!-- Group hover — child animates when parent is hovered -->
<div class="group">
  <img class="group-hover:motion-preset-slide-up motion-duration-300" />
  <p class="group-hover:motion-preset-fade-in motion-delay-100">
    Caption slides in when card is hovered
  </p>
</div>

<!-- Focus animation for form inputs -->
<input class="focus:motion-preset-expand motion-duration-150" />
```

---

## 🔴 Advanced

### 1. Complex Choreographed Sequences

**Question:**
Landing page hero with sequential animations.

**Answer:**

```html
<section class="relative overflow-hidden">
  <!-- 1. Background fades in first -->
  <div
    class="absolute inset-0 bg-linear-to-br from-blue-900 to-purple-900
    motion-preset-fade-in motion-duration-1000"
  ></div>

  <!-- 2. Title slides up (delayed 300ms) -->
  <h1
    class="text-6xl font-bold
    motion-preset-slide-up motion-preset-fade-in
    motion-duration-700 motion-delay-300"
  >
    Build the Future
  </h1>

  <!-- 3. Subtitle fades in (delayed 600ms) -->
  <p
    class="text-xl text-gray-300
    motion-preset-fade-in
    motion-duration-500 motion-delay-600"
  >
    Modern tools for modern developers
  </p>

  <!-- 4. CTA button scales in (delayed 900ms) -->
  <button
    class="px-8 py-4 bg-blue-500 rounded-lg
    motion-preset-expand motion-preset-fade-in
    motion-duration-500 motion-delay-900
    hover:motion-preset-expand motion-ease-spring"
  >
    Get Started
  </button>
</section>
```

**Key technique:** Incremental `motion-delay-*` values create the sequential effect. Each element waits for the previous to start before beginning its own animation.

---

### 2. Accessibility & Reduced Motion

**Question:**
Respecting `prefers-reduced-motion`.

**Answer:**

```html
<!-- Using motion-reduce variant -->
<div
  class="
  motion-preset-slide-up motion-duration-500
  motion-reduce:motion-preset-none
  motion-reduce:opacity-100
"
>
  Respects user preferences
</div>

<!-- Global approach — disable all animations -->
<div class="motion-reduce:*:motion-preset-none">
  <!-- All children lose animations when reduced motion is preferred -->
</div>
```

**CSS behind the variant:**

```css
@media (prefers-reduced-motion: reduce) {
  .motion-reduce\:motion-preset-none {
    animation: none !important;
    transition: none !important;
  }
}
```

**Best practices:**

- Always provide `motion-reduce` alternatives.
- Use `motion-safe` for optional enhancements (animations that only appear if user hasn't requested reduced motion).
- Never gate critical information behind animations.
- Test with "Reduce motion" enabled in OS accessibility settings.
