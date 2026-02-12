# Go Concurrency

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Goroutines

**Question:** What is a goroutine? How does it differ from a thread? How do you start one and what happens if the main goroutine exits?

### 2. Channels

## **Question:** What is a channel in Go? Explain buffered vs unbuffered channels. How do channels enable communication between goroutines?

## 🟡 Intermediate

### 1. Select Statement

**Question:** What does the `select` statement do? How do you implement timeouts and non-blocking channel operations?

### 2. WaitGroups & Mutexes

## **Question:** When do you use `sync.WaitGroup` vs channels for goroutine coordination? When do you need `sync.Mutex` vs channels for shared state?

## 🔴 Advanced

### 1. Concurrency Patterns

**Question:** Explain the fan-out/fan-in, worker pool, and pipeline patterns in Go. Design a concurrent image processing pipeline.

### 2. Context Package

**Question:** What is `context.Context`? How do you use it for cancellation, timeouts, and passing request-scoped values? Why should every function that does I/O accept a context?
