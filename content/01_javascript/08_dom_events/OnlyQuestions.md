# DOM & Events

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Event Delegation

**Question:**
You have a dynamically generated list of 1000 items. A junior developer attaches a click handler to each `<li>`. What is wrong with this approach and how would you fix it using event delegation?

### 2. `preventDefault()` vs `stopPropagation()`

**Question:**
You have a form inside a modal. Clicking "Submit" should validate the form without refreshing the page, and clicking the modal backdrop should close the modal without triggering form submission. Which methods do you use for each behavior?

---

## 🟡 Intermediate

### 1. Event Bubbling & Capturing

**Question:**
Explain the three phases of event propagation. Given three nested `<div>` elements, each with a click handler, what order do the handlers fire in? How would you change the order using `{ capture: true }`?

### 2. `innerHTML` vs `textContent` Security

**Question:**
Your application renders user-generated content. A developer uses `element.innerHTML = userInput`. What security vulnerability does this introduce? How do you safely render user content?

### 3. MutationObserver

**Question:**
You're building a browser extension that needs to react whenever a specific element is added to the page by a third-party script. How would you use `MutationObserver` for this? Why is it preferred over polling with `setInterval`?

---

## 🔴 Advanced

### 1. Custom Events

**Question:**
Design a loosely-coupled notification system using `CustomEvent` and `EventTarget`. Components should be able to publish and subscribe to events without direct references to each other. What are the advantages over a simple pub/sub object?

### 2. Virtual DOM vs Direct DOM Manipulation

**Question:**
Explain why React uses a Virtual DOM instead of directly manipulating the DOM. What are the performance trade-offs? When is direct DOM manipulation actually faster than React?

### 3. `requestAnimationFrame` & `requestIdleCallback`

**Question:**
You need to animate a progress bar smoothly and also process a large dataset in the background without blocking the UI. Which APIs do you use for each task and why? What happens if you use `setTimeout` for animation instead?
