---
name: debug
description: Systematically diagnose and fix bugs. Use when debugging errors, fixing failing tests, or investigating unexpected behavior.
---

# Debug Skill

## Instructions

1. **Reproduce the Issue**
   - Get exact steps to reproduce
   - Identify inputs that cause the bug
   - Confirm it's consistently reproducible

2. **Gather Information**

   ```bash
   # Check error logs
   cat logs/error.log | tail -50

   # Check recent changes
   git log --oneline -10
   git diff HEAD~5
   ```

3. **Form Hypothesis**
   - What could cause this behavior?
   - List 2-3 most likely causes
   - Rank by probability

4. **Isolate the Problem**
   - Binary search through code
   - Add logging/breakpoints
   - Create minimal reproduction

5. **Identify Root Cause**
   - Don't stop at symptoms
   - Ask "why" multiple times
   - Find the actual bug, not a workaround

6. **Fix the Bug**
   - Fix the root cause
   - Add test to prevent regression
   - Verify fix doesn't break other things

7. **Verify Fix**
   ```bash
   pnpm test
   pnpm build
   # Manual testing if needed
   ```

## Debugging Techniques

### Add Strategic Logging

```typescript
// Temporary debug logging
console.log("[DEBUG] Function called with:", { userId, options });
console.log("[DEBUG] Query result:", result);
console.log("[DEBUG] State before update:", this.state);

// Remember to remove before commit!
```

### Binary Search

```typescript
// 1. Find approximate location
// 2. Add log in middle
// 3. Is bug before or after?
// 4. Repeat until found

function processData(data: Data[]) {
  console.log("[DEBUG] 1. Start, data length:", data.length);

  const filtered = filterData(data);
  console.log("[DEBUG] 2. After filter:", filtered.length);

  const transformed = transformData(filtered);
  console.log("[DEBUG] 3. After transform:", transformed.length);

  const result = aggregateData(transformed);
  console.log("[DEBUG] 4. After aggregate:", result);

  return result;
}
```

### Check Assumptions

```typescript
// Verify your assumptions
function getUser(id: string) {
  console.assert(typeof id === "string", "id should be string");
  console.assert(id.length > 0, "id should not be empty");

  const user = db.users.find(id);
  console.assert(user !== undefined, "user should exist");

  return user;
}
```

### Minimal Reproduction

```typescript
// Create isolated test case
it("should reproduce the bug", () => {
  // Minimal setup
  const input = { userId: "123", status: "active" };

  // Call the function
  const result = problematicFunction(input);

  // This fails - bug reproduced
  expect(result).toBe(expectedValue);
});
```

## Common Bug Categories

### 1. Off-by-One Errors

```typescript
// ❌ Bug: Missing last element
for (let i = 0; i < array.length - 1; i++)

// ✅ Fix
for (let i = 0; i < array.length; i++)
// or
for (let i = 0; i <= array.length - 1; i++)
```

### 2. Null/Undefined

```typescript
// ❌ Bug: Accessing property of undefined
const name = user.profile.name;

// ✅ Fix: Optional chaining + fallback
const name = user?.profile?.name ?? "Unknown";
```

### 3. Async Issues

```typescript
// ❌ Bug: Not awaiting async function
function getData() {
  const data = fetchData(); // Missing await
  return data.items; // data is Promise, not result
}

// ✅ Fix
async function getData() {
  const data = await fetchData();
  return data.items;
}
```

### 4. State Mutation

```typescript
// ❌ Bug: Mutating state directly
function addItem(items: Item[], newItem: Item) {
  items.push(newItem); // Mutates original
  return items;
}

// ✅ Fix: Return new array
function addItem(items: Item[], newItem: Item) {
  return [...items, newItem];
}
```

### 5. Scope/Closure Issues

```typescript
// ❌ Bug: Loop variable captured by reference
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 3, 3, 3

// ✅ Fix: Use let or IIFE
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Prints: 0, 1, 2
```

## Debug Report Format

```markdown
## Bug Report: [Brief Description]

### Symptoms

- What user observed
- Error messages

### Reproduction Steps

1. Step 1
2. Step 2
3. Bug occurs

### Root Cause

[Explanation of why the bug occurred]

### Fix

[Description of the fix]

### Files Changed

- `src/module/file.ts` - [what changed]

### Tests Added

- `src/module/file.test.ts` - [test description]

### Verification

- [x] Bug no longer reproduces
- [x] All tests pass
- [x] No regression in related features
```

## Anti-Patterns

### ❌ Don't Do This

- Fix symptoms without understanding cause
- Make multiple changes at once
- Skip adding regression tests
- Leave debug logging in code
- Assume you know the cause without verification

### ✅ Do This

- Reproduce before fixing
- One change at a time
- Verify each hypothesis
- Add test that would have caught the bug
- Clean up debug code
