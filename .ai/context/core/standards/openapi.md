# OpenAPI Standard

> OpenAPI specification conventions for API design.

## Overview

OpenAPI (formerly Swagger) is the standard for describing RESTful APIs. It serves as the **Single Source of Truth** for API contracts between frontend and backend.

---

## File Location

```
docs/
└── contracts/
    └── api.yaml          # Main API spec
```

For large projects, split by resource:

```
docs/
└── contracts/
    └── api/
        ├── openapi.yaml  # Main file with refs
        ├── auth.yaml
        ├── users.yaml
        └── products.yaml
```

---

## Basic Structure

```yaml
openapi: 3.1.0
info:
  title: My API
  version: 1.0.0
  description: API description
  
servers:
  - url: http://localhost:3000/api/v1
    description: Development
  - url: https://api.example.com/v1
    description: Production

tags:
  - name: Auth
    description: Authentication endpoints
  - name: Users
    description: User management

paths:
  # ... endpoints ...

components:
  schemas:
    # ... data models ...
  securitySchemes:
    # ... auth methods ...
```

---

## Path Conventions

### URL Structure

| Convention | Example |
|------------|---------|
| Plural nouns | `/users`, `/products` |
| Lowercase, hyphenated | `/order-items`, `/user-profiles` |
| Nested resources | `/users/{userId}/orders` |
| Actions as verbs (rare) | `/auth/login`, `/orders/{id}/cancel` |

### HTTP Methods

| Method | Purpose | Example |
|--------|---------|---------|
| GET | Read resource(s) | `GET /users`, `GET /users/{id}` |
| POST | Create resource | `POST /users` |
| PUT | Replace resource | `PUT /users/{id}` |
| PATCH | Partial update | `PATCH /users/{id}` |
| DELETE | Remove resource | `DELETE /users/{id}` |

### Path Examples

```yaml
paths:
  /users:
    get:
      summary: List users
      tags: [Users]
    post:
      summary: Create user
      tags: [Users]
      
  /users/{userId}:
    get:
      summary: Get user by ID
      tags: [Users]
    patch:
      summary: Update user
      tags: [Users]
    delete:
      summary: Delete user
      tags: [Users]
      
  /users/{userId}/orders:
    get:
      summary: List user's orders
      tags: [Users, Orders]
```

---

## Request/Response Conventions

### Request Body

```yaml
paths:
  /users:
    post:
      summary: Create user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
            example:
              email: user@example.com
              name: John Doe
              password: securePassword123
```

### Response

```yaml
paths:
  /users/{userId}:
    get:
      summary: Get user
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
```

### Standard Response Codes

| Code | When to Use |
|------|-------------|
| 200 | Success (GET, PATCH) |
| 201 | Created (POST) |
| 204 | No Content (DELETE) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (not logged in) |
| 403 | Forbidden (no permission) |
| 404 | Not Found |
| 409 | Conflict (duplicate) |
| 422 | Unprocessable Entity (business logic error) |
| 500 | Server Error |

---

## Schema Conventions

### Naming

| Convention | Example |
|------------|---------|
| PascalCase | `User`, `OrderItem` |
| Request suffix | `CreateUserRequest`, `UpdateProductRequest` |
| Response suffix (optional) | `UserResponse`, `PaginatedUsersResponse` |

### Common Schemas

```yaml
components:
  schemas:
    # Base model
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
        role:
          $ref: '#/components/schemas/UserRole'
        createdAt:
          type: string
          format: date-time
        updatedAt:
          type: string
          format: date-time

    # Enum
    UserRole:
      type: string
      enum: [admin, manager, user]
      
    # Create request (no id, no timestamps)
    CreateUserRequest:
      type: object
      required:
        - email
        - name
        - password
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
          maxLength: 100
        password:
          type: string
          minLength: 8
          
    # Update request (all optional)
    UpdateUserRequest:
      type: object
      properties:
        name:
          type: string
          minLength: 1
          maxLength: 100
        email:
          type: string
          format: email
```

### Pagination

```yaml
components:
  schemas:
    PaginatedResponse:
      type: object
      required:
        - data
        - meta
      properties:
        data:
          type: array
          items: {}
        meta:
          $ref: '#/components/schemas/PaginationMeta'
          
    PaginationMeta:
      type: object
      required:
        - page
        - perPage
        - total
        - totalPages
      properties:
        page:
          type: integer
          minimum: 1
        perPage:
          type: integer
          minimum: 1
          maximum: 100
        total:
          type: integer
        totalPages:
          type: integer

    PaginatedUsers:
      allOf:
        - $ref: '#/components/schemas/PaginatedResponse'
        - type: object
          properties:
            data:
              type: array
              items:
                $ref: '#/components/schemas/User'
```

### Error Response

```yaml
components:
  schemas:
    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: string
          description: Machine-readable error code
          example: VALIDATION_ERROR
        message:
          type: string
          description: Human-readable message
          example: Invalid email format
        details:
          type: object
          additionalProperties: true
          description: Additional error context
          
    ValidationError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: object
              properties:
                fields:
                  type: object
                  additionalProperties:
                    type: array
                    items:
                      type: string
              example:
                fields:
                  email: ["Invalid email format"]
                  password: ["Must be at least 8 characters"]
```

---

## Authentication

### Security Schemes

```yaml
components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: JWT token from /auth/login
      
    ApiKeyAuth:
      type: apiKey
      in: header
      name: X-API-Key
```

### Applying Security

```yaml
# Global (all endpoints)
security:
  - BearerAuth: []

# Per-endpoint override
paths:
  /auth/login:
    post:
      security: []  # Public endpoint
      
  /admin/users:
    get:
      security:
        - BearerAuth: []
        - ApiKeyAuth: []
```

---

## Query Parameters

### Filtering

```yaml
paths:
  /products:
    get:
      parameters:
        - name: category
          in: query
          schema:
            type: string
        - name: minPrice
          in: query
          schema:
            type: number
        - name: maxPrice
          in: query
          schema:
            type: number
        - name: inStock
          in: query
          schema:
            type: boolean
```

### Pagination

```yaml
paths:
  /users:
    get:
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            minimum: 1
            default: 1
        - name: perPage
          in: query
          schema:
            type: integer
            minimum: 1
            maximum: 100
            default: 20
```

### Sorting

```yaml
paths:
  /products:
    get:
      parameters:
        - name: sortBy
          in: query
          schema:
            type: string
            enum: [name, price, createdAt]
            default: createdAt
        - name: sortOrder
          in: query
          schema:
            type: string
            enum: [asc, desc]
            default: desc
```

---

## Validation Checklist

Before approving OpenAPI spec:

### Structure
- [ ] OpenAPI version 3.0+ specified
- [ ] Info section complete (title, version, description)
- [ ] Servers defined for all environments
- [ ] Tags used to group endpoints

### Paths
- [ ] RESTful URL conventions followed
- [ ] Correct HTTP methods used
- [ ] All path parameters defined
- [ ] Query parameters documented

### Schemas
- [ ] All request/response schemas defined
- [ ] Required fields specified
- [ ] Validation constraints (min, max, pattern)
- [ ] Examples provided

### Responses
- [ ] All response codes documented
- [ ] Error responses standardized
- [ ] Success responses have schemas

### Security
- [ ] Security schemes defined
- [ ] Applied globally or per-endpoint
- [ ] Public endpoints explicitly marked

---

## Tools

| Tool | Purpose |
|------|---------|
| [Swagger Editor](https://editor.swagger.io) | Visual editor |
| [Prism](https://stoplight.io/prism) | Mock server |
| [openapi-typescript](https://github.com/drwpow/openapi-typescript) | TypeScript types |
| [Redoc](https://redocly.com/redoc) | Documentation |
| [Spectral](https://stoplight.io/spectral) | Linting |

### Generate TypeScript Types

```bash
npx openapi-typescript docs/contracts/api.yaml -o src/types/api.ts
```

### Mock Server

```bash
npx @stoplight/prism-cli mock docs/contracts/api.yaml
```

### Lint Spec

```bash
npx @stoplight/spectral-cli lint docs/contracts/api.yaml
```

---

## Example: User API

```yaml
# docs/contracts/api.yaml

openapi: 3.1.0
info:
  title: User API
  version: 1.0.0

servers:
  - url: http://localhost:3000/api/v1

tags:
  - name: Auth
  - name: Users

security:
  - BearerAuth: []

paths:
  /auth/login:
    post:
      summary: Login
      tags: [Auth]
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/LoginRequest'
      responses:
        '200':
          description: Login successful
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/AuthResponse'
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /users:
    get:
      summary: List users
      tags: [Users]
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: perPage
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Users list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/PaginatedUsers'

    post:
      summary: Create user
      tags: [Users]
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '400':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationError'

  /users/{userId}:
    parameters:
      - name: userId
        in: path
        required: true
        schema:
          type: string
          format: uuid
          
    get:
      summary: Get user
      tags: [Users]
      responses:
        '200':
          description: User found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
        '404':
          description: User not found
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      required: [id, email, name, createdAt]
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        name:
          type: string
        createdAt:
          type: string
          format: date-time

    CreateUserRequest:
      type: object
      required: [email, name, password]
      properties:
        email:
          type: string
          format: email
        name:
          type: string
          minLength: 1
        password:
          type: string
          minLength: 8

    LoginRequest:
      type: object
      required: [email, password]
      properties:
        email:
          type: string
          format: email
        password:
          type: string

    AuthResponse:
      type: object
      required: [token, user]
      properties:
        token:
          type: string
        user:
          $ref: '#/components/schemas/User'

    Error:
      type: object
      required: [code, message]
      properties:
        code:
          type: string
        message:
          type: string

    ValidationError:
      allOf:
        - $ref: '#/components/schemas/Error'
        - type: object
          properties:
            details:
              type: object

    PaginatedUsers:
      type: object
      properties:
        data:
          type: array
          items:
            $ref: '#/components/schemas/User'
        meta:
          type: object
          properties:
            page:
              type: integer
            perPage:
              type: integer
            total:
              type: integer
```
