---
name: laravel-model
description: Create Laravel Eloquent model with relationships, scopes, and casts
triggers:
  - create model
  - add model
  - eloquent model
---

# Laravel Model Skill

> Create Eloquent models with proper relationships, scopes, and casts.

## Workflow

```
1. Identify Entity
   └─→ What does this model represent?

2. Define Attributes
   ├─→ Fillable fields
   ├─→ Hidden fields
   └─→ Casts

3. Define Relationships
   └─→ hasMany, belongsTo, belongsToMany, etc.

4. Add Scopes
   └─→ Common query filters

5. Create Factory
   └─→ For testing
```

## Commands

```bash
# Create model with migration, factory, seeder
php artisan make:model Product -mfs

# Create model with all
php artisan make:model Product -a
```

## Model Template

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;

class {Model} extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'description',
        'price',
        'status',
        'user_id',
    ];

    /**
     * The attributes that should be hidden.
     */
    protected $hidden = [
        // 'secret_field',
    ];

    /**
     * The attributes that should be cast.
     */
    protected $casts = [
        'price' => 'decimal:2',
        'is_active' => 'boolean',
        'metadata' => 'array',
        'published_at' => 'datetime',
    ];

    /**
     * The model's default values.
     */
    protected $attributes = [
        'status' => 'draft',
        'is_active' => true,
    ];

    // ==================
    // Relationships
    // ==================

    /**
     * Get the user that owns this model.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the items for this model.
     */
    public function items(): HasMany
    {
        return $this->hasMany(Item::class);
    }

    // ==================
    // Scopes
    // ==================

    /**
     * Scope to active records.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to recent records.
     */
    public function scopeRecent(Builder $query, int $days = 7): Builder
    {
        return $query->where('created_at', '>=', now()->subDays($days));
    }

    // ==================
    // Accessors & Mutators
    // ==================

    /**
     * Get the formatted price.
     */
    protected function formattedPrice(): Attribute
    {
        return Attribute::make(
            get: fn () => '$' . number_format($this->price, 2),
        );
    }

    /**
     * Set the name (auto-generate slug).
     */
    protected function name(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => [
                'name' => $value,
                'slug' => Str::slug($value),
            ],
        );
    }

    // ==================
    // Methods
    // ==================

    /**
     * Check if this model is published.
     */
    public function isPublished(): bool
    {
        return $this->status === 'published' 
            && $this->published_at?->isPast();
    }

    /**
     * Publish this model.
     */
    public function publish(): void
    {
        $this->update([
            'status' => 'published',
            'published_at' => now(),
        ]);
    }
}
```

## Relationship Types

```php
// One to Many
public function posts(): HasMany
{
    return $this->hasMany(Post::class);
}

// Belongs To
public function author(): BelongsTo
{
    return $this->belongsTo(User::class, 'author_id');
}

// Many to Many
public function tags(): BelongsToMany
{
    return $this->belongsToMany(Tag::class)
        ->withTimestamps()
        ->withPivot('order');
}

// Has One
public function profile(): HasOne
{
    return $this->hasOne(Profile::class);
}

// Has Many Through
public function comments(): HasManyThrough
{
    return $this->hasManyThrough(Comment::class, Post::class);
}

// Polymorphic
public function comments(): MorphMany
{
    return $this->morphMany(Comment::class, 'commentable');
}
```

## Factory Template

```php
<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class {Model}Factory extends Factory
{
    public function definition(): array
    {
        return [
            'name' => fake()->sentence(3),
            'description' => fake()->paragraph(),
            'price' => fake()->randomFloat(2, 10, 1000),
            'status' => fake()->randomElement(['draft', 'published']),
            'is_active' => true,
            'user_id' => User::factory(),
        ];
    }

    /**
     * Indicate that the model is published.
     */
    public function published(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => now(),
        ]);
    }

    /**
     * Indicate that the model is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }
}
```

## Checklist

- [ ] `$fillable` defined (not `$guarded = []`)
- [ ] `$casts` for non-string types
- [ ] Relationships properly typed
- [ ] Scopes for common queries
- [ ] Factory created with states
- [ ] Soft deletes if needed
