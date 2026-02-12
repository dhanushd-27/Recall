# TypeScript Decorators

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. What Are Decorators?

**Question:**
Decorators and legacy vs TC39 Stage 3.

**Answer:**
Decorators are functions that modify classes, methods, properties, or parameters at declaration time using `@` syntax.

**Two versions exist:**

| Feature              | Legacy (`--experimentalDecorators`) | TC39 Stage 3 (TS 5.0+)   |
| -------------------- | ----------------------------------- | ------------------------ |
| Status               | Deprecated concept                  | Standardizing            |
| Parameter decorators | ✅                                  | ❌                       |
| Metadata reflection  | ✅ (`reflect-metadata`)             | ❌ (uses different API)  |
| Used by              | NestJS, Angular, TypeORM            | Future standard          |
| `tsconfig` flag      | `"experimentalDecorators": true`    | No flag needed (TS 5.0+) |

```typescript
// TC39 Stage 3 decorator (modern)
function sealed(target: Function, context: ClassDecoratorContext) {
  Object.seal(target);
  Object.seal(target.prototype);
}

@sealed
class User {
  name = "Alice";
}
```

---

### 2. Class Decorators

**Question:**
Write a `@sealed` class decorator.

**Answer:**

```typescript
// TC39 Stage 3 syntax
function sealed(target: Function, context: ClassDecoratorContext) {
  Object.seal(target);
  Object.seal(target.prototype);
}

@sealed
class User {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}

const user = new User("Alice");
(user as any).newProp = "test"; // ❌ TypeError: Can't add property
```

**A class decorator receives:**

- `target` — the class constructor function.
- `context` — metadata about the decoration (name, kind, etc.).

---

## 🟡 Intermediate

### 1. Method Decorators

**Question:**
Create a `@log` method decorator.

**Answer:**

```typescript
function log(target: any, context: ClassMethodDecoratorContext) {
  const methodName = String(context.name);

  return function (this: any, ...args: any[]) {
    console.log(
      `→ ${methodName}(${args.map((a) => JSON.stringify(a)).join(", ")})`,
    );
    const result = target.call(this, ...args);
    console.log(`← ${methodName} returned ${JSON.stringify(result)}`);
    return result;
  };
}

class Calculator {
  @log
  add(a: number, b: number): number {
    return a + b;
  }
}

new Calculator().add(2, 3);
// → add(2, 3)
// ← add returned 5
```

---

### 2. Property Validation

**Question:**
Combine property and class decorators for validation.

**Answer:**

```typescript
const validators = new Map<object, Map<string, (v: any) => boolean>>();

function validate(check: (value: any) => boolean) {
  return function (target: undefined, context: ClassFieldDecoratorContext) {
    context.addInitializer(function (this: any) {
      const className = this.constructor;
      if (!validators.has(className)) validators.set(className, new Map());
      validators.get(className)!.set(String(context.name), check);
    });
  };
}

function validated(target: any, context: ClassDecoratorContext) {
  return class extends target {
    constructor(...args: any[]) {
      super(...args);
      const checks = validators.get(target);
      if (checks) {
        for (const [prop, check] of checks) {
          if (!check((this as any)[prop])) {
            throw new Error(`Validation failed for ${prop}`);
          }
        }
      }
    }
  };
}

@validated
class User {
  @validate((v) => typeof v === "string" && v.length > 0)
  name: string;

  @validate((v) => typeof v === "number" && v >= 0 && v <= 150)
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }
}

new User("Alice", 30); // ✅
new User("", 30); // ❌ Validation failed for name
```

---

## 🔴 Advanced

### 1. Decorator Factories & Composition

**Question:**
Configurable `@throttle(ms)` and composition order.

**Answer:**

```typescript
function throttle(ms: number) {
  return function (target: any, context: ClassMethodDecoratorContext) {
    let lastCall = 0;

    return function (this: any, ...args: any[]) {
      const now = Date.now();
      if (now - lastCall < ms) {
        console.log(`Throttled: ${String(context.name)}`);
        return;
      }
      lastCall = now;
      return target.call(this, ...args);
    };
  };
}

class Api {
  @throttle(1000) // Only callable once per second
  fetchData() {
    console.log("Fetching...");
  }
}
```

**Composition order (multiple decorators):**

```typescript
@A
@B
@C
class Foo {}

// Evaluation: A → B → C (top to bottom)
// Application: C → B → A (bottom to top, like function composition)
// Equivalent to: A(B(C(Foo)))
```

---

### 2. Decorators in Frameworks

**Question:**
Real-world decorator patterns.

**Answer:**

```typescript
// NestJS — routing + DI
@Controller("/users")
class UserController {
  constructor(private userService: UserService) {} // DI

  @Get("/:id")
  @UseGuards(AuthGuard)
  async getUser(@Param("id") id: string) { ... }
}

// Angular — component definition
@Component({
  selector: "app-root",
  template: "<h1>Hello</h1>",
})
class AppComponent { ... }

// TypeORM — schema definition
@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;
}
```

**Trade-offs:**

| Pro                           | Con                                          |
| ----------------------------- | -------------------------------------------- |
| Declarative, readable         | Magic — hard to debug                        |
| Reduces boilerplate           | Tight framework coupling                     |
| Metadata-driven               | Requires `--experimentalDecorators` (legacy) |
| Familiar (Java/C# developers) | Tree-shaking difficulty                      |
