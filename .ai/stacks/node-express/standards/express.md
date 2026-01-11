# Express.js Standard

> Conventions and best practices for Express.js applications with TypeScript.

## Architecture

### Directory Structure

```
src/
├── app.ts                # Express app setup
├── server.ts             # Server entry point
├── config/               # Configuration
│   ├── index.ts
│   └── database.ts
├── controllers/          # Request handlers
├── routes/               # Route definitions
├── services/             # Business logic
├── repositories/         # Data access
├── middleware/           # Custom middleware
├── models/               # Database models
├── types/                # TypeScript types
├── utils/                # Utilities
└── validators/           # Input validation

tests/
├── unit/                 # Unit tests
├── integration/          # Integration tests
└── fixtures/             # Test data
```

### Layered Architecture

```
┌─────────────────────────────────────┐
│             Routes                  │  ← HTTP layer
├─────────────────────────────────────┤
│           Controllers               │  ← Request handling
├─────────────────────────────────────┤
│           Validators                │  ← Input validation
├─────────────────────────────────────┤
│            Services                 │  ← Business logic
├─────────────────────────────────────┤
│          Repositories               │  ← Data access
├─────────────────────────────────────┤
│            Models                   │  ← Database/ORM
└─────────────────────────────────────┘
```

---

## Naming Conventions

### Files

| Type | Convention | Example |
|------|------------|---------|
| Controller | kebab-case.controller.ts | `user.controller.ts` |
| Service | kebab-case.service.ts | `user.service.ts` |
| Repository | kebab-case.repository.ts | `user.repository.ts` |
| Route | kebab-case.routes.ts | `user.routes.ts` |
| Middleware | kebab-case.middleware.ts | `auth.middleware.ts` |
| Validator | kebab-case.validator.ts | `user.validator.ts` |
| Type | kebab-case.types.ts | `user.types.ts` |
| Test | kebab-case.test.ts | `user.service.test.ts` |

### Classes & Functions

| Type | Convention | Example |
|------|------------|---------|
| Class | PascalCase | `UserService`, `UserController` |
| Function | camelCase | `getUserById`, `createUser` |
| Interface | PascalCase, I prefix optional | `User`, `IUserService` |
| Type | PascalCase | `CreateUserInput`, `UserResponse` |
| Enum | PascalCase | `UserRole`, `OrderStatus` |

---

## App Setup

### app.ts

```typescript
import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { errorHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logger.middleware';
import routes from './routes';

export function createApp(): Application {
  const app = express();

  // Security middleware
  app.use(helmet());
  app.use(cors());

  // Parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(compression());

  // Logging
  app.use(requestLogger);

  // Routes
  app.use('/api/v1', routes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling (must be last)
  app.use(errorHandler);

  return app;
}
```

### server.ts

```typescript
import { createApp } from './app';
import { config } from './config';
import { connectDatabase } from './config/database';

async function main() {
  await connectDatabase();
  
  const app = createApp();
  
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
}

main().catch(console.error);
```

---

## Controllers

```typescript
// src/controllers/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserInput, UpdateUserInput } from '../types/user.types';

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.json({ data: users });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const user = await this.userService.findById(id);
      
      if (!user) {
        return res.status(404).json({ 
          error: { code: 'NOT_FOUND', message: 'User not found' }
        });
      }
      
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input: CreateUserInput = req.body;
      const user = await this.userService.create(input);
      res.status(201).json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const input: UpdateUserInput = req.body;
      const user = await this.userService.update(id, input);
      res.json({ data: user });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await this.userService.delete(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
```

---

## Routes

```typescript
// src/routes/user.routes.ts

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { UserRepository } from '../repositories/user.repository';
import { validateRequest } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

const router = Router();

// Dependency injection
const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.get('/', authenticate, userController.getAll);
router.get('/:id', authenticate, userController.getById);
router.post('/', authenticate, validateRequest(createUserSchema), userController.create);
router.patch('/:id', authenticate, validateRequest(updateUserSchema), userController.update);
router.delete('/:id', authenticate, userController.delete);

export default router;
```

```typescript
// src/routes/index.ts

import { Router } from 'express';
import userRoutes from './user.routes';
import authRoutes from './auth.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
```

---

## Services

```typescript
// src/services/user.service.ts

import { UserRepository } from '../repositories/user.repository';
import { User, CreateUserInput, UpdateUserInput } from '../types/user.types';
import { hashPassword } from '../utils/password';
import { AppError } from '../utils/errors';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async create(input: CreateUserInput): Promise<User> {
    // Check if email exists
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) {
      throw new AppError('EMAIL_EXISTS', 'Email already registered', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(input.password);

    return this.userRepository.create({
      ...input,
      passwordHash,
    });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    return this.userRepository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }
}
```

---

## Middleware

### Error Handler

```typescript
// src/middleware/error.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

export function errorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  });
}
```

### Validation

```typescript
// src/middleware/validate.middleware.ts

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export function validateRequest(schema: ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: result.error.flatten().fieldErrors,
        },
      });
    }

    req.body = result.data;
    next();
  };
}
```

---

## Validators (Zod)

```typescript
// src/validators/user.validator.ts

import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  name: z.string().min(1, 'Name is required').max(100),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
```

---

## Testing

```typescript
// tests/integration/user.test.ts

import request from 'supertest';
import { createApp } from '../../src/app';

describe('User API', () => {
  const app = createApp();

  describe('POST /api/v1/users', () => {
    it('should create a user', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
        })
        .expect(201);

      expect(response.body.data).toMatchObject({
        email: 'test@example.com',
        name: 'Test User',
      });
      expect(response.body.data.password).toBeUndefined();
    });

    it('should return 400 for invalid input', async () => {
      const response = await request(app)
        .post('/api/v1/users')
        .send({
          email: 'invalid',
        })
        .expect(400);

      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

---

## Checklist

### Controller
- [ ] Uses async/await with try-catch
- [ ] Passes errors to next()
- [ ] Returns appropriate status codes
- [ ] Uses TypeScript types

### Route
- [ ] Uses dependency injection
- [ ] Has validation middleware
- [ ] Has auth middleware where needed
- [ ] Follows RESTful conventions

### Service
- [ ] Contains business logic only
- [ ] Throws typed errors
- [ ] Doesn't know about HTTP

### Test
- [ ] Integration tests for endpoints
- [ ] Unit tests for services
- [ ] Mocks external dependencies
