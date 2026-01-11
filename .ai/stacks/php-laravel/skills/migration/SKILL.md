---
name: laravel-migration
description: Create Laravel database migrations with proper columns, indexes, and foreign keys
triggers:
  - create migration
  - add table
  - database migration
  - add column
---

# Laravel Migration Skill

> Create database migrations following best practices.

## Workflow

```
1. Plan Schema
   └─→ Use DBML or design document

2. Create Migration
   └─→ php artisan make:migration

3. Define Columns
   ├─→ Column types
   ├─→ Constraints
   └─→ Defaults

4. Add Indexes
   ├─→ Foreign keys
   └─→ Query optimization

5. Write Down Method
   └─→ Reversible migration
```

## Commands

```bash
# Create table
php artisan make:migration create_products_table

# Add columns to existing table
php artisan make:migration add_status_to_products_table

# Modify column
php artisan make:migration change_price_column_in_products_table
```

## Migration Template - Create Table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('{table_name}', function (Blueprint $table) {
            // Primary key
            $table->uuid('id')->primary();
            // Or: $table->id(); for auto-increment

            // Foreign keys
            $table->foreignUuid('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Regular columns
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->integer('quantity')->default(0);
            $table->boolean('is_active')->default(true);
            $table->json('metadata')->nullable();

            // Enum (use string for flexibility)
            $table->string('status')->default('draft');

            // Timestamps
            $table->timestamp('published_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index('status');
            $table->index(['status', 'is_active']);
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('{table_name}');
    }
};
```

## Migration Template - Add Columns

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('sku')->unique()->after('name');
            $table->foreignUuid('category_id')
                ->nullable()
                ->after('user_id')
                ->constrained()
                ->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['category_id']);
            $table->dropColumn(['sku', 'category_id']);
        });
    }
};
```

## Migration Template - Pivot Table

```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_tag', function (Blueprint $table) {
            $table->foreignUuid('product_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignUuid('tag_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->integer('order')->default(0);
            $table->timestamps();

            $table->primary(['product_id', 'tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_tag');
    }
};
```

## Common Column Types

```php
// Strings
$table->string('name');              // VARCHAR(255)
$table->string('code', 50);          // VARCHAR(50)
$table->text('description');         // TEXT
$table->longText('content');         // LONGTEXT

// Numbers
$table->integer('quantity');         // INT
$table->bigInteger('views');         // BIGINT
$table->decimal('price', 10, 2);     // DECIMAL(10,2)
$table->float('rating', 3, 2);       // FLOAT(3,2)

// Boolean
$table->boolean('is_active');        // TINYINT(1)

// Date/Time
$table->date('birth_date');          // DATE
$table->dateTime('starts_at');       // DATETIME
$table->timestamp('verified_at');    // TIMESTAMP
$table->time('opens_at');            // TIME

// JSON
$table->json('settings');            // JSON

// Binary
$table->binary('data');              // BLOB

// UUID
$table->uuid('uuid');                // CHAR(36)
$table->foreignUuid('user_id');      // CHAR(36) with FK
```

## Column Modifiers

```php
$table->string('name')
    ->nullable()           // Allow NULL
    ->default('value')     // Default value
    ->unique()             // Unique constraint
    ->index()              // Add index
    ->after('other_col')   // Position after column
    ->first()              // Position first
    ->comment('desc');     // Column comment
```

## Foreign Key Patterns

```php
// Standard foreign key
$table->foreignId('user_id')
    ->constrained()
    ->cascadeOnDelete();

// UUID foreign key
$table->foreignUuid('user_id')
    ->constrained()
    ->cascadeOnDelete();

// Nullable with set null
$table->foreignUuid('category_id')
    ->nullable()
    ->constrained()
    ->nullOnDelete();

// Custom table name
$table->foreignUuid('author_id')
    ->constrained('users')
    ->cascadeOnDelete();

// No action
$table->foreignUuid('created_by')
    ->constrained('users')
    ->restrictOnDelete();
```

## Index Patterns

```php
// Single column
$table->index('email');

// Composite index
$table->index(['status', 'created_at']);

// Unique
$table->unique('email');
$table->unique(['tenant_id', 'email']);

// Full-text (MySQL)
$table->fullText('description');

// Named index
$table->index('status', 'products_status_index');
```

## Checklist

- [ ] Primary key defined (uuid or id)
- [ ] Foreign keys with proper actions
- [ ] Indexes on foreign keys (automatic with foreignId)
- [ ] Indexes on frequently queried columns
- [ ] `down()` method properly reverses changes
- [ ] Nullable for optional fields
- [ ] Defaults for required fields
- [ ] Timestamps included
- [ ] Soft deletes if needed
