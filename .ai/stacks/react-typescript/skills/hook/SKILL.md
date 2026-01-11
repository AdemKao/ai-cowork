---
name: react-hook
description: Create reusable custom hooks following React patterns. Use when creating hooks for state management, data fetching, or reusable logic.
---

# Custom Hook Development Skill

## Instructions

1. **Identify the Need**
   - What logic is being repeated?
   - What state does it manage?
   - What side effects does it have?

2. **Determine Location**

   | Type             | Location                    |
   | ---------------- | --------------------------- |
   | Shared           | `shared/hooks/`             |
   | Feature-specific | `features/{feature}/hooks/` |

3. **Design the API**
   - What parameters does it take?
   - What does it return?
   - Keep it simple and focused

4. **Implement the Hook**

5. **Write Tests**

6. **Export from Index**

## Hook Templates

### State Management Hook

```typescript
// hooks/useToggle.ts
import { useState, useCallback } from "react";

export function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => setValue((v) => !v), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);

  return {
    value,
    toggle,
    setTrue,
    setFalse,
  };
}

// Usage
const { value: isOpen, toggle, setFalse: close } = useToggle();
```

### Data Fetching Hook

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
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

// Usage
const { user, isLoading, error } = useUser(userId);
```

### Mutation Hook

```typescript
// hooks/useCreateUser.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/user";
import type { CreateUserData } from "@/types";

export function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateUserData) => userService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  return {
    createUser: mutation.mutate,
    createUserAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}

// Usage
const { createUser, isLoading } = useCreateUser();
createUser({ name: "John", email: "john@example.com" });
```

### Form Hook

```typescript
// hooks/useLoginForm.ts
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function useLoginForm(onSubmit: (data: LoginFormData) => void) {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return {
    register: form.register,
    handleSubmit,
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    reset: form.reset,
  };
}

// Usage
const { register, handleSubmit, errors } = useLoginForm(onLogin);
```

### Local Storage Hook

```typescript
// hooks/useLocalStorage.ts
import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  const remove = () => {
    localStorage.removeItem(key);
    setValue(initialValue);
  };

  return [value, setValue, remove] as const;
}

// Usage
const [theme, setTheme, removeTheme] = useLocalStorage("theme", "light");
```

### Debounced Value Hook

```typescript
// hooks/useDebounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [search, setSearch] = useState("");
const debouncedSearch = useDebounce(search, 300);

useEffect(() => {
  // API call with debounced value
  fetchResults(debouncedSearch);
}, [debouncedSearch]);
```

## Testing Hooks

```typescript
import { renderHook, act, waitFor } from "@testing-library/react";
import { useToggle } from "./useToggle";

describe("useToggle", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.value).toBe(false);
  });

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.value).toBe(true);
  });

  it("should toggle value", () => {
    const { result } = renderHook(() => useToggle());

    act(() => {
      result.current.toggle();
    });

    expect(result.current.value).toBe(true);
  });
});
```

## Checklist

- [ ] Name starts with `use`
- [ ] Single responsibility
- [ ] Returns object (easier to extend)
- [ ] Callbacks memoized with useCallback
- [ ] Expensive values memoized with useMemo
- [ ] Tests written
- [ ] Exported from index
- [ ] TypeScript types correct
