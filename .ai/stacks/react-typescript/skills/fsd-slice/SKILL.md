---
name: fsd-slice
description: Create a new Feature-Sliced Design (FSD) slice with proper structure. Use when creating entities, features, widgets, or pages in FSD architecture.
---

# FSD Slice Creation

## Instructions
- Creating a new entity (User, Product, Order)
- Creating a new feature (login, create-post, filter-products)
- Creating a new widget (header, sidebar, user-table)
- Creating a new page

## Input Required

1. **Layer**: `entities` | `features` | `widgets` | `pages`
2. **Slice name**: kebab-case name (e.g., `user`, `create-post`, `header`)
3. **Segments needed**: Which segments to create (`ui`, `model`, `api`, `lib`)

## Procedure

### Step 1: Determine Layer and Structure

Based on the layer, create appropriate structure:

```
For entities/{name}/:
├── ui/              # Required: Entity UI components
├── model/           # Required: Types, store
├── api/             # Optional: CRUD operations
├── lib/             # Optional: Entity utilities
└── index.ts         # Required: Public API

For features/{name}/:
├── ui/              # Required: Feature UI components
├── model/           # Optional: Feature state, schemas
├── api/             # Optional: Feature-specific API
├── lib/             # Optional: Feature utilities
└── index.ts         # Required: Public API

For widgets/{name}/:
├── ui/              # Required: Widget components
├── model/           # Optional: Widget-specific state
├── lib/             # Optional: Widget utilities
└── index.ts         # Required: Public API

For pages/{name}/:
├── ui/              # Required: Page components
└── index.ts         # Required: Public API
```

### Step 2: Create Directory Structure

```bash
# Example: Creating user entity
mkdir -p src/entities/user/{ui,model,api,lib}

# Example: Creating auth feature
mkdir -p src/features/auth/{ui,model,api}

# Example: Creating header widget
mkdir -p src/widgets/header/ui
```

### Step 3: Create Base Files

#### For Entities

```typescript
// src/entities/user/model/user.types.ts
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  createdAt: Date
}

export interface UserState {
  currentUser: User | null
  isLoading: boolean
}
```

```typescript
// src/entities/user/ui/UserCard.tsx
import type { User } from '../model/user.types'

interface UserCardProps {
  user: User
  onClick?: () => void
}

export function UserCard({ user, onClick }: UserCardProps) {
  return (
    <div onClick={onClick} className="user-card">
      <img src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}
```

```typescript
// src/entities/user/api/user.api.ts
import { apiClient } from '@/shared/api'
import type { User } from '../model/user.types'

export const userApi = {
  getById: (id: string) => 
    apiClient.get<User>(`/users/${id}`),
  
  getAll: () => 
    apiClient.get<User[]>('/users'),
  
  update: (id: string, data: Partial<User>) =>
    apiClient.patch<User>(`/users/${id}`, data),
}
```

```typescript
// src/entities/user/index.ts
// UI
export { UserCard } from './ui/UserCard'
export { UserAvatar } from './ui/UserAvatar'

// Model
export type { User, UserState } from './model/user.types'
export { useUserStore } from './model/user.store'

// API
export { userApi } from './api/user.api'
```

#### For Features

```typescript
// src/features/auth/model/auth.schema.ts
import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
```

```typescript
// src/features/auth/model/auth.store.ts
import { create } from 'zustand'
import type { User } from '@/entities/user'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (user: User) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}))
```

```typescript
// src/features/auth/ui/LoginForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@/shared/ui'
import { loginSchema, type LoginFormData } from '../model/auth.schema'
import { useLogin } from '../api/auth.api'

export function LoginForm() {
  const { mutate: login, isPending } = useLogin()
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormData) => {
    login(data)
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <Input
        {...form.register('email')}
        placeholder="Email"
        error={form.formState.errors.email?.message}
      />
      <Input
        {...form.register('password')}
        type="password"
        placeholder="Password"
        error={form.formState.errors.password?.message}
      />
      <Button type="submit" loading={isPending}>
        Login
      </Button>
    </form>
  )
}
```

```typescript
// src/features/auth/index.ts
// UI
export { LoginForm } from './ui/LoginForm'
export { LogoutButton } from './ui/LogoutButton'

// Model
export { useAuthStore } from './model/auth.store'
export { loginSchema, type LoginFormData } from './model/auth.schema'
```

### Step 4: Create Public API (index.ts)

Always create an `index.ts` that exports only what should be public:

```typescript
// Pattern for index.ts
// 1. UI exports
export { ComponentA } from './ui/ComponentA'
export { ComponentB } from './ui/ComponentB'

// 2. Model exports (types, stores, schemas)
export type { TypeA, TypeB } from './model/types'
export { useStore } from './model/store'

// 3. API exports (optional)
export { sliceApi } from './api/slice.api'

// 4. Lib exports (optional)
export { utilFunction } from './lib/util'
```

### Step 5: Verify Import Rules

After creation, verify the slice follows FSD import rules:

```
✅ Allowed imports:
- entities/ → shared/
- features/ → entities/, shared/
- widgets/ → features/, entities/, shared/
- pages/ → widgets/, features/, entities/, shared/

❌ Forbidden imports:
- Cross-imports within same layer
- Importing from higher layers
- Direct segment imports (use index.ts)
```

## Output

Created slice structure with:
- [ ] Directory structure created
- [ ] Type definitions in `model/`
- [ ] UI components in `ui/`
- [ ] API functions in `api/` (if needed)
- [ ] Public API in `index.ts`
- [ ] Follows FSD import rules

## Examples

### Create User Entity
```
Layer: entities
Name: user
Segments: ui, model, api
```

### Create Auth Feature
```
Layer: features
Name: auth
Segments: ui, model, api
```

### Create Header Widget
```
Layer: widgets
Name: header
Segments: ui
```
