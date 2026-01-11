# E2E Testing Skill

> Create end-to-end tests for React applications using Playwright.

## Trigger

- Critical user journey needs testing
- New feature with user interactions
- Regression testing for existing flows

## Steps

1. **Identify Test Scenarios**
   - What user journey to test?
   - What are the critical paths?
   - What are the edge cases?

2. **Create Page Object**

   ```typescript
   // e2e/pages/login.page.ts
   import { Page, Locator } from "@playwright/test";

   export class LoginPage {
     private readonly page: Page;
     private readonly emailInput: Locator;
     private readonly passwordInput: Locator;
     private readonly submitButton: Locator;
     private readonly errorMessage: Locator;

     constructor(page: Page) {
       this.page = page;
       this.emailInput = page.getByLabel("Email");
       this.passwordInput = page.getByLabel("Password");
       this.submitButton = page.getByRole("button", { name: "Login" });
       this.errorMessage = page.getByTestId("error-message");
     }

     async goto() {
       await this.page.goto("/login");
     }

     async login(email: string, password: string) {
       await this.emailInput.fill(email);
       await this.passwordInput.fill(password);
       await this.submitButton.click();
     }

     async getError() {
       return this.errorMessage.textContent();
     }

     async isVisible() {
       return this.emailInput.isVisible();
     }
   }
   ```

3. **Write Test Specs**

   ```typescript
   // e2e/tests/auth.spec.ts
   import { test, expect } from "@playwright/test";
   import { LoginPage } from "../pages/login.page";

   test.describe("Authentication", () => {
     let loginPage: LoginPage;

     test.beforeEach(async ({ page }) => {
       loginPage = new LoginPage(page);
       await loginPage.goto();
     });

     test("should login with valid credentials", async ({ page }) => {
       await loginPage.login("user@example.com", "password123");

       await expect(page).toHaveURL("/dashboard");
     });

     test("should show error for invalid credentials", async () => {
       await loginPage.login("user@example.com", "wrong");

       expect(await loginPage.getError()).toContain("Invalid credentials");
     });

     test("should require email", async ({ page }) => {
       await loginPage.login("", "password123");

       await expect(page.getByText("Email is required")).toBeVisible();
     });
   });
   ```

4. **Run and Verify**

   ```bash
   pnpm test:e2e
   pnpm test:e2e:ui    # Interactive mode
   pnpm test:e2e:debug # Debug mode
   ```

## Page Object Template

```typescript
// e2e/pages/base.page.ts
import { Page } from "@playwright/test";

export abstract class BasePage {
  constructor(protected page: Page) {}

  async waitForLoad() {
    await this.page.waitForLoadState("networkidle");
  }

  async getTitle() {
    return this.page.title();
  }

  async screenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` });
  }
}

// e2e/pages/dashboard.page.ts
import { Page, Locator } from "@playwright/test";
import { BasePage } from "./base.page";

export class DashboardPage extends BasePage {
  private readonly welcomeMessage: Locator;
  private readonly logoutButton: Locator;
  private readonly userMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeMessage = page.getByTestId("welcome-message");
    this.logoutButton = page.getByRole("button", { name: "Logout" });
    this.userMenu = page.getByTestId("user-menu");
  }

  async goto() {
    await this.page.goto("/dashboard");
  }

  async getWelcomeMessage() {
    return this.welcomeMessage.textContent();
  }

  async logout() {
    await this.userMenu.click();
    await this.logoutButton.click();
  }
}
```

## Test Patterns

### Testing Forms

```typescript
test("should submit form with valid data", async ({ page }) => {
  const form = new ContactForm(page);
  await form.goto();

  await form.fill({
    name: "John Doe",
    email: "john@example.com",
    message: "Hello!",
  });
  await form.submit();

  await expect(page.getByText("Message sent!")).toBeVisible();
});
```

### Testing Navigation

```typescript
test("should navigate between pages", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("link", { name: "About" }).click();
  await expect(page).toHaveURL("/about");

  await page.getByRole("link", { name: "Contact" }).click();
  await expect(page).toHaveURL("/contact");
});
```

### Testing with Authentication

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base } from "@playwright/test";

export const test = base.extend({
  authenticatedPage: async ({ page }, use) => {
    // Login before test
    await page.goto("/login");
    await page.fill('[name="email"]', "test@example.com");
    await page.fill('[name="password"]', "password123");
    await page.click('button[type="submit"]');
    await page.waitForURL("/dashboard");

    await use(page);

    // Logout after test
    await page.goto("/logout");
  },
});

// Usage
test("should access protected route", async ({ authenticatedPage }) => {
  await authenticatedPage.goto("/settings");
  await expect(authenticatedPage).toHaveURL("/settings");
});
```

### Testing API Responses

```typescript
test("should handle API errors gracefully", async ({ page }) => {
  // Mock API error
  await page.route("/api/users", (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: "Server error" }),
    });
  });

  await page.goto("/users");

  await expect(page.getByText("Failed to load users")).toBeVisible();
});
```

## Assertions

```typescript
// URL
await expect(page).toHaveURL("/dashboard");
await expect(page).toHaveURL(/dashboard/);

// Title
await expect(page).toHaveTitle("Dashboard");

// Element visibility
await expect(element).toBeVisible();
await expect(element).toBeHidden();

// Element state
await expect(element).toBeEnabled();
await expect(element).toBeDisabled();
await expect(element).toBeChecked();

// Text content
await expect(element).toHaveText("Expected text");
await expect(element).toContainText("partial");

// Input value
await expect(input).toHaveValue("expected value");

// Count
await expect(page.getByRole("listitem")).toHaveCount(5);
```

## Configuration

```typescript
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e/tests",
  timeout: 30000,
  retries: process.env.CI ? 2 : 0,

  use: {
    baseURL: "http://localhost:3000",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
  },

  projects: [
    { name: "chromium", use: { browserName: "chromium" } },
    { name: "firefox", use: { browserName: "firefox" } },
    { name: "webkit", use: { browserName: "webkit" } },
  ],

  webServer: {
    command: "pnpm dev",
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
});
```

## Checklist

- [ ] Page objects created for each page
- [ ] Locators use accessible selectors
- [ ] Tests are independent
- [ ] Tests clean up after themselves
- [ ] Error scenarios tested
- [ ] Responsive testing (if needed)
- [ ] Runs in CI
