# Frontend BDD/TDD Workflow

> Behavior-Driven and Test-Driven Development for frontend applications.

## Overview

```
Feature Spec → Component Tests → Implementation → Integration Tests → E2E Tests
```

Frontend testing focuses on:
- **User interactions** - What users can do
- **Visual behavior** - What users see
- **State management** - How data flows
- **Integration** - How components work together

---

## Test Pyramid (Frontend)

```
        /   E2E    \      ← Few: Critical user journeys
       /  Integration\    ← Some: Component interactions
      /    Component   \  ← Many: Isolated component tests
     /       Unit       \ ← Many: Utilities, hooks, helpers
```

| Level | Scope | Tools | Speed |
|-------|-------|-------|-------|
| Unit | Functions, hooks | Vitest/Jest | Fast |
| Component | Single component | Testing Library | Fast |
| Integration | Multiple components | Testing Library | Medium |
| E2E | Full user flows | Playwright/Cypress | Slow |

---

## BDD Workflow

### Step 1: Write Feature Spec

Start with user-facing behavior in Gherkin format:

```gherkin
# features/login.feature

Feature: User Login
  As a registered user
  I want to log into my account
  So that I can access my dashboard

  Background:
    Given the login page is displayed

  Scenario: Successful login
    When I enter valid credentials
    And I click the login button
    Then I should be redirected to the dashboard
    And I should see my username in the header

  Scenario: Invalid password
    When I enter a valid email
    And I enter an incorrect password
    And I click the login button
    Then I should see an error message "Invalid credentials"
    And I should remain on the login page

  Scenario: Empty form submission
    When I click the login button without entering credentials
    Then I should see validation errors for email and password
```

### Step 2: Convert to Test Cases

```typescript
// src/features/auth/LoginForm.test.tsx

describe('LoginForm', () => {
  describe('Successful login', () => {
    it('should redirect to dashboard after valid login', async () => {
      // Given
      render(<LoginForm />);
      
      // When
      await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'password123');
      await userEvent.click(screen.getByRole('button', { name: /login/i }));
      
      // Then
      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
      });
    });
  });

  describe('Invalid password', () => {
    it('should show error message for invalid credentials', async () => {
      // Given
      server.use(
        http.post('/api/auth/login', () => {
          return HttpResponse.json(
            { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' },
            { status: 401 }
          );
        })
      );
      render(<LoginForm />);
      
      // When
      await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
      await userEvent.type(screen.getByLabelText(/password/i), 'wrongpassword');
      await userEvent.click(screen.getByRole('button', { name: /login/i }));
      
      // Then
      expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });

  describe('Empty form submission', () => {
    it('should show validation errors when submitting empty form', async () => {
      // Given
      render(<LoginForm />);
      
      // When
      await userEvent.click(screen.getByRole('button', { name: /login/i }));
      
      // Then
      expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });
  });
});
```

---

## TDD Workflow

### Red-Green-Refactor Cycle

```
1. RED    → Write failing test
2. GREEN  → Write minimum code to pass
3. REFACTOR → Improve code, keep tests green
```

### Example: Building a SearchInput Component

#### Step 1: RED - Write Failing Test

```typescript
// src/components/SearchInput.test.tsx

describe('SearchInput', () => {
  it('should render an input with placeholder', () => {
    render(<SearchInput placeholder="Search..." />);
    
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });
});
```

#### Step 2: GREEN - Make It Pass

```typescript
// src/components/SearchInput.tsx

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
  return <input placeholder={placeholder} />;
}
```

#### Step 3: Add More Tests (RED again)

```typescript
describe('SearchInput', () => {
  it('should render an input with placeholder', () => { /* ... */ });
  
  it('should call onChange with debounced value', async () => {
    const handleChange = vi.fn();
    render(<SearchInput onChange={handleChange} debounceMs={300} />);
    
    await userEvent.type(screen.getByRole('textbox'), 'hello');
    
    // Should not call immediately
    expect(handleChange).not.toHaveBeenCalled();
    
    // Should call after debounce
    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith('hello');
    }, { timeout: 400 });
  });
  
  it('should show loading indicator when isLoading is true', () => {
    render(<SearchInput isLoading />);
    
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
```

#### Step 4: GREEN - Implement Features

```typescript
// src/components/SearchInput.tsx

interface SearchInputProps {
  placeholder?: string;
  onChange?: (value: string) => void;
  debounceMs?: number;
  isLoading?: boolean;
}

export function SearchInput({ 
  placeholder, 
  onChange, 
  debounceMs = 300,
  isLoading 
}: SearchInputProps) {
  const [value, setValue] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange?.(value);
    }, debounceMs);
    
    return () => clearTimeout(timer);
  }, [value, debounceMs, onChange]);
  
  return (
    <div>
      <input 
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      {isLoading && <span role="status">Loading...</span>}
    </div>
  );
}
```

---

## Testing Patterns

### Component Testing

```typescript
// Arrange-Act-Assert pattern
it('should do something', async () => {
  // Arrange
  const props = { /* ... */ };
  render(<Component {...props} />);
  
  // Act
  await userEvent.click(screen.getByRole('button'));
  
  // Assert
  expect(screen.getByText('Result')).toBeInTheDocument();
});
```

### Testing User Events

```typescript
import userEvent from '@testing-library/user-event';

// Always use userEvent over fireEvent
it('should handle user input', async () => {
  const user = userEvent.setup();
  render(<Form />);
  
  await user.type(screen.getByLabelText(/name/i), 'John');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  expect(screen.getByText(/success/i)).toBeInTheDocument();
});
```

### Testing Async Behavior

```typescript
import { waitFor, screen } from '@testing-library/react';

it('should load data', async () => {
  render(<UserProfile userId="123" />);
  
  // Wait for loading to finish
  await waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  
  // Or use findBy (auto-waits)
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

### Mocking API Calls

```typescript
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
  http.get('/api/users/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      name: 'John Doe',
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

it('should display user data', async () => {
  render(<UserProfile userId="123" />);
  
  expect(await screen.findByText('John Doe')).toBeInTheDocument();
});
```

### Testing Hooks

```typescript
import { renderHook, act } from '@testing-library/react';

describe('useCounter', () => {
  it('should increment counter', () => {
    const { result } = renderHook(() => useCounter());
    
    expect(result.current.count).toBe(0);
    
    act(() => {
      result.current.increment();
    });
    
    expect(result.current.count).toBe(1);
  });
});
```

---

## E2E Testing

### Playwright Example

```typescript
// e2e/login.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Login Flow', () => {
  test('should login successfully', async ({ page }) => {
    // Given
    await page.goto('/login');
    
    // When
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Then
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText('Welcome back')).toBeVisible();
  });
  
  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.getByLabel('Email').fill('user@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL('/login');
  });
});
```

---

## Test File Organization

```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx      # Component tests
│   │   └── index.ts
│   └── SearchInput/
│       ├── SearchInput.tsx
│       ├── SearchInput.test.tsx
│       └── index.ts
├── features/
│   └── auth/
│       ├── LoginForm.tsx
│       ├── LoginForm.test.tsx   # Feature component tests
│       └── useAuth.test.ts      # Hook tests
├── hooks/
│   ├── useDebounce.ts
│   └── useDebounce.test.ts
└── utils/
    ├── format.ts
    └── format.test.ts

e2e/
├── auth.spec.ts                  # E2E: Auth flows
├── checkout.spec.ts              # E2E: Checkout flows
└── fixtures/
    └── users.json
```

---

## Checklist

### Before Writing Tests
- [ ] Feature spec/requirements clear
- [ ] Acceptance criteria defined
- [ ] Edge cases identified

### Component Tests
- [ ] Renders correctly with props
- [ ] Handles user interactions
- [ ] Shows loading/error states
- [ ] Accessible (roles, labels)

### Integration Tests
- [ ] Components work together
- [ ] Data flows correctly
- [ ] Navigation works

### E2E Tests
- [ ] Critical user journeys covered
- [ ] Happy path tested
- [ ] Error scenarios tested

### Quality
- [ ] Tests are readable
- [ ] Tests are independent
- [ ] No flaky tests
- [ ] Coverage goals met
