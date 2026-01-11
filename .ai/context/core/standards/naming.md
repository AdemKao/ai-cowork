# Naming Standards

> Universal naming conventions for consistent, readable code.

## General Principles

1. **Clarity over brevity**: `getUserById` > `getUsr`
2. **Descriptive**: Names should reveal intent
3. **Consistent**: Same concept = same naming pattern
4. **Searchable**: Avoid single-letter variables (except loops)

---

## Case Conventions

| Type                   | Convention               | Example                          |
| ---------------------- | ------------------------ | -------------------------------- |
| **Variables**          | camelCase                | `userName`, `isLoading`          |
| **Functions**          | camelCase                | `getUserById`, `handleSubmit`    |
| **Constants**          | SCREAMING_SNAKE          | `MAX_RETRIES`, `API_BASE_URL`    |
| **Classes**            | PascalCase               | `UserService`, `AuthProvider`    |
| **Interfaces**         | PascalCase (no I prefix) | `User`, `AuthConfig`             |
| **Types**              | PascalCase               | `UserRole`, `ApiResponse`        |
| **Enums**              | PascalCase               | `UserStatus`, `OrderState`       |
| **Components**         | PascalCase               | `LoginPage`, `UserCard`          |
| **Files (components)** | PascalCase               | `LoginPage.tsx`, `UserCard.tsx`  |
| **Files (utilities)**  | kebab-case               | `date-utils.ts`, `api-client.ts` |
| **Directories**        | kebab-case               | `user-profile/`, `auth-service/` |

---

## Naming Patterns

### Booleans

Prefix with `is`, `has`, `can`, `should`:

```typescript
// ✅ Good
const isLoading = true;
const hasPermission = user.role === "admin";
const canEdit = hasPermission && !isLocked;
const shouldRefresh = tokenExpired;

// ❌ Bad
const loading = true;
const permission = true;
const edit = true;
```

### Functions

Use verb + noun pattern:

```typescript
// ✅ Good
function getUser(id: string): User;
function createOrder(data: OrderData): Order;
function updateProfile(id: string, data: ProfileData): Profile;
function deleteComment(id: string): void;
function validateEmail(email: string): boolean;
function handleSubmit(event: FormEvent): void;

// ❌ Bad
function user(id: string): User; // Missing verb
function doStuff(): void; // Too vague
function process(): void; // What process?
```

### Event Handlers

Prefix with `handle` or `on`:

```typescript
// ✅ Good
const handleClick = () => {};
const handleSubmit = (e: FormEvent) => {};
const onUserSelect = (user: User) => {};

// ❌ Bad
const click = () => {};
const submit = (e: FormEvent) => {};
```

### Async Functions

Consider suffix `Async` for clarity (optional):

```typescript
// Both acceptable
async function fetchUser(id: string): Promise<User>;
async function fetchUserAsync(id: string): Promise<User>;
```

---

## Component Naming

### React Components

```typescript
// Page components: [Feature]Page
(LoginPage, DashboardPage, UserProfilePage);

// Feature components: [Feature][Type]
(UserCard, PropertyList, SearchBar);

// UI components: [Element][Variant]
(Button, IconButton, PrimaryButton);
(Input, SearchInput, PasswordInput);

// Layout components: [Layout]Layout
(MainLayout, AuthLayout, DashboardLayout);

// HOCs: with[Feature]
(withAuth, withLoading, withErrorBoundary);

// Hooks: use[Feature]
(useAuth, useUser, useLocalStorage);
```

### Props Interfaces

```typescript
// Pattern: [ComponentName]Props
interface LoginPageProps {
  redirectUrl?: string;
}

interface UserCardProps {
  user: User;
  onSelect?: (user: User) => void;
}
```

---

## File Naming

### By Type

```
components/
├── UserCard.tsx           # Component (PascalCase)
├── UserCard.test.tsx      # Test file
├── UserCard.stories.tsx   # Storybook
└── index.ts               # Barrel export

hooks/
├── useAuth.ts             # Hook (camelCase with use prefix)
├── useAuth.test.ts
└── index.ts

services/
├── auth-service.ts        # Service (kebab-case)
├── auth-service.test.ts
└── index.ts

utils/
├── date-utils.ts          # Utility (kebab-case)
├── date-utils.test.ts
└── index.ts
```

### Test Files

```
# Colocated with source
UserCard.tsx
UserCard.test.tsx

# Or in __tests__ directory
components/
├── UserCard.tsx
└── __tests__/
    └── UserCard.test.tsx
```

---

## API Naming

### Endpoints (REST)

```
# Resource naming (plural nouns)
GET    /api/users          # List users
GET    /api/users/:id      # Get user
POST   /api/users          # Create user
PUT    /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user

# Nested resources
GET    /api/users/:id/orders
POST   /api/users/:id/orders

# Actions (when CRUD doesn't fit)
POST   /api/users/:id/verify-email
POST   /api/orders/:id/cancel
```

### Service Methods

```typescript
interface UserService {
  // CRUD operations
  getAll(): Promise<User[]>;
  getById(id: string): Promise<User>;
  create(data: CreateUserData): Promise<User>;
  update(id: string, data: UpdateUserData): Promise<User>;
  delete(id: string): Promise<void>;

  // Custom operations
  verifyEmail(id: string, token: string): Promise<void>;
  resetPassword(email: string): Promise<void>;
}
```

---

## Database Naming

### Tables

```sql
-- Plural, snake_case
users
user_roles
order_items
property_listings
```

### Columns

```sql
-- snake_case
id
user_id          -- Foreign key
created_at
updated_at
is_active        -- Boolean
```

---

## Abbreviations

### Acceptable Abbreviations

| Abbreviation | Full Form                         |
| ------------ | --------------------------------- |
| `id`         | identifier                        |
| `url`        | uniform resource locator          |
| `api`        | application programming interface |
| `db`         | database                          |
| `auth`       | authentication                    |
| `config`     | configuration                     |
| `props`      | properties                        |
| `params`     | parameters                        |
| `args`       | arguments                         |
| `err`        | error                             |
| `req`        | request                           |
| `res`        | response                          |
| `ctx`        | context                           |
| `env`        | environment                       |
| `max`        | maximum                           |
| `min`        | minimum                           |
| `num`        | number                            |
| `prev`       | previous                          |
| `temp`       | temporary                         |

### Avoid These

| ❌ Avoid | ✅ Use Instead |
| -------- | -------------- |
| `usr`    | `user`         |
| `msg`    | `message`      |
| `btn`    | `button`       |
| `mgr`    | `manager`      |
| `cnt`    | `count`        |
| `val`    | `value`        |
| `idx`    | `index`        |

---

## Anti-Patterns

### ❌ Bad Names

```typescript
// Too short
const u = getUser();
const d = new Date();

// Too generic
const data = fetchData();
const result = process();
const info = getInfo();

// Misleading
const userList = getUser(); // Returns single user, not list

// Hungarian notation (outdated)
const strName = "John";
const arrUsers = [];
const objConfig = {};
```

### ✅ Good Names

```typescript
const currentUser = getUser();
const createdAt = new Date();
const userProfile = fetchUserProfile();
const validationResult = validateInput();
const user = getUserById(id);

const name = "John";
const users: User[] = [];
const config: Config = {};
```
