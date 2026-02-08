# DOM & Events - Questions and Answers

1. **What is event delegation?**

   Event delegation is a technique where you attach a single event listener to a parent element instead of attaching multiple listeners to its children. Due to event bubbling, events on child elements will eventually reach the parent, where you can identify the target element using `event.target`. This improves performance and memory usage, especially for large lists or dynamic content.

---

2. **Explain event bubbling and capturing.**
   - **Event Bubbling**: The default behavior where an event starts from the target element and moves up (bubbles) through its ancestors to the root of the document.
   - **Event Capturing**: The opposite of bubbling; the event starts from the root of the document and moves down to the target element. You can enable this by passing `{ capture: true }` to `addEventListener`.

---

3. **What is `event.preventDefault()` vs `event.stopPropagation()`?**
   - **`event.preventDefault()`**: Prevents the default browser action associated with the event (e.g., prevents a link from navigating or a form from submitting).
   - **`event.stopPropagation()`**: Prevents the event from bubbling up the DOM tree (or capturing down), ensuring that parent event handlers are not triggered.

---

4. **What is the difference between `innerHTML` and `textContent`?**
   - **`innerHTML`**: Gets or sets the HTML markup contained within the element. It can be used to insert HTML elements but can also lead to security issues like XSS if not handled carefully.
   - **`textContent`**: Gets or sets the text content of a node and its descendants. It treats everything as raw text and is safer and faster because it doesn't parse HTML.

---

5. **Explain `DOMContentLoaded` vs `load` event.**
   - **`DOMContentLoaded`**: Fires when the initial HTML document has been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
   - **`load` event**: Fires after the whole page has loaded, including all dependent resources such as stylesheets, images, and frames.
