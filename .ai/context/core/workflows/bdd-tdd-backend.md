# Backend BDD/TDD Workflow

> Behavior-Driven and Test-Driven Development for backend applications.

## Overview

```
API Contract → Feature Spec → Unit Tests → Implementation → Integration Tests → Contract Tests
```

Backend testing focuses on:
- **Business logic** - Domain rules and validations
- **Data integrity** - Database operations
- **API contracts** - Request/response correctness
- **Security** - Authentication, authorization

---

## Test Pyramid (Backend)

```
        /  Contract  \    ← Few: API matches OpenAPI spec
       /  Integration \   ← Some: DB, external services
      /     Service    \  ← Many: Business logic
     /       Unit       \ ← Many: Utilities, validators
```

| Level | Scope | Speed | Database |
|-------|-------|-------|----------|
| Unit | Functions, validators | Fast | No |
| Service | Use cases, domain logic | Fast | No/Mock |
| Integration | Repositories, APIs | Medium | Yes |
| Contract | API spec compliance | Medium | Yes |

---

## BDD Workflow

### Step 1: Write Feature Spec

```gherkin
# features/user-registration.feature

Feature: User Registration
  As a new visitor
  I want to create an account
  So that I can access the application

  Scenario: Successful registration
    Given no user exists with email "new@example.com"
    When I register with:
      | email    | new@example.com |
      | name     | John Doe        |
      | password | Password123!    |
    Then the user should be created
    And a welcome email should be queued
    And I should receive a JWT token

  Scenario: Duplicate email
    Given a user exists with email "existing@example.com"
    When I register with email "existing@example.com"
    Then I should receive a 409 Conflict error
    And the error message should be "Email already registered"

  Scenario: Invalid password
    When I register with password "weak"
    Then I should receive a 400 Bad Request error
    And the error should indicate password requirements
```

### Step 2: Convert to Test Cases

```typescript
// src/features/auth/register.test.ts

describe('User Registration', () => {
  describe('Successful registration', () => {
    it('should create user and return JWT token', async () => {
      // Given
      const request = {
        email: 'new@example.com',
        name: 'John Doe',
        password: 'Password123!',
      };
      
      // When
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: request,
      });
      
      // Then
      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        user: {
          email: 'new@example.com',
          name: 'John Doe',
        },
        token: expect.any(String),
      });
      
      // Verify user in database
      const user = await db.user.findUnique({ 
        where: { email: 'new@example.com' } 
      });
      expect(user).toBeTruthy();
      
      // Verify email queued
      expect(emailQueue.add).toHaveBeenCalledWith('welcome', {
        to: 'new@example.com',
        name: 'John Doe',
      });
    });
  });

  describe('Duplicate email', () => {
    it('should return 409 when email exists', async () => {
      // Given
      await createUser({ email: 'existing@example.com' });
      
      // When
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'existing@example.com',
          name: 'Another User',
          password: 'Password123!',
        },
      });
      
      // Then
      expect(response.statusCode).toBe(409);
      expect(response.json()).toMatchObject({
        code: 'EMAIL_EXISTS',
        message: 'Email already registered',
      });
    });
  });

  describe('Invalid password', () => {
    it('should return 400 for weak password', async () => {
      // When
      const response = await app.inject({
        method: 'POST',
        url: '/api/auth/register',
        payload: {
          email: 'new@example.com',
          name: 'John Doe',
          password: 'weak',
        },
      });
      
      // Then
      expect(response.statusCode).toBe(400);
      expect(response.json().details.fields.password).toBeDefined();
    });
  });
});
```

---

## TDD Workflow

### Red-Green-Refactor for Backend

```
1. RED    → Write failing test (service/repository)
2. GREEN  → Implement minimum code
3. REFACTOR → Clean up, extract patterns
```

### Example: Building a UserService

#### Step 1: RED - Write Failing Test

```typescript
// src/services/UserService.test.ts

describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with hashed password', async () => {
      const userService = new UserService(mockUserRepo, mockHasher);
      
      const result = await userService.createUser({
        email: 'test@example.com',
        name: 'Test User',
        password: 'Password123!',
      });
      
      expect(result.email).toBe('test@example.com');
      expect(result.passwordHash).not.toBe('Password123!');
      expect(mockHasher.hash).toHaveBeenCalledWith('Password123!');
    });
  });
});
```

#### Step 2: GREEN - Implement

```typescript
// src/services/UserService.ts

export class UserService {
  constructor(
    private userRepo: UserRepository,
    private hasher: PasswordHasher
  ) {}
  
  async createUser(input: CreateUserInput): Promise<User> {
    const passwordHash = await this.hasher.hash(input.password);
    
    return this.userRepo.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });
  }
}
```

#### Step 3: Add Edge Cases (RED)

```typescript
describe('UserService', () => {
  describe('createUser', () => {
    it('should create user with hashed password', async () => { /* ... */ });
    
    it('should throw if email already exists', async () => {
      mockUserRepo.findByEmail.mockResolvedValue({ id: '1', email: 'test@example.com' });
      
      await expect(
        userService.createUser({
          email: 'test@example.com',
          name: 'Test',
          password: 'Password123!',
        })
      ).rejects.toThrow(EmailExistsError);
    });
    
    it('should validate password strength', async () => {
      await expect(
        userService.createUser({
          email: 'test@example.com',
          name: 'Test',
          password: 'weak',
        })
      ).rejects.toThrow(ValidationError);
    });
  });
});
```

#### Step 4: GREEN - Add Validations

```typescript
export class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    // Validate password
    if (!this.isValidPassword(input.password)) {
      throw new ValidationError('Password must be at least 8 characters');
    }
    
    // Check existing user
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new EmailExistsError('Email already registered');
    }
    
    const passwordHash = await this.hasher.hash(input.password);
    
    return this.userRepo.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });
  }
  
  private isValidPassword(password: string): boolean {
    return password.length >= 8;
  }
}
```

---

## Testing Layers

### Unit Tests (No Dependencies)

```typescript
// src/utils/validators.test.ts

describe('validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });
  
  it('should return false for invalid email', () => {
    expect(validateEmail('invalid')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
  });
});
```

### Service Tests (Mocked Dependencies)

```typescript
// src/services/OrderService.test.ts

describe('OrderService', () => {
  let orderService: OrderService;
  let mockOrderRepo: MockOrderRepository;
  let mockProductRepo: MockProductRepository;
  let mockPaymentService: MockPaymentService;
  
  beforeEach(() => {
    mockOrderRepo = createMockOrderRepository();
    mockProductRepo = createMockProductRepository();
    mockPaymentService = createMockPaymentService();
    
    orderService = new OrderService(
      mockOrderRepo,
      mockProductRepo,
      mockPaymentService
    );
  });
  
  describe('createOrder', () => {
    it('should create order and process payment', async () => {
      // Given
      mockProductRepo.findById.mockResolvedValue({
        id: 'prod-1',
        price: 100,
        stock: 10,
      });
      mockPaymentService.charge.mockResolvedValue({
        id: 'pay-1',
        status: 'succeeded',
      });
      
      // When
      const order = await orderService.createOrder({
        userId: 'user-1',
        items: [{ productId: 'prod-1', quantity: 2 }],
      });
      
      // Then
      expect(order.total).toBe(200);
      expect(order.status).toBe('paid');
      expect(mockPaymentService.charge).toHaveBeenCalledWith(200);
    });
    
    it('should fail if product out of stock', async () => {
      mockProductRepo.findById.mockResolvedValue({
        id: 'prod-1',
        price: 100,
        stock: 0,
      });
      
      await expect(
        orderService.createOrder({
          userId: 'user-1',
          items: [{ productId: 'prod-1', quantity: 2 }],
        })
      ).rejects.toThrow(OutOfStockError);
    });
  });
});
```

### Integration Tests (Real Database)

```typescript
// src/repositories/UserRepository.integration.test.ts

describe('UserRepository', () => {
  let db: PrismaClient;
  let userRepo: UserRepository;
  
  beforeAll(async () => {
    db = new PrismaClient();
    await db.$connect();
  });
  
  afterAll(async () => {
    await db.$disconnect();
  });
  
  beforeEach(async () => {
    await db.user.deleteMany();
    userRepo = new UserRepository(db);
  });
  
  describe('create', () => {
    it('should create user in database', async () => {
      const user = await userRepo.create({
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashed',
      });
      
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      
      // Verify in database
      const found = await db.user.findUnique({ where: { id: user.id } });
      expect(found?.email).toBe('test@example.com');
    });
    
    it('should throw on duplicate email', async () => {
      await userRepo.create({
        email: 'test@example.com',
        name: 'First',
        passwordHash: 'hash1',
      });
      
      await expect(
        userRepo.create({
          email: 'test@example.com',
          name: 'Second',
          passwordHash: 'hash2',
        })
      ).rejects.toThrow();
    });
  });
});
```

### API/Contract Tests

```typescript
// src/api/users.api.test.ts

describe('Users API', () => {
  let app: FastifyInstance;
  
  beforeAll(async () => {
    app = await buildApp();
  });
  
  afterAll(async () => {
    await app.close();
  });
  
  beforeEach(async () => {
    await cleanDatabase();
  });
  
  describe('POST /api/users', () => {
    it('should create user and return 201', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          email: 'new@example.com',
          name: 'New User',
          password: 'Password123!',
        },
      });
      
      expect(response.statusCode).toBe(201);
      expect(response.json()).toMatchObject({
        id: expect.any(String),
        email: 'new@example.com',
        name: 'New User',
        createdAt: expect.any(String),
      });
      // Should not expose password
      expect(response.json().password).toBeUndefined();
      expect(response.json().passwordHash).toBeUndefined();
    });
    
    it('should return 400 for invalid payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/users',
        payload: {
          email: 'invalid',
        },
      });
      
      expect(response.statusCode).toBe(400);
      expect(response.json().code).toBe('VALIDATION_ERROR');
    });
  });
  
  describe('GET /api/users/:id', () => {
    it('should return user', async () => {
      const user = await createUser({ email: 'test@example.com' });
      
      const response = await app.inject({
        method: 'GET',
        url: `/api/users/${user.id}`,
        headers: {
          authorization: `Bearer ${await getAuthToken()}`,
        },
      });
      
      expect(response.statusCode).toBe(200);
      expect(response.json().id).toBe(user.id);
    });
    
    it('should return 404 for non-existent user', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/non-existent-id',
        headers: {
          authorization: `Bearer ${await getAuthToken()}`,
        },
      });
      
      expect(response.statusCode).toBe(404);
    });
    
    it('should return 401 without auth', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/users/any-id',
      });
      
      expect(response.statusCode).toBe(401);
    });
  });
});
```

---

## Test File Organization

```
src/
├── services/
│   ├── UserService.ts
│   ├── UserService.test.ts        # Unit/Service tests
│   └── UserService.integration.test.ts
├── repositories/
│   ├── UserRepository.ts
│   └── UserRepository.integration.test.ts
├── api/
│   ├── routes/
│   │   └── users.ts
│   └── users.api.test.ts          # API tests
├── domain/
│   ├── User.ts
│   └── User.test.ts               # Domain logic tests
└── utils/
    ├── validators.ts
    └── validators.test.ts         # Unit tests

tests/
├── fixtures/                       # Test data
│   ├── users.ts
│   └── products.ts
├── helpers/                        # Test utilities
│   ├── db.ts
│   ├── auth.ts
│   └── factories.ts
└── setup.ts                        # Global test setup
```

---

## Contract Testing

### Verify API Matches OpenAPI Spec

```typescript
// tests/contract/api.contract.test.ts

import { OpenAPIValidator } from 'express-openapi-validator';

describe('API Contract', () => {
  const validator = new OpenAPIValidator({
    apiSpec: './docs/contracts/api.yaml',
  });
  
  it('POST /api/users response matches spec', async () => {
    const response = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: validUserPayload,
    });
    
    const errors = await validator.validateResponse(
      'POST',
      '/api/users',
      response.statusCode,
      response.json()
    );
    
    expect(errors).toHaveLength(0);
  });
});
```

---

## Checklist

### Before Writing Tests
- [ ] API contract (OpenAPI) defined
- [ ] Database schema (DBML) defined
- [ ] Business rules documented
- [ ] Edge cases identified

### Unit/Service Tests
- [ ] Business logic tested
- [ ] Error cases handled
- [ ] Validation tested
- [ ] Dependencies mocked

### Integration Tests
- [ ] Database operations work
- [ ] Transactions handled correctly
- [ ] Constraints enforced

### API Tests
- [ ] All endpoints tested
- [ ] Authentication/authorization tested
- [ ] Validation errors tested
- [ ] Response format matches contract

### Quality
- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic
- [ ] Fast feedback loop
- [ ] Coverage goals met
