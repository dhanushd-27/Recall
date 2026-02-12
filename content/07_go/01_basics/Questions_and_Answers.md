# Go Basics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Go Fundamentals

**Question:** What makes Go different?

**Answer:**

| Feature        | Go                                | JavaScript/TypeScript              |
| -------------- | --------------------------------- | ---------------------------------- |
| Type system    | Static, compiled                  | Dynamic (JS) / Static (TS)         |
| Concurrency    | Goroutines + channels (built-in)  | Event loop + async/await           |
| OOP            | No classes — structs + interfaces | Classes + prototypes               |
| Error handling | Explicit returns                  | Exceptions (try/catch)             |
| Memory         | Garbage collected, value types    | Garbage collected, reference types |
| Speed          | ~10-50x faster than Node.js       | —                                  |

```go
// Zero values — every type has a default
var i int       // 0
var s string    // ""
var b bool      // false
var p *int      // nil

// Pointers — pass by reference
func increment(n *int) {
    *n++   // Dereference and modify
}
x := 42
increment(&x) // Pass address
fmt.Println(x) // 43
```

---

### 2. Error Handling

**Question:** Explicit error returns.

**Answer:**

```go
// Functions return (result, error)
func readFile(path string) ([]byte, error) {
    data, err := os.ReadFile(path)
    if err != nil {
        return nil, fmt.Errorf("readFile %s: %w", path, err) // Wrap error
    }
    return data, nil
}

// Caller handles the error
data, err := readFile("config.json")
if err != nil {
    if errors.Is(err, os.ErrNotExist) {
        // File doesn't exist — use defaults
    } else {
        log.Fatal(err)
    }
}
```

**Why no exceptions?** Exceptions create invisible control flow. Go makes every potential failure explicit and visible at the call site.

---

## 🟡 Intermediate

### 1. Interfaces & Structs

**Question:** Implicit interfaces.

**Answer:**

```go
// Interface — defines behavior
type Writer interface {
    Write(p []byte) (n int, err error)
}

// Struct — defines data
type FileWriter struct {
    path string
}

// Implement interface — NO "implements" keyword needed!
func (fw FileWriter) Write(p []byte) (int, error) {
    return os.WriteFile(fw.path, p, 0644)
}

// FileWriter satisfies Writer automatically
var w Writer = FileWriter{path: "output.txt"} // ✅

// Struct embedding — composition over inheritance
type Logger struct {
    Writer          // Embed Writer — Logger gets Write() method
    prefix string
}
```

**Key difference from TypeScript:** Go interfaces are satisfied implicitly — no `implements` declaration needed. If a type has all the methods, it satisfies the interface.

---

### 2. Packages & Modules

**Question:** Go modules vs npm.

**Answer:**

```bash
# Initialize a module
go mod init github.com/user/project

# Add a dependency
go get github.com/gin-gonic/gin@v1.9.0

# go.mod — like package.json
module github.com/user/project

go 1.22

require (
    github.com/gin-gonic/gin v1.9.0
)
```

| Feature        | Go Modules                 | npm                 |
| -------------- | -------------------------- | ------------------- |
| Lock file      | `go.sum`                   | `package-lock.json` |
| Registry       | Proxy (proxy.golang.org)   | npmjs.com           |
| Versioning     | Semantic import versioning | SemVer              |
| `node_modules` | ❌ Global cache (`GOPATH`) | Per-project         |

---

## 🔴 Advanced

### 1. Performance

**Question:** GC and profiling.

**Answer:**

```go
// Stack vs Heap
func stackAlloc() int {
    x := 42    // Stack — fast, auto-freed
    return x
}

func heapAlloc() *int {
    x := 42     // Escapes to heap — pointer returned
    return &x   // Compiler detects escape
}

// Profiling with pprof
import _ "net/http/pprof"
go func() { http.ListenAndServe(":6060", nil) }()

// Then: go tool pprof http://localhost:6060/debug/pprof/heap
```

Go's GC is a concurrent, tri-color mark-and-sweep collector with sub-millisecond pause times.

---

### 2. Testing

**Question:** Table-driven tests.

**Answer:**

```go
func Add(a, b int) int { return a + b }

func TestAdd(t *testing.T) {
    tests := []struct {
        name     string
        a, b     int
        expected int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -1, -2},
        {"zero", 0, 0, 0},
        {"mixed", -1, 1, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := Add(tt.a, tt.b)
            if result != tt.expected {
                t.Errorf("Add(%d, %d) = %d, want %d", tt.a, tt.b, result, tt.expected)
            }
        })
    }
}

// Benchmark
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(2, 3)
    }
}
```
