# Testing Standards

> Universal testing guidelines for quality and maintainability.

## Testing Philosophy

1. **Test behavior, not implementation**
2. **Write tests first (TDD) when possible**
3. **Each test should be independent**
4. **Fast tests = more runs = better quality**

---

## Test Pyramid

```
        ╱╲
       ╱  ╲         E2E Tests (5-10%)
      ╱────╲        - Critical user journeys
     ╱      ╲       - Slow, expensive
    ╱────────╲
   ╱          ╲     Integration Tests (20-30%)
  ╱────────────╲    - Component + API tests
 ╱              ╲   - Medium speed
╱────────────────╲
        ▼           Unit Tests (60-70%)
                    - Functions, classes
                    - Fast, cheap
```

---

## Coverage Targets

| Layer                    | Target | Priority |
| ------------------------ | ------ | -------- |
| **Services**             | 70%+   | MUST     |
| **Utilities**            | 80%+   | MUST     |
| **Hooks**                | 70%+   | MUST     |
| **Components**           | 50%+   | SHOULD   |
| **E2E (critical paths)** | 100%   | MUST     |

---

## Test Structure

### AAA Pattern (Arrange-Act-Assert)

```typescript
describe("UserService", () => {
  describe("createUser", () => {
    it("should create user with valid data", async () => {
      // Arrange
      const userData = {
        email: "test@example.com",
        name: "Test User",
      };
      const service = new UserService(mockDb);

      // Act
      const result = await service.createUser(userData);

      // Assert
      expect(result).toMatchObject({
        id: expect.any(String),
        email: userData.email,
        name: userData.name,
      });
    });
  });
});
```

### BDD Style Comments

```typescript
it("should reject invalid email", async () => {
  // #given - invalid email
  const invalidEmail = "not-an-email";

  // #when - attempt to create user
  const createUser = () => service.createUser({ email: invalidEmail });

  // #then - should throw validation error
  await expect(createUser).rejects.toThrow("Invalid email format");
});
```

---

## Naming Conventions

### Test Files

```
# Colocated (preferred)
src/
├── services/
│   ├── auth-service.ts
│   └── auth-service.test.ts
├── components/
│   ├── LoginForm.tsx
│   └── LoginForm.test.tsx

# Or in __tests__ directory
src/
├── services/
│   ├── auth-service.ts
│   └── __tests__/
│       └── auth-service.test.ts
```

### Test Descriptions

```typescript
// ✅ Good: Descriptive, behavior-focused
describe("AuthService", () => {
  describe("login", () => {
    it("should return user when credentials are valid", async () => {});
    it("should throw InvalidCredentialsError when password is wrong", async () => {});
    it("should lock account after 5 failed attempts", async () => {});
  });
});

// ❌ Bad: Implementation-focused
describe("AuthService", () => {
  it("test login", () => {});
  it("works correctly", () => {});
  it("test 1", () => {});
});
```

---

## Unit Tests

### What to Test

- Pure functions
- Service methods
- Utility functions
- Validation logic
- State transformations

### Mocking

```typescript
// ✅ Good: Mock dependencies, not the unit under test
const mockDb = {
  users: {
    findOne: vi.fn(),
    create: vi.fn(),
  },
};
const service = new UserService(mockDb);

// ❌ Bad: Don't mock the unit itself
vi.spyOn(service, "createUser"); // Testing the mock, not the code
```

### Edge Cases

Always test:

```typescript
describe("parseNumber", () => {
  // Happy path
  it("should parse valid number", () => {
    expect(parseNumber("42")).toBe(42);
  });

  // Edge cases
  it("should handle zero", () => {
    expect(parseNumber("0")).toBe(0);
  });

  it("should handle negative numbers", () => {
    expect(parseNumber("-5")).toBe(-5);
  });

  it("should handle decimal numbers", () => {
    expect(parseNumber("3.14")).toBe(3.14);
  });

  // Error cases
  it("should throw for non-numeric string", () => {
    expect(() => parseNumber("abc")).toThrow();
  });

  it("should throw for empty string", () => {
    expect(() => parseNumber("")).toThrow();
  });

  it("should throw for null", () => {
    expect(() => parseNumber(null)).toThrow();
  });
});
```

---

## Integration Tests

### Component Tests

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const onSubmit = vi.fn()
    render(<LoginForm onSubmit={onSubmit} />)

    // Fill form
    await userEvent.type(screen.getByLabelText('Email'), 'test@example.com')
    await userEvent.type(screen.getByLabelText('Password'), 'password123')

    // Submit
    await userEvent.click(screen.getByRole('button', { name: 'Login' }))

    // Verify
    expect(onSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

### Hook Tests

```typescript
import { renderHook, act } from "@testing-library/react";
import { useCounter } from "./useCounter";

describe("useCounter", () => {
  it("should increment counter", () => {
    const { result } = renderHook(() => useCounter());

    act(() => {
      result.current.increment();
    });

    expect(result.current.count).toBe(1);
  });
});
```

---

## E2E Tests

### Critical Path Coverage

Always E2E test:

- User registration/login
- Core business flows
- Payment/checkout
- Error recovery

### Page Object Pattern

```typescript
// e2e/pages/login-page.ts
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

  async getErrorMessage() {
    return this.page.textContent('[data-testid="error"]');
  }
}

// e2e/tests/login.spec.ts
test("successful login", async ({ page }) => {
  const loginPage = new LoginPage(page);

  await loginPage.goto();
  await loginPage.login("user@example.com", "password");

  await expect(page).toHaveURL("/dashboard");
});
```

---

## Test Data

### Factories

```typescript
// test/factories/user.ts
export function createUser(overrides?: Partial<User>): User {
  return {
    id: faker.string.uuid(),
    email: faker.internet.email(),
    name: faker.person.fullName(),
    createdAt: new Date(),
    ...overrides,
  };
}

// Usage
const user = createUser({ email: "specific@email.com" });
```

### Fixtures

```typescript
// test/fixtures/users.json
{
  "validUser": {
    "email": "valid@example.com",
    "password": "ValidPass123!"
  },
  "adminUser": {
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## Anti-Patterns

### ❌ Don't Do This

```typescript
// Testing implementation details
expect(component.state.isLoading).toBe(true);

// Sharing state between tests
let user: User;
beforeAll(() => {
  user = createUser();
});

// Testing multiple things
it("should login, redirect, and show welcome", async () => {});

// Hardcoded waits
await new Promise((r) => setTimeout(r, 1000));

// Ignoring async
it("should fetch user", () => {
  fetchUser(); // No await!
  expect(user).toBeDefined();
});
```

### ✅ Do This

```typescript
// Testing behavior
expect(screen.getByText("Loading...")).toBeInTheDocument();

// Independent tests
beforeEach(() => {
  user = createUser();
});

// One assertion per test (conceptually)
it("should login successfully", async () => {});
it("should redirect to dashboard", async () => {});

// Wait for conditions
await waitFor(() => expect(element).toBeVisible());

// Proper async handling
it("should fetch user", async () => {
  const user = await fetchUser();
  expect(user).toBeDefined();
});
```

---

## CI Integration

```yaml
# .github/workflows/test.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v4
    - uses: pnpm/action-setup@v2

    - name: Install dependencies
      run: pnpm install

    - name: Run unit tests
      run: pnpm test

    - name: Run E2E tests
      run: pnpm test:e2e

    - name: Upload coverage
      uses: codecov/codecov-action@v3
```
