# LLM Basics - Questions and Answers

1. **What is a Large Language Model (LLM)?**

   An LLM is a type of AI trained on vast amounts of text data to understand and generate human-like language. They are based on the Transformer architecture and use statistical patterns to predict the next token in a sequence.

---

2. **Explain what "Tokens" are in the context of LLMs.**

   Tokens are the basic units of text that an LLM processes. A token can be a single character, a part of a word, or a whole word. For example, the word "apple" might be one token, while "unbelievable" might be split into multiple tokens.

---

3. **What does "Temperature" do in LLM sampling?**

   Temperature is a parameter that controls the randomness of the model's output.
   - **Low Temperature (e.g., 0.1)**: Makes the model more deterministic and focused, choosing the most likely tokens.
   - **High Temperature (e.g., 0.8)**: Makes the model more creative and diverse, allowing it to choose less likely tokens.

---

4. **What is "Prompt Engineering"?**

   Prompt Engineering is the practice of carefully crafting inputs (prompts) to guide an LLM to produce the most accurate, relevant, and useful outputs. It involves choosing the right words, instructions, and context.

---

5. **Explain the difference between "Zero-shot", "One-shot", and "Few-shot" prompting.**
   - **Zero-shot**: Asking the model to perform a task without providing any examples.
   - **One-shot**: Providing exactly one example of the task in the prompt.
   - **Few-shot**: Providing multiple examples (typically 2-5) of the task in the prompt to help the model identify the pattern.

---

6. **What is "RAG" (Retrieval-Augmented Generation)?**

   RAG is a technique where an LLM's response is grounded in external, verified facts retrieved from a knowledge base (like a database or document set). It helps prevent "hallucinations" and allows the model to answer questions about specific, private, or very recent data.
