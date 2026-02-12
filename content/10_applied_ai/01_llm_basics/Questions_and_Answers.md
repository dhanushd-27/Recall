# Applied AI & LLM Basics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. What Are LLMs?

**Question:** Understanding LLMs at a high level.

**Answer:**

| Concept            | Explanation                                                                      |
| ------------------ | -------------------------------------------------------------------------------- |
| **Transformer**    | Neural network architecture that processes text in parallel using self-attention |
| **Token**          | Smallest unit of text (~4 chars in English). "Hello world" ≈ 2 tokens            |
| **Context window** | Max tokens the model can process at once (input + output)                        |
| **Temperature**    | Randomness control: 0 = deterministic, 1 = creative, 2 = chaotic                 |
| **Parameters**     | Model size (GPT-4: ~1.8T, Llama 3: 70B, Gemini: unknown)                         |

**Model comparison (2026):**

| Model             | Strengths                      | Context | Best for               |
| ----------------- | ------------------------------ | ------- | ---------------------- |
| GPT-4o            | General reasoning, coding      | 128K    | General purpose        |
| Claude 3.5 Sonnet | Long documents, safety, coding | 200K    | Complex analysis       |
| Gemini 2.0        | Multimodal, Google integration | 2M      | Large context tasks    |
| Llama 3           | Open source, self-hosted       | 128K    | Privacy, customization |

---

### 2. Prompt Engineering

**Question:** Effective prompting techniques.

**Answer:**

**Zero-shot:** No examples.

```
Classify the sentiment: "This product is amazing!" → Positive
```

**Few-shot:** Provide examples.

```
Classify the sentiment:
"Great service!" → Positive
"Terrible experience" → Negative
"It was okay" → Neutral
"This product is amazing!" → ?
```

**Chain-of-thought:** Ask the model to reason step by step.

```
Solve step by step:
A store has 23 apples. They receive 3 boxes of 12 apples each, then sell 15.
How many remain?

Step 1: Starting apples = 23
Step 2: New apples = 3 × 12 = 36
Step 3: Total = 23 + 36 = 59
Step 4: After selling = 59 - 15 = 44
```

**Good system prompts:**

- Define role and persona clearly.
- Specify output format (JSON, markdown, etc.).
- Set constraints and boundaries.
- Provide examples of desired behavior.

---

## 🟡 Intermediate

### 1. RAG

**Question:** When and how to use RAG.

**Answer:**

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Documents│ →  │  Chunk   │ →  │  Embed   │ →  │  Store   │
│ (PDF,MD) │    │ (512 tok)│    │ (vectors)│    │ (VectorDB)│
└──────────┘    └──────────┘    └──────────┘    └──────────┘

     User Query → Embed → Search Vector DB → Top K results → LLM + Context → Answer
```

**Pipeline steps:**

1. **Chunk:** Split documents into ~512-token overlapping chunks.
2. **Embed:** Convert chunks to vector representations using embedding models.
3. **Store:** Index vectors in a vector database.
4. **Retrieve:** Find top-K most similar chunks to the user's query.
5. **Generate:** Send retrieved chunks + question to LLM for answer.

| Approach    | When to use                  | Cost | Freshness   |
| ----------- | ---------------------------- | ---- | ----------- |
| RAG         | Dynamic knowledge, many docs | Low  | Real-time   |
| Fine-tuning | Behavior change, style       | High | Snapshot    |
| In-context  | Small, static knowledge      | Free | Per-request |

---

### 2. Working with LLM APIs

**Question:** Production integration.

**Answer:**

```typescript
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// Streaming response
const result = await model.generateContentStream("Explain React hooks");
for await (const chunk of result.stream) {
  process.stdout.write(chunk.text());
}

// Function calling / Tool use
const tools = [
  {
    functionDeclarations: [
      {
        name: "getWeather",
        description: "Get weather for a location",
        parameters: {
          type: "object",
          properties: {
            location: { type: "string", description: "City name" },
          },
          required: ["location"],
        },
      },
    ],
  },
];

const chat = model.startChat({ tools });
const response = await chat.sendMessage("What's the weather in Tokyo?");
// Model responds with function call → you execute → send result back
```

**Production considerations:**

- Rate limiting and retry with exponential backoff.
- Token usage tracking and cost monitoring.
- Content filtering and safety checks.
- Conversation history management (sliding window, summarization).

---

## 🔴 Advanced

### 1. Embeddings & Vector Databases

**Question:** How vector search works.

**Answer:**

```python
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

# Text → 384-dimensional vector
embeddings = model.encode([
    "How to deploy a Next.js app",
    "React Server Components explained",
    "Python async programming",
])

# Cosine similarity — measures angle between vectors
# 1.0 = identical, 0 = unrelated, -1 = opposite
from sklearn.metrics.pairwise import cosine_similarity
similarity = cosine_similarity([query_embedding], embeddings)
```

| Vector DB | Type                 | Best for                         | Hosting              |
| --------- | -------------------- | -------------------------------- | -------------------- |
| pgvector  | PostgreSQL extension | Small-medium, existing Postgres  | Self-hosted          |
| ChromaDB  | Embedded             | Prototyping, local dev           | In-process           |
| Pinecone  | Managed SaaS         | Production, scaling              | Cloud                |
| Weaviate  | Open source          | Hybrid search (vector + keyword) | Self-hosted or cloud |

---

### 2. AI Agent Architecture

**Question:** Building AI agents.

**Answer:**

```
┌─────────────────────────────────────────┐
│                AI Agent                  │
│  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │ Planning  │  │ Memory   │  │ Tools  │ │
│  │ (ReAct)   │  │ (Short/  │  │ (APIs, │ │
│  │           │  │  Long)   │  │  DB,   │ │
│  │           │  │          │  │  Code) │ │
│  └──────────┘  └──────────┘  └────────┘ │
└─────────────────────────────────────────┘
```

**ReAct Pattern (Reason + Act):**

1. **Thought:** "I need to find the user's order status."
2. **Action:** Call `getOrder(orderId)` tool.
3. **Observation:** Order #123 shipped on Feb 10.
4. **Thought:** "I have the info, I can respond."
5. **Answer:** "Your order shipped on February 10th."

**Memory systems:**

- **Short-term:** Conversation history (context window).
- **Long-term:** Vector database of past interactions.
- **Working memory:** Scratchpad for current task reasoning.

| Framework       | Language   | Strengths                            |
| --------------- | ---------- | ------------------------------------ |
| LangChain       | Python/JS  | Largest ecosystem, many integrations |
| LlamaIndex      | Python     | Best for RAG/data indexing           |
| Vercel AI SDK   | JavaScript | Best for Next.js/React streams       |
| Semantic Kernel | C#/Python  | Microsoft ecosystem                  |
