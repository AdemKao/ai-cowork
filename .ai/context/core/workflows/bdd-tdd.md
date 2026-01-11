# BDD/TDD Workflow

> Universal workflow for Behavior-Driven Development and Test-Driven Development.

## Overview

```
Feature Spec → BDD Scenarios → TDD Implementation → Integration
```

---

## BDD (Behavior-Driven Development)

### When to Use

- New user-facing features
- Complex business logic
- Features requiring stakeholder alignment

### Workflow

```
1. READ Feature Spec
   └─→ docs/specs/features/{module}/{feature}.feature.md

2. EXTRACT Gherkin Scenarios
   └─→ e2e/features/{module}/{feature}.feature

3. CREATE Step Definitions
   └─→ e2e/steps/{module}.steps.ts

4. IMPLEMENT UI/Logic
   └─→ Guided by failing scenarios

5. VERIFY All Scenarios Pass
   └─→ pnpm test:e2e
```

### Gherkin Format

```gherkin
Feature: User Login
  As a user
  I want to login with email OTP
  So that I can access my account

  Scenario: Successful OTP verification
    Given I am on the login page
    And I have entered a valid email "user@example.com"
    When I click "Send OTP"
    And I enter the correct OTP code
    Then I should be redirected to role selection
```

### BDD Best Practices

| Practice          | Description                                             |
| ----------------- | ------------------------------------------------------- |
| Business Language | Write scenarios in domain language, not technical terms |
| Single Behavior   | Each scenario tests ONE behavior                        |
| Independent       | Scenarios should not depend on each other               |
| Deterministic     | Same input = same output, always                        |

---

## TDD (Test-Driven Development)

### When to Use

- Service layer logic
- Utility functions
- Data transformations
- API integrations

### The TDD Cycle

```
┌─────────────────────────────────────────┐
│                                         │
│    ┌─────┐    ┌─────┐    ┌──────────┐  │
│    │ RED │───→│GREEN│───→│ REFACTOR │  │
│    └─────┘    └─────┘    └──────────┘  │
│       ↑                        │        │
│       └────────────────────────┘        │
│                                         │
└─────────────────────────────────────────┘
```

| Phase        | Action                     | Verification                         |
| ------------ | -------------------------- | ------------------------------------ |
| **RED**      | Write failing test first   | `pnpm test` → FAIL (expected)        |
| **GREEN**    | Write MINIMAL code to pass | `pnpm test` → PASS                   |
| **REFACTOR** | Improve code quality       | `pnpm test` → PASS (must stay green) |

### TDD Rules

1. **NEVER** write implementation before test
2. **NEVER** delete failing tests to "pass" - fix the code
3. **ONE** test at a time - don't batch
4. **MINIMAL** code - only enough to pass the test

### Test Structure (AAA Pattern)

```typescript
describe("AuthService", () => {
  describe("sendOTP", () => {
    it("should send OTP to valid email", async () => {
      // Arrange
      const email = "user@example.com";
      const mockSupabase = createMockSupabase();
      const service = new AuthService(mockSupabase);

      // Act
      await service.sendOTP(email);

      // Assert
      expect(mockSupabase.auth.signInWithOtp).toHaveBeenCalledWith({ email });
    });

    it("should throw error for invalid email", async () => {
      // Arrange
      const invalidEmail = "not-an-email";
      const service = new AuthService(mockSupabase);

      // Act & Assert
      await expect(service.sendOTP(invalidEmail)).rejects.toThrow(
        "Invalid email format",
      );
    });
  });
});
```

---

## Combined BDD + TDD Workflow

For features with both UI and business logic:

```
1. BDD: Write E2E scenarios from Feature Spec
         ↓
2. TDD: Write unit tests for services/hooks
         ↓
3. Implement services (pass unit tests)
         ↓
4. Implement UI components
         ↓
5. Verify E2E scenarios pass
         ↓
6. Refactor with confidence
```

---

## Test Pyramid

```
        ╱╲
       ╱  ╲         E2E Tests (Few)
      ╱────╲        - Critical user journeys
     ╱      ╲       - Slow, expensive
    ╱────────╲
   ╱          ╲     Integration Tests (Some)
  ╱────────────╲    - Component + Hook tests
 ╱              ╲   - Medium speed
╱────────────────╲
        ▼           Unit Tests (Many)
                    - Services, Utils
                    - Fast, cheap
```

---

## Commands

```bash
# Unit tests
pnpm test              # Run all unit tests
pnpm test -- --watch   # Watch mode
pnpm test:coverage     # With coverage

# E2E tests
pnpm test:e2e          # Run E2E tests
pnpm test:e2e:ui       # Interactive UI mode
pnpm test:e2e:debug    # Debug mode
```

---

## Checklist

Before marking a feature complete:

- [ ] All BDD scenarios pass
- [ ] All unit tests pass
- [ ] Coverage meets target (services: 70%+)
- [ ] No skipped tests
- [ ] Tests are deterministic (no flaky tests)
