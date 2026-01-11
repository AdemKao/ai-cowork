# TypeScript Standards

> Standards for TypeScript development in React projects.

## Configuration

### Strict Mode

```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

---

## Types vs Interfaces

### Use Interfaces for Objects

```typescript
// ✅ Good: Interface for object shapes
interface User {
  id: string;
  name: string;
  email: string;
}

interface UserService {
  getById(id: string): Promise<User>;
  create(data: CreateUserData): Promise<User>;
}
```

### Use Types for Unions, Intersections, Utilities

```typescript
// ✅ Good: Type for unions
type Status = "pending" | "active" | "inactive";
type Role = "admin" | "user" | "guest";

// ✅ Good: Type for intersections
type AdminUser = User & { permissions: string[] };

// ✅ Good: Type for mapped/utility types
type PartialUser = Partial<User>;
type UserKeys = keyof User;
```

---

## Naming Conventions

| Type      | Convention         | Example                   |
| --------- | ------------------ | ------------------------- |
| Interface | PascalCase         | `User`, `AuthService`     |
| Type      | PascalCase         | `UserRole`, `ApiResponse` |
| Enum      | PascalCase         | `UserStatus`              |
| Generic   | Single uppercase   | `T`, `K`, `V`             |
| Props     | `{Component}Props` | `ButtonProps`             |

```typescript
// ❌ Bad: Hungarian notation
interface IUser {}
type TUserRole = string;

// ✅ Good: Clean names
interface User {}
type UserRole = string;
```

---

## Type Inference

### Let TypeScript Infer When Obvious

```typescript
// ✅ Good: Let TS infer
const name = "John"; // string
const count = 42; // number
const users = []; // never[] - need explicit type!

// ✅ Good: Explicit when needed
const users: User[] = [];
const config: Config = { debug: true };
```

### Explicit Return Types for Exports

```typescript
// ✅ Good: Explicit return type for public functions
export function getUser(id: string): Promise<User> {
  return api.get(`/users/${id}`);
}

// ✅ Good: Inferred for internal functions
const formatName = (user: User) => `${user.firstName} ${user.lastName}`;
```

---

## Utility Types

### Common Utility Types

```typescript
// Partial - all properties optional
type PartialUser = Partial<User>;
// { id?: string; name?: string; email?: string }

// Required - all properties required
type RequiredUser = Required<PartialUser>;

// Pick - select specific properties
type UserBasic = Pick<User, "id" | "name">;
// { id: string; name: string }

// Omit - exclude specific properties
type UserWithoutId = Omit<User, "id">;
// { name: string; email: string }

// Record - key-value map
type UserMap = Record<string, User>;
// { [key: string]: User }

// ReturnType - get function return type
type ApiResult = ReturnType<typeof fetchUser>;
```

### Custom Utility Types

```typescript
// Make specific properties optional
type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
type CreateUserData = PartialBy<User, "id" | "createdAt">;

// Make specific properties required
type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;
```

---

## Generics

### Function Generics

```typescript
// ✅ Good: Generic function
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}

// With constraints
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

### Component Generics

```typescript
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return (
    <ul>
      {items.map(item => (
        <li key={keyExtractor(item)}>{renderItem(item)}</li>
      ))}
    </ul>
  )
}

// Usage
<List<User>
  items={users}
  renderItem={user => <span>{user.name}</span>}
  keyExtractor={user => user.id}
/>
```

---

## Discriminated Unions

### Pattern for State Machines

```typescript
// ✅ Good: Discriminated union
type RequestState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error }

function UserProfile({ state }: { state: RequestState<User> }) {
  switch (state.status) {
    case 'idle':
      return null
    case 'loading':
      return <Spinner />
    case 'success':
      return <Profile user={state.data} />  // TS knows data exists
    case 'error':
      return <Error message={state.error.message} />  // TS knows error exists
  }
}
```

### API Response Types

```typescript
type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: string };

async function fetchUser(id: string): Promise<ApiResponse<User>> {
  try {
    const user = await api.get(`/users/${id}`);
    return { ok: true, data: user };
  } catch (e) {
    return { ok: false, error: e.message };
  }
}
```

---

## Type Guards

### Custom Type Guards

```typescript
// Type predicate
function isUser(value: unknown): value is User {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "email" in value
  );
}

// Usage
if (isUser(data)) {
  console.log(data.email); // TS knows it's User
}
```

### Assertion Functions

```typescript
function assertUser(value: unknown): asserts value is User {
  if (!isUser(value)) {
    throw new Error("Not a valid User");
  }
}

// Usage
assertUser(data);
console.log(data.email); // TS knows it's User after assertion
```

---

## Enums vs Const Objects

### Prefer Const Objects

```typescript
// ❌ Avoid: Enum (runtime overhead)
enum UserRole {
  Admin = "admin",
  User = "user",
}

// ✅ Good: Const object
const UserRole = {
  Admin: "admin",
  User: "user",
} as const;

type UserRole = (typeof UserRole)[keyof typeof UserRole];
// 'admin' | 'user'
```

---

## Null Handling

### Prefer Undefined Over Null

```typescript
// ✅ Good: Use undefined for optional values
interface User {
  name: string;
  nickname?: string; // string | undefined
}

// ✅ Good: Explicit null for intentional absence
interface CacheEntry<T> {
  value: T | null; // null means "explicitly no value"
  expiresAt: Date;
}
```

### Non-Null Assertion (Use Sparingly)

```typescript
// ⚠️ Use only when you're 100% sure
const element = document.getElementById("app")!;

// ✅ Better: Type guard or optional chaining
const element = document.getElementById("app");
if (!element) throw new Error("App element not found");
```

---

## Anti-Patterns

### ❌ Avoid

```typescript
// Don't use `any`
function process(data: any) {} // ❌
function process(data: unknown) {} // ✅

// Don't use `!` without certainty
const user = getUser()!; // ❌
const user = getUser();
if (!user) return; // ✅

// Don't use type assertions unnecessarily
const user = data as User; // ❌ (unless you validated)
if (isUser(data)) {
  /* use data as User */
} // ✅

// Don't ignore TypeScript errors
// @ts-ignore  // ❌
// @ts-expect-error - [reason]  // ✅ (with explanation)
```
