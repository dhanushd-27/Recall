# TypeScript Enums

# 📚 Navigation

- [Beginner](#-beginner)
- [Intermediate](#-intermediate)
- [Advanced](#-advanced)

---

## 🟢 Beginner

### 1. Numeric vs String Enums

**Question:**
What is the difference between numeric and string enums? When would you use each?

### 2. Enum Basics

**Question:**
How do you define an enum and use it as a type? What does a numeric enum compile to in JavaScript?

---

## 🟡 Intermediate

### 1. `const enum` vs Regular Enum

**Question:**
What is `const enum`? How does it differ in compiled output and when should you avoid it?

### 2. Enum Alternatives

**Question:**
Many TypeScript style guides recommend avoiding enums entirely. What are the alternatives (`as const` objects, union types) and when is each approach better?

### 3. Reverse Mapping

**Question:**
Explain reverse mapping in numeric enums. Why don't string enums have it? Show how to iterate over enum values safely.

---

## 🔴 Advanced

### 1. Computed & Heterogeneous Enums

**Question:**
Can enum members have computed values? Can an enum mix string and numeric members? What are the practical implications?

### 2. Enums at the Type vs Value Level

**Question:**
Enums in TypeScript occupy both the type space and value space. Explain this dual nature and how it differs from `type` aliases. When does this cause issues with tree-shaking?
