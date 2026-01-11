---
name: laravel-controller
description: Create Laravel controller with Form Requests, Resources, and Service integration
triggers:
  - create controller
  - add endpoint
  - api controller
---

# Laravel Controller Skill

> Create RESTful API controllers following Laravel best practices.

## Workflow

```
1. Identify Resource
   └─→ What model/resource is this controller for?

2. Create Files
   ├─→ Controller
   ├─→ Form Requests (Store, Update)
   ├─→ API Resource
   └─→ Routes

3. Implement Methods
   └─→ index, store, show, update, destroy

4. Add Tests
   └─→ Feature tests for each endpoint
```

## Commands

```bash
# Create controller
php artisan make:controller Api/UserController --api --model=User

# Create form requests
php artisan make:request StoreUserRequest
php artisan make:request UpdateUserRequest

# Create resource
php artisan make:resource UserResource

# Create test
php artisan make:test UserControllerTest
```

## Controller Template

```php
<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Store{Model}Request;
use App\Http\Requests\Update{Model}Request;
use App\Http\Resources\{Model}Resource;
use App\Models\{Model};
use App\Services\{Model}Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class {Model}Controller extends Controller
{
    public function __construct(
        private {Model}Service ${model}Service
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(): AnonymousResourceCollection
    {
        ${models} = {Model}::query()
            ->latest()
            ->paginate();

        return {Model}Resource::collection(${models});
    }

    /**
     * Store a newly created resource.
     */
    public function store(Store{Model}Request $request): JsonResponse
    {
        ${model} = $this->{model}Service->create($request->validated());

        return (new {Model}Resource(${model}))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     */
    public function show({Model} ${model}): {Model}Resource
    {
        return new {Model}Resource(${model});
    }

    /**
     * Update the specified resource.
     */
    public function update(Update{Model}Request $request, {Model} ${model}): {Model}Resource
    {
        ${model} = $this->{model}Service->update(${model}, $request->validated());

        return new {Model}Resource(${model});
    }

    /**
     * Remove the specified resource.
     */
    public function destroy({Model} ${model}): JsonResponse
    {
        $this->{model}Service->delete(${model});

        return response()->json(null, 204);
    }
}
```

## Routes

```php
// routes/api.php

use App\Http\Controllers\Api\UserController;

Route::apiResource('users', UserController::class);

// Or with specific methods
Route::apiResource('users', UserController::class)
    ->only(['index', 'show']);

// Nested resources
Route::apiResource('users.orders', UserOrderController::class);
```

## Form Request Template

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class Store{Model}Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'status' => ['required', Rule::in(['active', 'inactive'])],
        ];
    }
}

class Update{Model}Request extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => [
                'sometimes', 
                'email', 
                Rule::unique('users')->ignore($this->user),
            ],
            'status' => ['sometimes', Rule::in(['active', 'inactive'])],
        ];
    }
}
```

## API Resource Template

```php
<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class {Model}Resource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'status' => $this->status,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),

            // Conditional fields
            'orders_count' => $this->when(
                $this->orders_count !== null,
                $this->orders_count
            ),

            // Relationships (only when loaded)
            'orders' => OrderResource::collection(
                $this->whenLoaded('orders')
            ),
        ];
    }
}
```

## Checklist

- [ ] Controller uses dependency injection
- [ ] Form Requests handle validation
- [ ] API Resource transforms output
- [ ] Routes registered in api.php
- [ ] Feature tests cover all endpoints
- [ ] Authorization via Policy (if needed)
