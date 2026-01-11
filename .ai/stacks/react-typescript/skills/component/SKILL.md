# Component Development Skill

> Create React components following project standards.

## Trigger

- New component needed
- Figma design provided
- Feature implementation requires UI

## Steps

1. **Analyze Requirements**
   - What does the component do?
   - What props does it need?
   - What states does it have?
   - Is it reusable or feature-specific?

2. **Determine Location**

   | Type             | Location                         |
   | ---------------- | -------------------------------- |
   | Shared UI        | `shared/components/ui/`          |
   | Feature-specific | `features/{feature}/components/` |
   | Layout           | `shared/components/layouts/`     |

3. **Create Component Structure**

   ```
   components/
   └── MyComponent/
       ├── MyComponent.tsx       # Main component
       ├── MyComponent.test.tsx  # Tests
       └── index.ts              # Export
   ```

4. **Implement Component**

   ```typescript
   // 1. Imports
   import { useState, useCallback } from 'react'
   import { cn } from '@/shared/utils/cn'
   import type { ComponentProps } from './types'

   // 2. Props interface
   interface MyComponentProps {
     title: string
     onAction?: () => void
     className?: string
   }

   // 3. Component
   export function MyComponent({
     title,
     onAction,
     className
   }: MyComponentProps): React.ReactElement {
     const [isActive, setIsActive] = useState(false)

     const handleClick = useCallback(() => {
       setIsActive(prev => !prev)
       onAction?.()
     }, [onAction])

     return (
       <div
         className={cn('base-styles', isActive && 'active-styles', className)}
         onClick={handleClick}
       >
         <h3>{title}</h3>
       </div>
     )
   }
   ```

5. **Write Tests**

   ```typescript
   import { render, screen } from '@testing-library/react'
   import { userEvent } from '@testing-library/user-event'
   import { MyComponent } from './MyComponent'

   describe('MyComponent', () => {
     it('should render title', () => {
       render(<MyComponent title="Test" />)
       expect(screen.getByText('Test')).toBeInTheDocument()
     })

     it('should call onAction when clicked', async () => {
       const onAction = vi.fn()
       const user = userEvent.setup()

       render(<MyComponent title="Test" onAction={onAction} />)
       await user.click(screen.getByText('Test'))

       expect(onAction).toHaveBeenCalled()
     })
   })
   ```

6. **Export from Index**

   ```typescript
   // components/index.ts
   export { MyComponent } from "./MyComponent";
   export type { MyComponentProps } from "./MyComponent";
   ```

## Component Templates

### Presentational Component

```typescript
interface CardProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function Card({
  title,
  description,
  children,
  className
}: CardProps): React.ReactElement {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      <h3 className="font-semibold">{title}</h3>
      {description && <p className="text-muted">{description}</p>}
      {children}
    </div>
  )
}
```

### Interactive Component

```typescript
interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  onClick?: () => void
  className?: string
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  onClick,
  className,
}: ButtonProps): React.ReactElement {
  return (
    <button
      className={cn(
        'rounded font-medium transition-colors',
        variantStyles[variant],
        sizeStyles[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}
```

### Form Component

```typescript
interface FormInputProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'password'
  error?: string
  register: UseFormRegister<any>
}

export function FormInput({
  label,
  name,
  type = 'text',
  error,
  register,
}: FormInputProps): React.ReactElement {
  return (
    <div className="space-y-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={name}
        type={type}
        {...register(name)}
        className={cn(
          'w-full rounded border px-3 py-2',
          error && 'border-red-500'
        )}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
```

## Checklist

- [ ] Props interface defined
- [ ] TypeScript types correct
- [ ] Styles use cn() helper
- [ ] className prop for customization
- [ ] Accessibility (aria labels, roles)
- [ ] Tests written
- [ ] Exported from index
