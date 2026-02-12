# DOM & Events

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Event Delegation

**Question:**
You have a list of 1000 items. How do you handle clicks efficiently using event delegation?

**Answer:**
Instead of attaching 1000 listeners, attach **one** to the parent:

```javascript
// ❌ Bad — 1000 event listeners
document.querySelectorAll("li").forEach((li) => {
  li.addEventListener("click", handleClick);
});

// ✅ Good — 1 event listener
document.querySelector("ul").addEventListener("click", (e) => {
  const li = e.target.closest("li"); // Find the clicked <li>
  if (!li) return; // Click was not on an <li>
  handleClick(li);
});
```

**Why delegation is better:**

- **Memory:** 1 listener vs 1000 listeners.
- **Dynamic content:** New `<li>` elements automatically handled without re-attaching listeners.
- **Cleanup:** Only one listener to remove.

**`e.target.closest("li")`** is critical — `e.target` might be a `<span>` _inside_ the `<li>`. `.closest()` walks up the DOM to find the matching parent.

---

### 2. `preventDefault()` vs `stopPropagation()`

**Question:**
Form inside a modal — prevent form refresh and stop click propagation.

**Answer:**

```javascript
// Prevent form from refreshing the page
form.addEventListener("submit", (e) => {
  e.preventDefault(); // Stops the browser's default form submission
  validateAndSubmit();
});

// Close modal on backdrop click without triggering form events
backdrop.addEventListener("click", (e) => {
  e.stopPropagation(); // Stops event from reaching child elements
  closeModal();
});
```

| Method                       | What it does                                                  | Example                                                        |
| ---------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------- |
| `preventDefault()`           | Stops the **browser's default action**                        | Prevents page reload on form submit, prevents link navigation  |
| `stopPropagation()`          | Stops the event from **bubbling up** to parent elements       | Prevents backdrop click from triggering inner element handlers |
| `stopImmediatePropagation()` | Same as above + stops **other listeners on the same element** | When multiple handlers on one element, stop remaining ones     |

---

## 🟡 Intermediate

### 1. Event Bubbling & Capturing

**Question:**
Three nested divs with click handlers — what order do they fire?

**Answer:**
Events propagate through **three phases:**

```
1. CAPTURE phase: Window → Document → HTML → Body → Outer → Middle → Inner
2. TARGET phase: The actual clicked element
3. BUBBLE phase: Inner → Middle → Outer → Body → HTML → Document → Window
```

```javascript
outer.addEventListener("click", () => console.log("Outer"), false); // Bubble (default)
middle.addEventListener("click", () => console.log("Middle"), true); // Capture
inner.addEventListener("click", () => console.log("Inner"), false); // Bubble
```

**Click on inner → output:** `Middle` (capture), `Inner` (target), `Outer` (bubble)

**When to use capture:** Intercepting events before they reach child elements — useful for global keyboard shortcuts, analytics tracking, or preventing child handlers from running.

---

### 2. `innerHTML` vs `textContent` Security

**Question:**
Why is `innerHTML = userInput` dangerous?

**Answer:**

```javascript
// ❌ XSS vulnerability
const userInput = '<img src=x onerror="alert(document.cookie)">';
element.innerHTML = userInput; // Executes JavaScript!

// ✅ Safe — textContent treats everything as raw text
element.textContent = userInput; // Renders as literal string

// ✅ Safe — DOM API
const textNode = document.createTextNode(userInput);
element.appendChild(textNode);
```

**`innerHTML`** parses HTML and executes embedded scripts/event handlers = **XSS vector**.
**`textContent`** sets raw text, no HTML parsing = **safe**.

| Method        | Parses HTML | XSS Risk | Performance               |
| ------------- | ----------- | -------- | ------------------------- |
| `innerHTML`   | ✅ Yes      | ⚠️ High  | Slower (parse + render)   |
| `textContent` | ❌ No       | ✅ Safe  | Faster                    |
| `innerText`   | ❌ No       | ✅ Safe  | Slowest (triggers reflow) |

**For rendering HTML safely:** Use a sanitizer like DOMPurify: `element.innerHTML = DOMPurify.sanitize(userInput)`.

---

### 3. MutationObserver

**Question:**
Detect when elements are added to the DOM by third-party scripts.

**Answer:**

```javascript
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.matches?.(".target-class")) {
        console.log("Target element added:", node);
        handleNewElement(node);
      }
    }
  }
});

observer.observe(document.body, {
  childList: true, // Watch for added/removed children
  subtree: true, // Watch entire subtree, not just direct children
});

// Cleanup
observer.disconnect();
```

**Why MutationObserver > `setInterval` polling:**

- **Efficiency:** Only fires when actual changes occur.
- **Timing:** Batches mutations and fires after microtask queue.
- **No missed changes:** Polling can miss rapid changes between intervals.

---

## 🔴 Advanced

### 1. Custom Events

**Question:**
Design a notification system with `CustomEvent`.

**Answer:**

```javascript
// Event bus (can be any EventTarget)
const bus = new EventTarget();

// Publisher — no knowledge of subscribers
function publishNotification(message, type = "info") {
  bus.dispatchEvent(
    new CustomEvent("notification", {
      detail: { message, type, timestamp: Date.now() },
    }),
  );
}

// Subscriber — no knowledge of publishers
bus.addEventListener("notification", (e) => {
  const { message, type } = e.detail;
  showToast(message, type);
});

// Usage
publishNotification("File saved", "success");
```

**Advantages over pub/sub object:**

- Uses the browser's native event system — no custom implementation needed.
- Supports `once`, `passive`, `capture` options.
- Works with `AbortController` for easy cleanup.
- Can bubble through the DOM if dispatched on DOM elements.

---

### 2. Virtual DOM vs Direct DOM

**Question:**
Why does React use a Virtual DOM?

**Answer:**

**The problem:** DOM operations are slow because each change can trigger layout recalculation, style computation, and repaint.

**Virtual DOM strategy:**

1. Build a lightweight JS object representation of the DOM.
2. When state changes, create a new VDOM tree.
3. **Diff** the new tree against the old one.
4. **Batch** the minimal set of real DOM changes.

**When direct DOM is faster:**

- Simple, targeted updates (toggle a class, update text).
- Animation frames (VDOM diffing overhead is wasteful for 60fps updates).
- Static pages with rare updates.
- Frameworks like Svelte and SolidJS compile away the VDOM entirely.

**Real-world consideration:** React's VDOM is not about being "fast" — it's about making complex UI state manageable. The diffing overhead is a trade-off for developer experience.

---

### 3. `requestAnimationFrame` & `requestIdleCallback`

**Question:**
Animate smoothly AND process data without blocking the UI.

**Answer:**

```javascript
// ✅ Smooth animation — synced to display refresh rate
function animateProgress(target) {
  let current = 0;
  function step() {
    current += 1;
    progressBar.style.width = `${current}%`;
    if (current < target) {
      requestAnimationFrame(step); // Next frame (~16ms for 60fps)
    }
  }
  requestAnimationFrame(step);
}

// ✅ Background data processing — uses idle time
function processLargeDataset(items) {
  let index = 0;

  function processChunk(deadline) {
    while (index < items.length && deadline.timeRemaining() > 1) {
      processItem(items[index]);
      index++;
    }
    if (index < items.length) {
      requestIdleCallback(processChunk); // Continue when browser is idle
    }
  }
  requestIdleCallback(processChunk);
}
```

| API                     | When it runs                         | Use case                   |
| ----------------------- | ------------------------------------ | -------------------------- |
| `requestAnimationFrame` | Before next repaint (~60fps)         | Animations, visual updates |
| `requestIdleCallback`   | When browser is idle                 | Non-urgent background work |
| `setTimeout(fn, 0)`     | Next macrotask (after current frame) | ❌ Not synced to repaint   |

**Why `setTimeout` is bad for animation:** It's not synced to the screen's refresh rate, causing janky animation. `requestAnimationFrame` guarantees the callback runs just before the browser paints, producing smooth 60fps animation.
