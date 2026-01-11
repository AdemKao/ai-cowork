# DBML Standard

> Database Markup Language conventions for schema design.

## Overview

DBML (Database Markup Language) is a simple, readable DSL for defining database schemas. It serves as the **Single Source of Truth** for database structure.

---

## File Location

```
docs/
└── contracts/
    └── schema.dbml       # Main schema file
```

For large projects, split by domain:

```
docs/
└── contracts/
    └── schema/
        ├── _index.dbml   # Imports all
        ├── auth.dbml
        ├── users.dbml
        └── products.dbml
```

---

## Basic Syntax

### Tables

```dbml
Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  name varchar(100) [not null]
  role user_role [not null, default: 'user']
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
  deleted_at timestamp [note: 'Soft delete']
  
  Note: 'Core user account information'
}
```

### Enums

```dbml
Enum user_role {
  admin [note: 'Full system access']
  manager [note: 'Team management']
  user [note: 'Standard user']
}

Enum order_status {
  pending
  confirmed
  shipped
  delivered
  cancelled
}
```

### Relationships

```dbml
// One-to-Many
Table posts {
  id uuid [pk]
  user_id uuid [not null, ref: > users.id]
  title varchar(200) [not null]
}

// Many-to-Many (junction table)
Table user_roles {
  user_id uuid [ref: > users.id]
  role_id uuid [ref: > roles.id]
  
  indexes {
    (user_id, role_id) [pk]
  }
}

// One-to-One
Table user_profiles {
  id uuid [pk]
  user_id uuid [unique, not null, ref: - users.id]
  bio text
}
```

### Indexes

```dbml
Table products {
  id uuid [pk]
  name varchar(200) [not null]
  category_id uuid [not null]
  price decimal(10,2) [not null]
  status product_status [not null]
  created_at timestamp [not null]
  
  indexes {
    category_id [name: 'idx_products_category']
    (category_id, status) [name: 'idx_products_category_status']
    created_at [type: btree]
    name [type: gin, note: 'Full text search']
  }
}
```

---

## Naming Conventions

### Tables

| Convention | Example |
|------------|---------|
| Plural, snake_case | `users`, `order_items` |
| Junction tables: both names | `user_roles`, `product_categories` |
| Descriptive names | `password_reset_tokens` |

### Columns

| Convention | Example |
|------------|---------|
| Singular, snake_case | `email`, `first_name` |
| Foreign keys: singular + `_id` | `user_id`, `category_id` |
| Boolean: is/has prefix | `is_active`, `has_verified` |
| Timestamps: `_at` suffix | `created_at`, `deleted_at` |

### Enums

| Convention | Example |
|------------|---------|
| Singular, snake_case | `user_role`, `order_status` |
| Values: lowercase | `pending`, `confirmed` |

---

## Required Columns

Every table should have:

```dbml
Table example {
  // Primary key
  id uuid [pk, default: `gen_random_uuid()`]
  
  // ... other columns ...
  
  // Timestamps (always include)
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
  
  // Soft delete (optional but recommended)
  deleted_at timestamp
}
```

---

## Common Patterns

### Soft Delete

```dbml
Table users {
  id uuid [pk]
  // ...
  deleted_at timestamp [note: 'NULL = active, timestamp = deleted']
  
  indexes {
    deleted_at [note: 'Filter active records']
  }
}
```

### Audit Trail

```dbml
Table audit_logs {
  id uuid [pk]
  table_name varchar(100) [not null]
  record_id uuid [not null]
  action audit_action [not null]
  old_values jsonb
  new_values jsonb
  user_id uuid [ref: > users.id]
  created_at timestamp [not null, default: `now()`]
  
  indexes {
    (table_name, record_id)
    user_id
    created_at
  }
}

Enum audit_action {
  insert
  update
  delete
}
```

### Polymorphic Relations

```dbml
Table comments {
  id uuid [pk]
  body text [not null]
  
  // Polymorphic: can belong to posts, products, etc.
  commentable_type varchar(50) [not null]
  commentable_id uuid [not null]
  
  user_id uuid [not null, ref: > users.id]
  created_at timestamp [not null, default: `now()`]
  
  indexes {
    (commentable_type, commentable_id)
  }
  
  Note: 'Polymorphic comments for any entity'
}
```

### Multi-Tenancy

```dbml
Table tenants {
  id uuid [pk]
  name varchar(100) [not null]
  slug varchar(50) [unique, not null]
  created_at timestamp [not null, default: `now()`]
}

Table users {
  id uuid [pk]
  tenant_id uuid [not null, ref: > tenants.id]
  email varchar(255) [not null]
  
  indexes {
    (tenant_id, email) [unique]
  }
  
  Note: 'All queries must filter by tenant_id'
}
```

---

## Documentation

### Table Notes

```dbml
Table orders {
  id uuid [pk]
  // ...
  
  Note: '''
    Orders represent customer purchases.
    
    Business Rules:
    - Cannot be modified after status = 'shipped'
    - Must have at least one order_item
    - Total is calculated from items, not stored
  '''
}
```

### Column Notes

```dbml
Table products {
  id uuid [pk]
  sku varchar(50) [unique, not null, note: 'Stock Keeping Unit']
  price decimal(10,2) [not null, note: 'Price in USD, excludes tax']
  weight_kg decimal(5,2) [note: 'Shipping weight in kilograms']
}
```

---

## Validation Checklist

Before approving DBML:

### Structure
- [ ] All tables have `id` primary key
- [ ] All tables have `created_at`, `updated_at`
- [ ] Foreign keys properly defined
- [ ] Indexes on frequently queried columns

### Naming
- [ ] Tables are plural, snake_case
- [ ] Columns are singular, snake_case
- [ ] Foreign keys use `_id` suffix
- [ ] Enums are singular

### Documentation
- [ ] Tables have Note explaining purpose
- [ ] Complex columns have notes
- [ ] Business rules documented

### Performance
- [ ] Indexes on foreign keys
- [ ] Composite indexes for common queries
- [ ] No missing indexes on WHERE/ORDER BY columns

---

## Tools

| Tool | Purpose | Command |
|------|---------|---------|
| [dbdiagram.io](https://dbdiagram.io) | Visual editor | (web) |
| @dbml/cli | DBML to SQL | `dbml2sql schema.dbml` |
| @dbml/cli | SQL to DBML | `sql2dbml dump.sql` |

### Generate SQL

```bash
# PostgreSQL
dbml2sql schema.dbml --postgres -o schema.sql

# MySQL
dbml2sql schema.dbml --mysql -o schema.sql
```

---

## Example: E-commerce Schema

```dbml
// docs/contracts/schema.dbml

Project ecommerce {
  database_type: 'PostgreSQL'
  Note: 'E-commerce platform schema'
}

// === ENUMS ===

Enum user_role {
  admin
  customer
}

Enum order_status {
  pending
  paid
  shipped
  delivered
  cancelled
}

// === TABLES ===

Table users {
  id uuid [pk, default: `gen_random_uuid()`]
  email varchar(255) [unique, not null]
  password_hash varchar(255) [not null]
  name varchar(100) [not null]
  role user_role [not null, default: 'customer']
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
  deleted_at timestamp
  
  indexes {
    email
    deleted_at
  }
}

Table products {
  id uuid [pk, default: `gen_random_uuid()`]
  name varchar(200) [not null]
  description text
  price decimal(10,2) [not null]
  stock int [not null, default: 0]
  is_active boolean [not null, default: true]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
  
  indexes {
    is_active
    (is_active, created_at)
  }
}

Table orders {
  id uuid [pk, default: `gen_random_uuid()`]
  user_id uuid [not null, ref: > users.id]
  status order_status [not null, default: 'pending']
  total decimal(10,2) [not null]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp [not null, default: `now()`]
  
  indexes {
    user_id
    status
    (user_id, status)
  }
}

Table order_items {
  id uuid [pk, default: `gen_random_uuid()`]
  order_id uuid [not null, ref: > orders.id]
  product_id uuid [not null, ref: > products.id]
  quantity int [not null]
  unit_price decimal(10,2) [not null]
  
  indexes {
    order_id
  }
}
```
