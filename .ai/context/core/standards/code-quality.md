# Code Quality Standards

> Universal guidelines for writing clean, maintainable code.

## Principles

1. **Readability**: Code is read more than written
2. **Simplicity**: Simple > clever
3. **Consistency**: Same problem = same solution
4. **Testability**: If it's hard to test, it's probably wrong

---

## SOLID Principles

### Single Responsibility (SRP)

```typescript
// ❌ Bad: Class does too much
class UserService {
  createUser() {}
  sendEmail() {}
  generateReport() {}
  processPayment() {}
}

// ✅ Good: Single responsibility
class UserService {
  createUser() {}
  updateUser() {}
  deleteUser() {}
}

class EmailService {
  send() {}
}

class ReportService {
  generate() {}
}
```

### Open/Closed (OCP)

```typescript
// ❌ Bad: Must modify to extend
function calculateDiscount(type: string, amount: number) {
  if (type === "regular") return amount * 0.1;
  if (type === "vip") return amount * 0.2;
  if (type === "premium") return amount * 0.3; // Must add here
}

// ✅ Good: Open for extension
interface DiscountStrategy {
  calculate(amount: number): number;
}

class RegularDiscount implements DiscountStrategy {
  calculate(amount: number) {
    return amount * 0.1;
  }
}

class VIPDiscount implements DiscountStrategy {
  calculate(amount: number) {
    return amount * 0.2;
  }
}

// New discounts don't require modifying existing code
class PremiumDiscount implements DiscountStrategy {
  calculate(amount: number) {
    return amount * 0.3;
  }
}
```

### Liskov Substitution (LSP)

```typescript
// ❌ Bad: Square breaks Rectangle contract
class Rectangle {
  setWidth(w: number) {
    this.width = w;
  }
  setHeight(h: number) {
    this.height = h;
  }
}

class Square extends Rectangle {
  setWidth(w: number) {
    this.width = w;
    this.height = w; // Violates expectation
  }
}

// ✅ Good: Use composition or separate types
interface Shape {
  getArea(): number;
}

class Rectangle implements Shape {
  constructor(
    private width: number,
    private height: number,
  ) {}
  getArea() {
    return this.width * this.height;
  }
}

class Square implements Shape {
  constructor(private side: number) {}
  getArea() {
    return this.side * this.side;
  }
}
```

### Interface Segregation (ISP)

```typescript
// ❌ Bad: Fat interface
interface Worker {
  work(): void;
  eat(): void;
  sleep(): void;
}

// ✅ Good: Segregated interfaces
interface Workable {
  work(): void;
}

interface Eatable {
  eat(): void;
}

interface Sleepable {
  sleep(): void;
}

class Human implements Workable, Eatable, Sleepable {
  work() {}
  eat() {}
  sleep() {}
}

class Robot implements Workable {
  work() {}
}
```

### Dependency Inversion (DIP)

```typescript
// ❌ Bad: High-level depends on low-level
class UserService {
  private db = new PostgresDatabase(); // Concrete dependency

  getUser(id: string) {
    return this.db.query(`SELECT * FROM users WHERE id = ${id}`);
  }
}

// ✅ Good: Depend on abstractions
interface Database {
  query(sql: string): Promise<any>;
}

class UserService {
  constructor(private db: Database) {} // Injected abstraction

  getUser(id: string) {
    return this.db.query(`SELECT * FROM users WHERE id = ?`, [id]);
  }
}
```

---

## Function Guidelines

### Size

- **Ideal**: 10-20 lines
- **Maximum**: 50 lines
- If longer, extract functions

### Parameters

```typescript
// ❌ Bad: Too many parameters
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
  role: string,
) {}

// ✅ Good: Use object parameter
interface CreateUserData {
  name: string;
  email: string;
  age?: number;
  address?: string;
  phone?: string;
  role?: string;
}

function createUser(data: CreateUserData) {}
```

### Single Level of Abstraction

```typescript
// ❌ Bad: Mixed abstraction levels
function processOrder(order: Order) {
  // High level
  validateOrder(order);

  // Low level (mixed in)
  const tax = order.subtotal * 0.1;
  const shipping = order.weight > 10 ? 15 : 5;
  const total = order.subtotal + tax + shipping;

  // High level again
  saveOrder(order);
  sendConfirmation(order);
}

// ✅ Good: Consistent abstraction
function processOrder(order: Order) {
  validateOrder(order);
  calculateTotals(order);
  saveOrder(order);
  sendConfirmation(order);
}

function calculateTotals(order: Order) {
  order.tax = calculateTax(order.subtotal);
  order.shipping = calculateShipping(order.weight);
  order.total = order.subtotal + order.tax + order.shipping;
}
```

---

## Error Handling

### Use Custom Errors

```typescript
// ✅ Good: Custom error types
class ValidationError extends Error {
  constructor(
    public field: string,
    message: string,
  ) {
    super(message);
    this.name = "ValidationError";
  }
}

class NotFoundError extends Error {
  constructor(
    public resource: string,
    public id: string,
  ) {
    super(`${resource} with id ${id} not found`);
    this.name = "NotFoundError";
  }
}

// Usage
throw new ValidationError("email", "Invalid email format");
throw new NotFoundError("User", userId);
```

### Don't Swallow Errors

```typescript
// ❌ Bad: Silent failure
try {
  await saveUser(user);
} catch (error) {
  console.log(error); // Continues silently
}

// ✅ Good: Handle or propagate
try {
  await saveUser(user);
} catch (error) {
  if (error instanceof DuplicateError) {
    return { error: "Email already exists" };
  }
  throw error; // Re-throw unknown errors
}
```

### Use Result Types (Optional)

```typescript
// TypeScript Result type
type Result<T, E = Error> = { ok: true; value: T } | { ok: false; error: E };

async function findUser(id: string): Promise<Result<User, NotFoundError>> {
  const user = await db.users.find(id);
  if (!user) {
    return { ok: false, error: new NotFoundError("User", id) };
  }
  return { ok: true, value: user };
}

// Usage
const result = await findUser(id);
if (!result.ok) {
  console.log(result.error.message);
  return;
}
console.log(result.value.name);
```

---

## Code Smells

### Avoid

| Smell                | Problem              | Solution               |
| -------------------- | -------------------- | ---------------------- |
| Long functions       | Hard to understand   | Extract functions      |
| Deep nesting         | Hard to follow       | Early returns, extract |
| Magic numbers        | Unclear meaning      | Named constants        |
| Duplicate code       | Multiple changes     | Extract function       |
| Dead code            | Confusion            | Delete it              |
| Long parameter lists | Hard to call         | Object parameters      |
| Feature envy         | Wrong responsibility | Move method            |
| God class            | Does too much        | Split class            |

### Example Fixes

```typescript
// ❌ Magic numbers
if (status === 1) {
  /* ... */
}
if (retries > 3) {
  /* ... */
}

// ✅ Named constants
const STATUS_ACTIVE = 1;
const MAX_RETRIES = 3;
if (status === STATUS_ACTIVE) {
  /* ... */
}
if (retries > MAX_RETRIES) {
  /* ... */
}

// ❌ Deep nesting
function process(data) {
  if (data) {
    if (data.items) {
      if (data.items.length > 0) {
        for (const item of data.items) {
          if (item.valid) {
            // Do something
          }
        }
      }
    }
  }
}

// ✅ Early returns
function process(data) {
  if (!data?.items?.length) return;

  const validItems = data.items.filter((item) => item.valid);
  for (const item of validItems) {
    // Do something
  }
}
```

---

## Formatting

### Consistency

Use automated tools:

```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Imports

```typescript
// Order: external → internal → relative
import { useState } from "react"; // 1. External packages
import { useAuth } from "@/hooks/useAuth"; // 2. Internal aliases
import { Button } from "./Button"; // 3. Relative imports

// Group with blank lines
import React from "react";
import { useQuery } from "@tanstack/react-query";

import { api } from "@/services/api";
import { formatDate } from "@/utils/date";

import { UserCard } from "./UserCard";
import type { User } from "./types";
```

---

## Comments

### Good Comments

```typescript
// ✅ Explain WHY
// Using retry logic because the payment gateway has intermittent failures
const result = await retry(() => processPayment(order), { attempts: 3 });

// ✅ Warn about non-obvious behavior
// WARNING: This function mutates the input array
function sortInPlace(arr: number[]): void;

// ✅ Document public APIs
/**
 * Calculates the total price including tax and shipping.
 * @param items - Cart items
 * @param taxRate - Tax rate as decimal (e.g., 0.1 for 10%)
 */
function calculateTotal(items: CartItem[], taxRate: number): number;

// ✅ TODO with context
// TODO(#123): Refactor when we upgrade to React 19
```

### Bad Comments

```typescript
// ❌ Obvious
// Increment i
i++

// ❌ Outdated
// Returns user name  <- Actually returns User object now
function getUser(): User

// ❌ Commented-out code
// function oldImplementation() { ... }

// ❌ Noise
// End of function
}
```

---

## Checklist

Before committing:

- [ ] No unused imports or variables
- [ ] No `console.log` (use logger)
- [ ] No `any` types (use proper types)
- [ ] No magic numbers (use constants)
- [ ] Functions < 50 lines
- [ ] Meaningful names
- [ ] Proper error handling
- [ ] Linter passes
- [ ] Types check
