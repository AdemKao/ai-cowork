---
name: refactor
description: Safely restructure code without changing behavior. Use when refactoring, cleaning up code smells, or improving code quality.
---

# Refactor Skill

## Instructions

- [ ] Tests exist for the code
- [ ] All tests pass before starting
- [ ] Code is committed (can revert)

## Steps

1. **Identify Refactoring Target**

   Common refactoring candidates:
   - Long functions (> 50 lines)
   - Deep nesting (> 3 levels)
   - Duplicate code
   - Large classes
   - Long parameter lists
   - Feature envy

2. **Ensure Test Coverage**

   ```bash
   pnpm test -- --coverage path/to/file
   ```

   If coverage is low, add tests first!

3. **Choose Refactoring Pattern**

   | Problem             | Refactoring                    |
   | ------------------- | ------------------------------ |
   | Long function       | Extract Function               |
   | Duplicate code      | Extract Function/Class         |
   | Long parameter list | Introduce Parameter Object     |
   | Deep nesting        | Early Return, Extract Function |
   | Large class         | Extract Class                  |
   | Feature envy        | Move Method                    |
   | Magic values        | Replace with Constants         |
   | Conditionals        | Replace with Polymorphism      |

4. **Apply Refactoring (Small Steps)**
   - Make ONE change at a time
   - Run tests after each change
   - Commit after each successful refactoring

5. **Verify Behavior Unchanged**
   ```bash
   pnpm test
   pnpm build
   ```

## Refactoring Patterns

### Extract Function

```typescript
// Before
function processOrder(order: Order) {
  // Validate
  if (!order.items || order.items.length === 0) {
    throw new Error("Empty order");
  }
  if (!order.customer) {
    throw new Error("No customer");
  }

  // Calculate totals
  let subtotal = 0;
  for (const item of order.items) {
    subtotal += item.price * item.quantity;
  }
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  // Save
  db.orders.create({ ...order, subtotal, tax, total });
}

// After
function processOrder(order: Order) {
  validateOrder(order);
  const totals = calculateTotals(order.items);
  saveOrder(order, totals);
}

function validateOrder(order: Order) {
  if (!order.items?.length) throw new Error("Empty order");
  if (!order.customer) throw new Error("No customer");
}

function calculateTotals(items: OrderItem[]) {
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = subtotal * TAX_RATE;
  return { subtotal, tax, total: subtotal + tax };
}
```

### Early Return

```typescript
// Before
function getDiscount(user: User) {
  let discount = 0;
  if (user) {
    if (user.isActive) {
      if (user.membership === "gold") {
        discount = 0.2;
      } else if (user.membership === "silver") {
        discount = 0.1;
      } else {
        discount = 0.05;
      }
    }
  }
  return discount;
}

// After
function getDiscount(user: User) {
  if (!user?.isActive) return 0;

  const discounts: Record<string, number> = {
    gold: 0.2,
    silver: 0.1,
  };

  return discounts[user.membership] ?? 0.05;
}
```

### Introduce Parameter Object

```typescript
// Before
function createUser(
  name: string,
  email: string,
  age: number,
  address: string,
  phone: string,
) {
  /* ... */
}

// After
interface CreateUserData {
  name: string;
  email: string;
  age?: number;
  address?: string;
  phone?: string;
}

function createUser(data: CreateUserData) {
  /* ... */
}
```

### Replace Conditional with Polymorphism

```typescript
// Before
function calculateShipping(order: Order) {
  switch (order.shippingType) {
    case "standard":
      return order.weight * 1.5;
    case "express":
      return order.weight * 3.0 + 10;
    case "overnight":
      return order.weight * 5.0 + 25;
    default:
      throw new Error("Unknown shipping type");
  }
}

// After
interface ShippingStrategy {
  calculate(weight: number): number;
}

class StandardShipping implements ShippingStrategy {
  calculate(weight: number) {
    return weight * 1.5;
  }
}

class ExpressShipping implements ShippingStrategy {
  calculate(weight: number) {
    return weight * 3.0 + 10;
  }
}

class OvernightShipping implements ShippingStrategy {
  calculate(weight: number) {
    return weight * 5.0 + 25;
  }
}

const shippingStrategies: Record<string, ShippingStrategy> = {
  standard: new StandardShipping(),
  express: new ExpressShipping(),
  overnight: new OvernightShipping(),
};

function calculateShipping(order: Order) {
  const strategy = shippingStrategies[order.shippingType];
  if (!strategy) throw new Error("Unknown shipping type");
  return strategy.calculate(order.weight);
}
```

## Safety Checklist

Before refactoring:

- [ ] Tests exist and pass
- [ ] Code is committed

During refactoring:

- [ ] One change at a time
- [ ] Tests after each change
- [ ] Commit frequently

After refactoring:

- [ ] All tests pass
- [ ] Build succeeds
- [ ] No behavior changes
- [ ] Code is cleaner

## When to Stop

- Tests start failing → Revert last change
- Unsure about change → Stop and ask
- Scope creeping → Commit current work, create new task
