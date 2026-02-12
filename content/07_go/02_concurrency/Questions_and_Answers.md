# Go Concurrency

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Goroutines

**Question:** Goroutines vs threads.

**Answer:**

```go
// Start a goroutine — just add "go" keyword
go func() {
    fmt.Println("Running concurrently")
}()

// Main goroutine must wait, or program exits
time.Sleep(time.Second) // Bad — use WaitGroup instead
```

| Feature       | Goroutine          | OS Thread    |
| ------------- | ------------------ | ------------ |
| Memory        | ~2KB initial stack | ~1MB stack   |
| Creation cost | Microseconds       | Milliseconds |
| Scheduling    | Go runtime (M:N)   | OS kernel    |
| Max count     | Millions           | Thousands    |

**M:N scheduling:** Go maps M goroutines onto N OS threads, multiplexing efficiently.

---

### 2. Channels

**Question:** Goroutine communication.

**Answer:**

```go
// Unbuffered channel — sender blocks until receiver is ready
ch := make(chan string)
go func() { ch <- "hello" }()
msg := <-ch // Blocks until message arrives

// Buffered channel — sender blocks only when buffer is full
ch := make(chan int, 3)
ch <- 1 // Doesn't block (buffer has space)
ch <- 2
ch <- 3
ch <- 4 // Blocks! Buffer full

// Range over channel
go func() {
    for i := 0; i < 5; i++ { ch <- i }
    close(ch) // Signal no more values
}()
for val := range ch { fmt.Println(val) }
```

**Go proverb:** "Don't communicate by sharing memory; share memory by communicating."

---

## 🟡 Intermediate

### 1. Select Statement

**Question:** Timeouts and multiplexing.

**Answer:**

```go
// Timeout pattern
select {
case result := <-ch:
    fmt.Println("Got result:", result)
case <-time.After(5 * time.Second):
    fmt.Println("Timeout!")
}

// Non-blocking send/receive
select {
case msg := <-ch:
    fmt.Println(msg)
default:
    fmt.Println("No message available")
}

// Multiplexing multiple channels
select {
case msg := <-email:
    sendEmail(msg)
case msg := <-sms:
    sendSMS(msg)
case <-ctx.Done():
    return // Cancelled
}
```

---

### 2. WaitGroups & Mutexes

**Question:** When to use each.

**Answer:**

```go
// WaitGroup — wait for goroutines to finish
var wg sync.WaitGroup
for _, url := range urls {
    wg.Add(1)
    go func(u string) {
        defer wg.Done()
        fetch(u)
    }(url)
}
wg.Wait() // Block until all done

// Mutex — protect shared state
var (
    mu      sync.Mutex
    counter int
)
func increment() {
    mu.Lock()
    defer mu.Unlock()
    counter++ // Safe concurrent access
}
```

| Tool      | Use when                             |
| --------- | ------------------------------------ |
| Channels  | Passing data between goroutines      |
| WaitGroup | Waiting for N goroutines to complete |
| Mutex     | Protecting shared memory             |

---

## 🔴 Advanced

### 1. Concurrency Patterns

**Question:** Worker pool pattern.

**Answer:**

```go
func workerPool(jobs <-chan Job, results chan<- Result, numWorkers int) {
    var wg sync.WaitGroup
    for i := 0; i < numWorkers; i++ {
        wg.Add(1)
        go func(id int) {
            defer wg.Done()
            for job := range jobs {
                result := process(job) // CPU-intensive work
                results <- result
            }
        }(i)
    }
    wg.Wait()
    close(results)
}

// Pipeline pattern
func pipeline() {
    numbers := generate(1, 2, 3, 4, 5)    // Stage 1: produce
    squared := square(numbers)              // Stage 2: transform
    for result := range squared {           // Stage 3: consume
        fmt.Println(result)
    }
}

func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        defer close(out)
        for n := range in { out <- n * n }
    }()
    return out
}
```

---

### 2. Context Package

**Question:** Cancellation and timeouts.

**Answer:**

```go
// Timeout context
ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
defer cancel()

// Pass to every I/O operation
result, err := db.QueryContext(ctx, "SELECT * FROM users")
resp, err := http.NewRequestWithContext(ctx, "GET", url, nil)

// Cancellation propagates through the call chain
func fetchData(ctx context.Context) (Data, error) {
    select {
    case <-ctx.Done():
        return Data{}, ctx.Err() // context.DeadlineExceeded or context.Canceled
    case data := <-fetchFromDB(ctx):
        return data, nil
    }
}
```

**Every function doing I/O should accept `context.Context` as its first parameter.** This enables the caller to cancel operations, set deadlines, and pass request-scoped values.
