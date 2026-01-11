# React Testing Standards

> Standards for testing React applications.

## Testing Stack

| Tool                  | Purpose           |
| --------------------- | ----------------- |
| Vitest                | Test runner       |
| React Testing Library | Component testing |
| MSW                   | API mocking       |
| Playwright            | E2E testing       |

---

## Component Testing

### Basic Component Test

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { UserCard } from './UserCard'

describe('UserCard', () => {
  const mockUser = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
  }

  it('should render user information', () => {
    render(<UserCard user={mockUser} />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('john@example.com')).toBeInTheDocument()
  })

  it('should call onSelect when clicked', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()

    render(<UserCard user={mockUser} onSelect={onSelect} />)

    await user.click(screen.getByRole('button'))

    expect(onSelect).toHaveBeenCalledWith(mockUser)
  })
})
```

### Testing with Providers

```typescript
// test/helpers.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = createTestQueryClient()

  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {ui}
      </BrowserRouter>
    </QueryClientProvider>
  )
}

// Usage
import { renderWithProviders } from '@/test/helpers'

it('should work with providers', () => {
  renderWithProviders(<MyComponent />)
})
```

---

## Hook Testing

### Custom Hook Test

```typescript
import { renderHook, act, waitFor } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useCounter());

    expect(result.current.count).toBe(0);
  });

  it("should increment", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });

  it("should initialize with custom value", () => {
    const { result } = renderHook(() => useCounter(10));

    expect(result.current.count).toBe(10);
  });
});
```

### Hook with React Query

```typescript
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useUser } from './useUser'

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('useUser', () => {
  it('should fetch user', async () => {
    const { result } = renderHook(() => useUser('123'), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(expectedUser)
  })
})
```

---

## API Mocking with MSW

### Setup

```typescript
// test/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: "1", name: "John" },
      { id: "2", name: "Jane" },
    ]);
  }),

  http.get("/api/users/:id", ({ params }) => {
    return HttpResponse.json({ id: params.id, name: "John" });
  }),

  http.post("/api/users", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json({ id: "3", ...body }, { status: 201 });
  }),
];

// test/mocks/server.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers";

export const server = setupServer(...handlers);

// test/setup.ts
import { server } from "./mocks/server";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Per-Test Override

```typescript
import { http, HttpResponse } from 'msw'
import { server } from '@/test/mocks/server'

it('should handle error', async () => {
  server.use(
    http.get('/api/users', () => {
      return HttpResponse.json(
        { error: 'Server error' },
        { status: 500 }
      )
    })
  )

  render(<UserList />)

  await waitFor(() => {
    expect(screen.getByText('Error loading users')).toBeInTheDocument()
  })
})
```

---

## Form Testing

```typescript
import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should submit with valid data', async () => {
    const onSubmit = vi.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })

  it('should show validation errors', async () => {
    const user = userEvent.setup()

    render(<LoginForm onSubmit={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /login/i }))

    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    expect(screen.getByText(/password is required/i)).toBeInTheDocument()
  })
})
```

---

## Accessibility Testing

```typescript
import { render } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

describe('UserCard', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<UserCard user={mockUser} />)

    const results = await axe(container)

    expect(results).toHaveNoViolations()
  })
})
```

---

## Snapshot Testing (Use Sparingly)

```typescript
// Only for stable, presentational components
it('should match snapshot', () => {
  const { container } = render(<Icon name="check" />)

  expect(container).toMatchSnapshot()
})
```

---

## E2E Testing with Playwright

### Page Object

```typescript
// e2e/pages/login.page.ts
import { Page } from "@playwright/test";

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email);
    await this.page.fill('[data-testid="password"]', password);
    await this.page.click('[data-testid="submit"]');
  }

  async getError() {
    return this.page.textContent('[data-testid="error"]');
  }
}
```

### E2E Test

```typescript
// e2e/tests/auth.spec.ts
import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test.describe("Authentication", () => {
  test("should login successfully", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("user@example.com", "password123");

    await expect(page).toHaveURL("/dashboard");
  });

  test("should show error for invalid credentials", async ({ page }) => {
    const loginPage = new LoginPage(page);

    await loginPage.goto();
    await loginPage.login("user@example.com", "wrong");

    expect(await loginPage.getError()).toBe("Invalid credentials");
  });
});
```

---

## Test Patterns

### Test IDs

```typescript
// ✅ Good: Use data-testid for test-specific selectors
<button data-testid="submit-button">Submit</button>

// Test
screen.getByTestId('submit-button')

// ✅ Better: Use accessible queries when possible
screen.getByRole('button', { name: /submit/i })
```

### Query Priority

```typescript
// Priority (from best to worst):
// 1. getByRole - accessible
// 2. getByLabelText - form fields
// 3. getByPlaceholderText - inputs
// 4. getByText - content
// 5. getByDisplayValue - form values
// 6. getByAltText - images
// 7. getByTitle - title attribute
// 8. getByTestId - last resort
```

---

## Anti-Patterns

### ❌ Avoid

```typescript
// Don't test implementation details
expect(component.state.isLoading).toBe(true);

// Don't use container.querySelector
container.querySelector(".my-class");

// Don't use hardcoded waits
await new Promise((r) => setTimeout(r, 1000));

// Don't share state between tests
let sharedUser;
beforeAll(() => {
  sharedUser = createUser();
});
```

### ✅ Do

```typescript
// Test behavior
expect(screen.getByText("Loading...")).toBeInTheDocument();

// Use RTL queries
screen.getByRole("button");

// Use waitFor
await waitFor(() => expect(element).toBeVisible());

// Independent tests
beforeEach(() => {
  user = createUser();
});
```
