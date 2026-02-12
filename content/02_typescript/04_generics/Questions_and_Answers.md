# TypeScript Generics

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Why Generics?

**Question:**
Rewrite a value-wrapping function with generics instead of `any`.

**Answer:**

```typescript
// ❌ Without generics — loses type information
function wrapInArray(value: any): any[] {
  return [value];
}
const result = wrapInArray("hello"); // type: any[] — useless!

// ✅ With generics — preserves type
function wrapInArray<T>(value: T): T[] {
  return [value];
}
const result = wrapInArray("hello"); // type: string[] ✅
const nums = wrapInArray(42); // type: number[] ✅
```

**Why `any` is problematic:**

- No autocomplete on the result.
- No error if you treat a string as a number.
- Defeats the purpose of TypeScript entirely.

**Generics = type variables.** They let you write functions that work with any type while preserving type safety.

---

### 2. Generic Functions

**Question:**
Write a type-safe `first` function.

**Answer:**

```typescript
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

first([1, 2, 3]); // type: number | undefined
first(["a", "b"]); // type: string | undefined
first([]); // type: undefined
```

**Without generics:** `first(arr: any[]): any` — you'd need to cast the result everywhere: `first(numbers) as number`.

**TypeScript infers `T`** from the argument — you rarely need to specify it explicitly: `first<number>([1, 2, 3])`.

---

## 🟡 Intermediate

### 1. Generic Constraints

**Question:**
Type-safe property access with `extends keyof`.

**Answer:**

```typescript
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30, email: "a@b.com" };

getProperty(user, "name"); // type: string ✅
getProperty(user, "age"); // type: number ✅
getProperty(user, "invalid"); // ❌ Error: '"invalid"' is not assignable to '"name" | "age" | "email"'
```

**How it works:**

- `K extends keyof T` constrains `K` to only valid keys of `T`.
- `T[K]` is an indexed access type — it returns the type of `T` at key `K`.
- TypeScript narrows the return type based on which specific key you pass.

---

### 2. Generic Interfaces & Classes

**Question:**
Design a generic `Repository<T>`.

**Answer:**

```typescript
interface Entity {
  id: string;
}

interface Repository<T extends Entity> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  create(data: Omit<T, "id">): Promise<T>;
  update(id: string, data: Partial<Omit<T, "id">>): Promise<T>;
  delete(id: string): Promise<void>;
}

// Implementation for User
interface User extends Entity {
  name: string;
  email: string;
}

class UserRepository implements Repository<User> {
  async findById(id: string): Promise<User | null> {
    return db.users.findUnique({ where: { id } });
  }
  async findAll(): Promise<User[]> {
    return db.users.findMany();
  }
  async create(data: Omit<User, "id">): Promise<User> {
    return db.users.create({ data });
  }
  async update(id: string, data: Partial<Omit<User, "id">>): Promise<User> {
    return db.users.update({ where: { id }, data });
  }
  async delete(id: string): Promise<void> {
    await db.users.delete({ where: { id } });
  }
}
```

**The `T extends Entity` constraint** ensures only types with an `id` property can be used with the repository.

---

### 3. Default Type Parameters

**Question:**
Generic types with defaults.

**Answer:**

```typescript
type ApiResponse<T = unknown, E = Error> = {
  data: T | null;
  error: E | null;
  status: number;
};

// All these are valid:
type UserResponse = ApiResponse<User>; // T=User, E=Error
type UserRes2 = ApiResponse<User, AppError>; // T=User, E=AppError
type GenericRes = ApiResponse; // T=unknown, E=Error
```

**When defaults are useful:**

- Library types where consumers might not need full customization.
- Gradual typing — start with `unknown`, specialize later.
- Reducing boilerplate when one type parameter is commonly the same.

---

## 🔴 Advanced

### 1. Implementing Utility Types from Scratch

**Question:**
Implement `Pick`, `Omit`, and `Partial` from scratch.

**Answer:**

```typescript
// Pick — select specific keys
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// Omit — exclude specific keys
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
// Alternative: MyOmit<T, K> = MyPick<T, Exclude<keyof T, K>>

// Partial — make all properties optional
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};
```

**How mapped types work:**

- `[P in keyof T]` — iterates over each property key.
- `T[P]` — indexed access gets the value type at key `P`.
- `?` modifier makes each property optional.
- `as` clause (key remapping) can filter or transform keys.

---

### 2. Higher-Order Generic Functions

**Question:**
Type-safe `pipe` with full inference.

**Answer:**

```typescript
function pipe<A, B, C>(fn1: (arg: A) => B, fn2: (arg: B) => C): (arg: A) => C {
  return (arg) => fn2(fn1(arg));
}

const fn = pipe(
  (x: string) => x.length, // string → number
  (n: number) => n > 5, // number → boolean
);

fn("hello world"); // true, type: boolean ✅
fn("hi"); // false, type: boolean ✅
fn(42); // ❌ Error: number is not assignable to string
```

**For N functions:** You'd need overloads or a recursive conditional type (libraries like `fp-ts` do this).

---

### 3. Variance

**Question:**
Covariance and contravariance explained.

**Answer:**

**Covariance (output/read position):** If `Dog extends Animal`, then `Dog[]` is assignable to `Animal[]`.

```typescript
class Animal {
  name = "animal";
}
class Dog extends Animal {
  bark() {}
}

const dogs: Dog[] = [new Dog()];
const animals: Animal[] = dogs; // ✅ Covariant — Dog[] → Animal[]
```

**Contravariance (input/write position):** Function parameters go in the opposite direction.

```typescript
type Handler<T> = (value: T) => void;

const handleAnimal: Handler<Animal> = (a) => console.log(a.name);
const handleDog: Handler<Dog> = (d) => d.bark();

// ❌ Unsafe: handleDog expects .bark() but might receive a Cat
const bad: Handler<Animal> = handleDog; // Error with strictFunctionTypes
```

**Rule of thumb:**

- **Outputs (return types)** are **covariant** — subtype can replace supertype.
- **Inputs (parameters)** are **contravariant** — supertype can replace subtype.
- Enable `strictFunctionTypes` in tsconfig to enforce this.
