---
name: node-api-endpoint
description: Create Express.js API endpoint with controller, service, validation
triggers:
  - create endpoint
  - add api
  - express route
---

# Express API Endpoint Skill

> Create RESTful API endpoints following Express.js best practices.

## Workflow

```
1. Define Types
   └─→ Request/response types

2. Create Validator
   └─→ Zod schema for input

3. Create Service
   └─→ Business logic

4. Create Controller
   └─→ Request handling

5. Create Route
   └─→ Wire everything together

6. Add Tests
   └─→ Integration tests
```

## File Structure

```
src/
├── types/user.types.ts
├── validators/user.validator.ts
├── services/user.service.ts
├── controllers/user.controller.ts
└── routes/user.routes.ts
```

## Step 1: Types

```typescript
// src/types/user.types.ts

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUserInput {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserInput {
  email?: string;
  name?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}
```

## Step 2: Validator

```typescript
// src/validators/user.validator.ts

import { z } from 'zod';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(1).max(100),
  password: z.string().min(8),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  name: z.string().min(1).max(100).optional(),
});

export const userIdParamSchema = z.object({
  id: z.string().uuid('Invalid user ID'),
});
```

## Step 3: Service

```typescript
// src/services/user.service.ts

import { User, CreateUserInput, UpdateUserInput } from '../types/user.types';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/password';
import { AppError } from '../utils/errors';

export class UserService {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(input: CreateUserInput): Promise<User> {
    const existing = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existing) {
      throw new AppError('EMAIL_EXISTS', 'Email already registered', 409);
    }

    const passwordHash = await hashPassword(input.password);

    return prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        passwordHash,
      },
    });
  }

  async update(id: string, input: UpdateUserInput): Promise<User> {
    return prisma.user.update({
      where: { id },
      data: input,
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}
```

## Step 4: Controller

```typescript
// src/controllers/user.controller.ts

import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { toUserResponse } from '../utils/transformers';

export class UserController {
  constructor(private userService: UserService) {}

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.findAll();
      res.json({ 
        data: users.map(toUserResponse) 
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'User not found' }
        });
      }
      
      res.json({ data: toUserResponse(user) });
    } catch (error) {
      next(error);
    }
  };

  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.create(req.body);
      res.status(201).json({ data: toUserResponse(user) });
    } catch (error) {
      next(error);
    }
  };

  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.update(req.params.id, req.body);
      res.json({ data: toUserResponse(user) });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.userService.delete(req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
```

## Step 5: Route

```typescript
// src/routes/user.routes.ts

import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { validate } from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { 
  createUserSchema, 
  updateUserSchema,
  userIdParamSchema,
} from '../validators/user.validator';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get('/', 
  authenticate, 
  userController.getAll
);

router.get('/:id', 
  authenticate,
  validate({ params: userIdParamSchema }),
  userController.getById
);

router.post('/', 
  authenticate,
  validate({ body: createUserSchema }),
  userController.create
);

router.patch('/:id', 
  authenticate,
  validate({ 
    params: userIdParamSchema,
    body: updateUserSchema 
  }),
  userController.update
);

router.delete('/:id', 
  authenticate,
  validate({ params: userIdParamSchema }),
  userController.delete
);

export default router;
```

## Step 6: Register Route

```typescript
// src/routes/index.ts

import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router();

router.use('/users', userRoutes);

export default router;
```

## Response Transformer

```typescript
// src/utils/transformers.ts

import { User, UserResponse } from '../types/user.types';

export function toUserResponse(user: User): UserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
  };
}
```

## Checklist

- [ ] Types defined for input/output
- [ ] Zod schema for validation
- [ ] Service handles business logic
- [ ] Controller handles HTTP only
- [ ] Route wires dependencies
- [ ] Tests cover all endpoints
- [ ] Error handling with AppError
