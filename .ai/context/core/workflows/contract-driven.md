# Contract-Driven Development

> Design contracts first, implement later. DBML + OpenAPI as Single Source of Truth.

## Overview

```
Requirements → Contracts (DBML + OpenAPI) → Implementation → Tests
```

Contract-Driven Development ensures:
- Frontend and backend can work in parallel
- Clear API boundaries before coding
- Database schema is designed intentionally
- Changes are traceable and versioned

---

## Workflow

### Phase 1: Requirements Analysis

```
1. Gather Requirements
   ├─→ User stories / feature specs
   ├─→ Business rules
   └─→ Data requirements

2. Identify Entities
   ├─→ Core domain objects
   ├─→ Relationships
   └─→ Attributes
```

### Phase 2: Contract Design

```
1. Design Database Schema (DBML)
   └─→ docs/contracts/schema.dbml

2. Design API Contract (OpenAPI)
   └─→ docs/contracts/api.yaml

3. Review & Approve Contracts
   └─→ Team review before implementation
```

### Phase 3: Parallel Implementation

```
┌─────────────────────────────────────────────────┐
│                                                 │
│  Frontend Team          Backend Team            │
│  ─────────────          ────────────            │
│  ↓                      ↓                       │
│  Mock API from          Implement DB            │
│  OpenAPI spec           from DBML               │
│  ↓                      ↓                       │
│  Build UI               Build API               │
│  components             endpoints               │
│  ↓                      ↓                       │
│  ─────────────────────────────────────────────  │
│                    ↓                            │
│              Integration                        │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Phase 4: Integration & Verification

```
1. Contract Tests
   ├─→ API matches OpenAPI spec
   └─→ Database matches DBML schema

2. Integration Tests
   └─→ Frontend + Backend end-to-end

3. Deploy
```

---

## Contract Files Structure

```
docs/
└── contracts/
    ├── schema.dbml           # Database schema
    ├── api.yaml              # OpenAPI specification
    ├── api/                  # Split API specs (optional)
    │   ├── auth.yaml
    │   ├── users.yaml
    │   └── products.yaml
    └── CHANGELOG.md          # Contract changes log
```

---

## DBML First

Database schema is the foundation. Define it first.

### When to Write DBML

- Starting a new feature with data requirements
- Adding new entities or relationships
- Modifying existing data structures

### DBML Workflow

```bash
# 1. Write/update DBML
edit docs/contracts/schema.dbml

# 2. Generate migration (tool-specific)
dbml2sql docs/contracts/schema.dbml > migrations/001_schema.sql

# 3. Review and apply
```

### Reference

See `.ai/context/core/standards/dbml.md` for DBML conventions.

---

## OpenAPI Second

After data model is defined, design the API.

### When to Write OpenAPI

- After DBML schema is approved
- Before implementing any endpoint
- When changing API behavior

### OpenAPI Workflow

```bash
# 1. Write/update OpenAPI spec
edit docs/contracts/api.yaml

# 2. Generate types (optional)
openapi-typescript docs/contracts/api.yaml -o src/types/api.ts

# 3. Generate mock server (for frontend)
prism mock docs/contracts/api.yaml

# 4. Implement endpoints
```

### Reference

See `.ai/context/core/standards/openapi.md` for OpenAPI conventions.

---

## Contract Change Process

### Minor Changes (Non-Breaking)

1. Update contract file
2. Add entry to CHANGELOG.md
3. Implement changes
4. Update tests

### Major Changes (Breaking)

1. Create RFC/proposal document
2. Team review and approval
3. Version bump in contract
4. Migration plan for existing data/clients
5. Implement with backward compatibility period
6. Deprecate old version

### Changelog Format

```markdown
## [2024-01-15] v2.1.0

### Added
- `GET /users/{id}/preferences` endpoint

### Changed
- `POST /users` now requires `email` field

### Deprecated
- `GET /users/{id}/settings` (use preferences instead)
```

---

## Tools Integration

### Database (DBML)

| Tool | Purpose |
|------|---------|
| [dbdiagram.io](https://dbdiagram.io) | Visual DBML editor |
| [dbml-cli](https://www.dbml.org/cli) | DBML to SQL conversion |
| [prisma-dbml-generator](https://github.com/notiz-dev/prisma-dbml-generator) | Prisma ↔ DBML |

### API (OpenAPI)

| Tool | Purpose |
|------|---------|
| [Swagger Editor](https://editor.swagger.io) | Visual OpenAPI editor |
| [Prism](https://stoplight.io/prism) | Mock server from spec |
| [openapi-typescript](https://github.com/drwpow/openapi-typescript) | TypeScript types |
| [Redoc](https://redocly.com/redoc) | API documentation |

---

## Anti-Patterns

### ❌ Bad Practices

| Anti-Pattern | Problem |
|--------------|---------|
| Code first, contract later | Contracts become documentation, not design |
| Skipping contract review | Misalignment between teams |
| Not versioning contracts | Breaking changes without warning |
| Contracts diverge from implementation | False documentation |

### ✅ Good Practices

| Practice | Benefit |
|----------|---------|
| Contract review before coding | Alignment and early feedback |
| Automated contract tests | Contracts stay in sync with code |
| Semantic versioning | Clear breaking change signals |
| Generated types from contracts | Type safety, single source of truth |

---

## Checklist

### Before Implementation

- [ ] DBML schema reviewed and approved
- [ ] OpenAPI spec reviewed and approved
- [ ] Types generated from contracts
- [ ] Mock server available for frontend

### During Implementation

- [ ] Database matches DBML exactly
- [ ] API matches OpenAPI exactly
- [ ] Contract tests passing

### After Implementation

- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] CHANGELOG updated (if contracts changed)
