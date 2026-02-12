# TypeScript Classes

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Class Basics & Access Modifiers

**Question:**
What are `public`, `private`, `protected`, and the `#private` syntax? How do they differ in terms of runtime enforcement?

### 2. Constructor Shorthand

**Question:**
Refactor a verbose class constructor that assigns each parameter to a property. What is TypeScript's parameter property shorthand?

---

## 🟡 Intermediate

### 1. Abstract Classes vs Interfaces

**Question:**
You're designing a logging system. When should you use an abstract class with partial implementations vs a pure interface? Give an example where each is more appropriate.

### 2. `implements` vs `extends`

**Question:**
Explain the difference between `class Dog extends Animal` and `class Dog implements IAnimal`. Can a class implement multiple interfaces? Can it extend multiple classes?

### 3. Generic Classes

**Question:**
Design a generic `Stack<T>` class with `push`, `pop`, `peek`, and `isEmpty` methods. Ensure type safety so that a `Stack<number>` can only contain numbers.

---

## 🔴 Advanced

### 1. Mixins Pattern

**Question:**
TypeScript doesn't support multiple class inheritance. How do you implement the mixin pattern to compose behavior from multiple sources into a single class?

### 2. Static Members & Singleton Pattern

**Question:**
Implement a type-safe Singleton pattern in TypeScript. Should you use the Singleton pattern in modern applications, or are there better alternatives?
