# Laravel Standard

> Conventions and best practices for Laravel applications.

## Architecture

### Directory Structure

```
app/
├── Console/              # Artisan commands
├── Exceptions/           # Exception handlers
├── Http/
│   ├── Controllers/      # Request handlers
│   ├── Middleware/       # HTTP middleware
│   ├── Requests/         # Form requests (validation)
│   └── Resources/        # API resources (transformers)
├── Models/               # Eloquent models
├── Policies/             # Authorization policies
├── Providers/            # Service providers
├── Repositories/         # Data access layer (optional)
└── Services/             # Business logic layer

database/
├── factories/            # Model factories
├── migrations/           # Database migrations
└── seeders/              # Database seeders

tests/
├── Feature/              # Feature/integration tests
└── Unit/                 # Unit tests
```

### Layered Architecture

```
┌─────────────────────────────────────┐
│           Controllers               │  ← HTTP layer
├─────────────────────────────────────┤
│         Form Requests               │  ← Validation
├─────────────────────────────────────┤
│            Services                 │  ← Business logic
├─────────────────────────────────────┤
│          Repositories               │  ← Data access (optional)
├─────────────────────────────────────┤
│            Models                   │  ← Eloquent ORM
└─────────────────────────────────────┘
```

---

## Naming Conventions

### Classes

| Type | Convention | Example |
|------|------------|---------|
| Controller | Singular + Controller | `UserController` |
| Model | Singular | `User`, `OrderItem` |
| Migration | snake_case description | `create_users_table` |
| Seeder | Plural + Seeder | `UsersSeeder` |
| Factory | Model + Factory | `UserFactory` |
| Request | Action + Model + Request | `StoreUserRequest` |
| Resource | Model + Resource | `UserResource` |
| Policy | Model + Policy | `UserPolicy` |
| Service | Model + Service | `UserService` |
| Repository | Model + Repository | `UserRepository` |

### Methods

| Type | Convention | Example |
|------|------------|---------|
| Controller actions | RESTful | `index`, `store`, `show`, `update`, `destroy` |
| Relationships | camelCase | `orderItems()`, `createdBy()` |
| Scopes | scopeCamelCase | `scopeActive()`, `scopeRecent()` |
| Accessors | camelCase + Attribute | `getFullNameAttribute()` |
| Mutators | camelCase + Attribute | `setPasswordAttribute()` |

### Database

| Type | Convention | Example |
|------|------------|---------|
| Tables | plural, snake_case | `users`, `order_items` |
| Columns | singular, snake_case | `first_name`, `created_at` |
| Foreign keys | singular + _id | `user_id`, `order_id` |
| Pivot tables | alphabetical, singular | `order_product`, `role_user` |

---

## Controllers

### RESTful Controllers

```php
class UserController extends Controller
{
    public function __construct(
        private UserService $userService
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->userService->list();
        return UserResource::collection($users);
    }

    public function store(StoreUserRequest $request): JsonResponse
    {
        $user = $this->userService->create($request->validated());
        return new UserResource($user);
    }

    public function show(User $user): JsonResponse
    {
        return new UserResource($user);
    }

    public function update(UpdateUserRequest $request, User $user): JsonResponse
    {
        $user = $this->userService->update($user, $request->validated());
        return new UserResource($user);
    }

    public function destroy(User $user): JsonResponse
    {
        $this->userService->delete($user);
        return response()->json(null, 204);
    }
}
```

### Controller Rules

- ✅ Keep controllers thin (delegate to services)
- ✅ Use Form Requests for validation
- ✅ Use API Resources for responses
- ✅ Use route model binding
- ❌ Don't put business logic in controllers
- ❌ Don't use `Request` directly (use Form Requests)

---

## Models

### Model Structure

```php
class User extends Model
{
    use HasFactory, SoftDeletes;

    // 1. Properties
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'is_active' => 'boolean',
    ];

    // 2. Relationships
    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    // 3. Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    // 4. Accessors & Mutators
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => "{$this->first_name} {$this->last_name}",
        );
    }

    // 5. Methods
    public function isAdmin(): bool
    {
        return $this->roles->contains('name', 'admin');
    }
}
```

---

## Form Requests

```php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Or check permissions
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users'],
            'password' => ['required', 'min:8', 'confirmed'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email is already registered.',
        ];
    }
}
```

---

## API Resources

```php
class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'created_at' => $this->created_at->toISOString(),
            
            // Conditional
            'orders_count' => $this->when(
                $this->orders_count !== null,
                $this->orders_count
            ),
            
            // Relationships
            'orders' => OrderResource::collection(
                $this->whenLoaded('orders')
            ),
        ];
    }
}
```

---

## Services

```php
class UserService
{
    public function __construct(
        private UserRepository $userRepository
    ) {}

    public function create(array $data): User
    {
        $data['password'] = Hash::make($data['password']);
        
        $user = $this->userRepository->create($data);
        
        // Dispatch events, send emails, etc.
        event(new UserCreated($user));
        
        return $user;
    }

    public function update(User $user, array $data): User
    {
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }
        
        return $this->userRepository->update($user, $data);
    }
}
```

---

## Testing

### Feature Test

```php
class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_users(): void
    {
        User::factory()->count(3)->create();

        $response = $this->getJson('/api/users');

        $response
            ->assertOk()
            ->assertJsonCount(3, 'data');
    }

    public function test_can_create_user(): void
    {
        $data = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/users', $data);

        $response
            ->assertCreated()
            ->assertJsonPath('data.email', 'john@example.com');
        
        $this->assertDatabaseHas('users', ['email' => 'john@example.com']);
    }

    public function test_validates_required_fields(): void
    {
        $response = $this->postJson('/api/users', []);

        $response
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'email', 'password']);
    }
}
```

### Unit Test

```php
class UserServiceTest extends TestCase
{
    public function test_hashes_password_on_create(): void
    {
        $repository = $this->mock(UserRepository::class);
        $repository->shouldReceive('create')
            ->once()
            ->withArgs(fn ($data) => Hash::check('password123', $data['password']))
            ->andReturn(new User());

        $service = new UserService($repository);
        
        $service->create([
            'name' => 'John',
            'email' => 'john@example.com',
            'password' => 'password123',
        ]);
    }
}
```

---

## Checklist

### Controller
- [ ] Uses Form Request for validation
- [ ] Uses API Resource for response
- [ ] Delegates business logic to Service
- [ ] Uses route model binding
- [ ] Returns appropriate HTTP status codes

### Model
- [ ] Has `$fillable` or `$guarded` defined
- [ ] Has `$casts` for non-string fields
- [ ] Relationships properly defined
- [ ] Uses soft deletes if needed

### Migration
- [ ] Has `up()` and `down()` methods
- [ ] Indexes on foreign keys
- [ ] Indexes on frequently queried columns
- [ ] Proper column types and constraints

### Test
- [ ] Feature tests for API endpoints
- [ ] Unit tests for services
- [ ] Uses factories for test data
- [ ] Tests validation rules
- [ ] Tests authorization
