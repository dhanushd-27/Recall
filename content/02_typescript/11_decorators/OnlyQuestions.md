# TypeScript Decorators

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. What Are Decorators?

**Question:**
What are decorators in TypeScript? What is the TC39 Stage 3 decorators proposal and how does it differ from the experimental `--experimentalDecorators` flag?

### 2. Class Decorators

**Question:**
Write a simple `@sealed` class decorator that prevents adding new properties to a class after construction. What does a class decorator receive as its argument?

---

## 🟡 Intermediate

### 1. Method Decorators

**Question:**
Create a `@log` method decorator that logs the method name, arguments, and return value every time the method is called. How do you access the method's property descriptor?

### 2. Parameter & Property Decorators

**Question:**
Create a `@validate` decorator that marks class properties for runtime validation. How would you combine this with a class decorator that runs all validators on construction?

---

## 🔴 Advanced

### 1. Decorator Factories & Composition

**Question:**
Create a configurable `@throttle(ms)` decorator factory that limits how often a method can be called. Then show how multiple decorators compose (execution order).

### 2. Decorators in Frameworks

**Question:**
How do NestJS, Angular, and TypeORM use decorators for dependency injection, routing, and schema definition? What are the trade-offs of decorator-heavy architectures?
