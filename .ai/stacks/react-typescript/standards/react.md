# React Standards

> Standards for React application development.

## Component Structure

### Functional Components Only

```typescript
// ✅ Good: Functional component with TypeScript
interface UserCardProps {
  user: User
  onSelect?: (user: User) => void
}

export function UserCard({ user, onSelect }: UserCardProps): React.ReactElement {
  return (
    <div onClick={() => onSelect?.(user)}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  )
}

// ❌ Bad: Class component
class UserCard extends React.Component {}
```

### Component File Structure

```typescript
// 1. Imports (external → internal → relative → types)
import { useState, useCallback } from 'react'
import { Button } from '@/shared/components/ui/button'
import { formatDate } from '@/shared/utils'
import type { User } from './types'

// 2. Types/Interfaces
interface UserCardProps {
  user: User
  onSelect?: (user: User) => void
  className?: string
}

// 3. Component
export function UserCard({ user, onSelect, className }: UserCardProps): React.ReactElement {
  // Hooks first
  const [isHovered, setIsHovered] = useState(false)

  // Handlers
  const handleClick = useCallback(() => {
    onSelect?.(user)
  }, [onSelect, user])

  // Render
  return (
    <div className={className} onClick={handleClick}>
      {/* JSX */}
    </div>
  )
}

// 4. Default export (optional, named export preferred)
```

---

## Hooks

### Custom Hook Pattern

```typescript
// hooks/useUser.ts
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/user";

export function useUser(userId: string) {
  const query = useQuery({
    queryKey: ["user", userId],
    queryFn: () => userService.getById(userId),
    enabled: !!userId,
  });

  return {
    user: query.data,
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
```

### Hook Rules

1. **Always start with `use`**: `useAuth`, `useUser`, `useLocalStorage`
2. **One responsibility**: Each hook does one thing
3. **Return object** for multiple values (easier to extend)
4. **Memoize callbacks** with `useCallback`
5. **Memoize values** with `useMemo` when expensive

---

## State Management

### Local State (useState)

```typescript
// ✅ Good: Simple local state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState<FormData>({ name: "", email: "" });

// ✅ Good: Derived state (compute, don't store)
const fullName = `${firstName} ${lastName}`;
const isValid = email.includes("@") && password.length >= 8;
```

### Server State (TanStack Query)

```typescript
// ✅ Good: Use React Query for server state
const { data: users, isLoading } = useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
});

const mutation = useMutation({
  mutationFn: createUser,
  onSuccess: () => queryClient.invalidateQueries(["users"]),
});
```

### Global State (Zustand)

```typescript
// ✅ Good: Zustand for global client state
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));
```

---

## Props

### Props Interface Naming

```typescript
// Pattern: {ComponentName}Props
interface ButtonProps {}
interface UserCardProps {}
interface LoginFormProps {}
```

### Children Prop

```typescript
interface LayoutProps {
  children: React.ReactNode; // For any renderable content
}

interface RenderProps {
  children: (data: Data) => React.ReactElement; // For render props
}
```

### Event Handler Props

```typescript
interface FormProps {
  onSubmit: (data: FormData) => void; // void for fire-and-forget
  onSubmitAsync: (data: FormData) => Promise<void>; // Promise for async
  onChange?: (value: string) => void; // Optional with ?
}
```

---

## Patterns

### Compound Components

```typescript
// Usage
<Select>
  <Select.Trigger>Choose option</Select.Trigger>
  <Select.Content>
    <Select.Item value="1">Option 1</Select.Item>
    <Select.Item value="2">Option 2</Select.Item>
  </Select.Content>
</Select>
```

### Render Props

```typescript
interface DataFetcherProps<T> {
  url: string
  children: (data: T, loading: boolean) => React.ReactElement
}

function DataFetcher<T>({ url, children }: DataFetcherProps<T>) {
  const { data, isLoading } = useQuery({ queryKey: [url], queryFn: () => fetch(url) })
  return children(data as T, isLoading)
}

// Usage
<DataFetcher url="/api/users">
  {(users, loading) => loading ? <Spinner /> : <UserList users={users} />}
</DataFetcher>
```

### Higher-Order Components (HOC)

```typescript
// Use sparingly - prefer hooks
function withAuth<P extends object>(Component: React.ComponentType<P>) {
  return function AuthenticatedComponent(props: P) {
    const { user } = useAuth()
    if (!user) return <Navigate to="/login" />
    return <Component {...props} />
  }
}
```

---

## Performance

### Memoization

```typescript
// useMemo for expensive computations
const sortedUsers = useMemo(() =>
  users.sort((a, b) => a.name.localeCompare(b.name)),
  [users]
)

// useCallback for stable function references
const handleClick = useCallback(() => {
  onSelect(user)
}, [onSelect, user])

// React.memo for component memoization
const UserCard = React.memo(function UserCard({ user }: UserCardProps) {
  return <div>{user.name}</div>
})
```

### Code Splitting

```typescript
// Lazy load routes
const Dashboard = React.lazy(() => import('./pages/Dashboard'))

// With Suspense
<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## Testing

### Component Testing

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  it('should display user name', () => {
    render(<UserCard user={{ name: 'John', email: 'john@example.com' }} />)
    expect(screen.getByText('John')).toBeInTheDocument()
  })

  it('should call onSelect when clicked', async () => {
    const onSelect = vi.fn()
    render(<UserCard user={mockUser} onSelect={onSelect} />)

    await userEvent.click(screen.getByRole('button'))

    expect(onSelect).toHaveBeenCalledWith(mockUser)
  })
})
```

### Hook Testing

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should increment", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## Anti-Patterns

### ❌ Avoid

```typescript
// Don't use index as key for dynamic lists
{items.map((item, index) => <Item key={index} />)}

// Don't mutate state directly
state.items.push(newItem)  // ❌
setItems([...items, newItem])  // ✅

// Don't use useEffect for derived state
useEffect(() => {
  setFullName(`${first} ${last}`)  // ❌
}, [first, last])
const fullName = `${first} ${last}`  // ✅

// Don't create functions inside render
<Button onClick={() => handleClick(id)} />  // ❌ (sometimes ok)
const handleClick = useCallback(() => {}, [])  // ✅
```
