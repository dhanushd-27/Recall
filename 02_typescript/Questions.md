# TypeScript Questions

## Basics

1. What is TypeScript and why use it over JavaScript?
2. What are the benefits of using TypeScript?
3. How does TypeScript compile to JavaScript?
4. Explain `tsconfig.json` and its important options.
5. What is type inference in TypeScript?
6. What is the `any` type and why should you avoid it?
7. Explain `unknown` vs `any`.
8. What is `never` type and when is it used?
9. What is `void` type?

## Type System

10. What are primitive types in TypeScript?
11. Explain union types and intersection types.
12. What are literal types?
13. Explain type aliases vs interfaces.
14. When should you use `type` vs `interface`?
15. What are tuple types?
16. Explain `readonly` modifier.
17. What are index signatures?
18. Explain `keyof` operator.
19. What is `typeof` operator in TypeScript?

## Interfaces

20. How do you define an interface?
21. Explain optional properties in interfaces.
22. What are readonly properties?
23. How do interfaces support function types?
24. Explain interface inheritance/extension.
25. What is declaration merging?
26. How do you define an interface for a class?

## Generics

27. What are generics and why are they useful?
28. How do you create a generic function?
29. Explain generic constraints using `extends`.
30. What are generic interfaces?
31. Explain generic classes.
32. What is the difference between `T extends U` and `T = U`?
33. What are default generic types?
34. Explain the `infer` keyword.

## Advanced Types

35. What are conditional types?
36. Explain mapped types.
37. What are template literal types?
38. Explain utility types: `Partial`, `Required`, `Pick`, `Omit`.
39. What is `Record<K, T>`?
40. Explain `Exclude` and `Extract` utility types.
41. What is `ReturnType<T>`?
42. What is `Parameters<T>`?
43. Explain `NonNullable<T>`.
44. What is `Awaited<T>`?

## Type Guards & Narrowing

45. What are type guards?
46. Explain `typeof` type guards.
47. Explain `instanceof` type guards.
48. What are custom type guards (type predicates)?
49. Explain discriminated unions.
50. What is the `in` operator for type narrowing?
51. How does `as const` work?

## Classes

52. How do you define a class in TypeScript?
53. Explain access modifiers: `public`, `private`, `protected`.
54. What is the difference between `private` and `#` private fields?
55. Explain abstract classes and methods.
56. What are static members?
57. Explain parameter properties.
58. How do classes implement interfaces?

## Modules & Namespaces

59. What are ES modules in TypeScript?
60. Explain `import` and `export` syntax.
61. What are namespaces and when to use them?
62. What is declaration merging with modules?
63. Explain ambient modules.

## Declaration Files

64. What are `.d.ts` files?
65. How do you create type declarations for a JavaScript library?
66. What is `@types` and DefinitelyTyped?
67. Explain `declare` keyword.
68. What is triple-slash directive?

## Enums

69. What are enums in TypeScript?
70. Explain numeric vs string enums.
71. What are const enums?
72. When should you avoid using enums?

## Decorators

73. What are decorators in TypeScript?
74. Explain class decorators.
75. What are method decorators?
76. Explain property and parameter decorators.
77. What is decorator composition?

## Error Handling & Strict Mode

78. What are strict mode options in TypeScript?
79. Explain `strictNullChecks`.
80. What is `noImplicitAny`?
81. How do you handle nullable types?
82. What is the non-null assertion operator (`!`)?
83. Explain optional chaining (`?.`) and nullish coalescing (`??`).

## Practical & Best Practices

84. How do you type React components in TypeScript?
85. How do you type event handlers?
86. Explain typing for async functions and Promises.
87. How do you type API responses?
88. What are branded/nominal types?
89. How do you make a type immutable?
90. What is the `satisfies` operator?

## Coding Challenges

91. Create a generic function that returns the first element of an array.
92. Write a type that makes all properties of an object optional recursively (DeepPartial).
93. Create a type that extracts all keys of an object that have string values.
94. Write a type-safe function that merges two objects.
95. Implement a type that converts a union to an intersection.
96. Create a type that removes `readonly` from all properties.
97. Write a generic type that gets the return type of an async function.
98. Create a type-safe event emitter.
99. Implement a `Flatten` type for nested arrays.
100. Write a type that validates an object has at least one property.
