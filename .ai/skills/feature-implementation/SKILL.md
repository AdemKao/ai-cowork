---
name: feature-implementation
description: Implement new features following BDD/TDD workflow. Use when building new features, implementing user stories, or adding functionality.
---

# Feature Implementation Skill

## Instructions

- [ ] Feature spec exists (or create one first)
- [ ] Dependencies identified
- [ ] Acceptance criteria clear

## Steps

1. **Read and Understand Spec**

   ```
   docs/specs/features/{module}/{feature}.feature.md
   ```

   Understand:
   - User stories
   - Acceptance criteria
   - UI/UX requirements
   - Technical constraints

2. **Plan Implementation**

   Break down into tasks:

   ```markdown
   ## Implementation Plan: [Feature Name]

   ### Tasks

   1. [ ] Create types/interfaces
   2. [ ] Implement service layer
   3. [ ] Write unit tests for service
   4. [ ] Create UI components
   5. [ ] Write component tests
   6. [ ] Integrate and test E2E
   7. [ ] Update documentation
   ```

3. **Setup Structure**

   Create necessary files:

   ```
   features/{module}/
   ├── components/
   │   └── FeatureComponent.tsx
   ├── hooks/
   │   └── useFeature.ts
   ├── services/
   │   └── featureService.ts
   ├── types/
   │   └── index.ts
   └── __tests__/
       └── *.test.ts
   ```

4. **TDD: Service Layer**

   ```typescript
   // 1. Write failing test
   describe("FeatureService", () => {
     it("should do expected behavior", async () => {
       const service = new FeatureService();
       const result = await service.doSomething();
       expect(result).toBe(expected);
     });
   });

   // 2. Implement minimal code to pass
   // 3. Refactor
   // 4. Repeat for each behavior
   ```

5. **Implement UI Components**

   Following design specs:
   - Use existing UI components
   - Follow project patterns
   - Ensure accessibility

6. **Integration Testing**

   ```typescript
   // Test component with real hooks/context
   describe('FeatureComponent', () => {
     it('should render and handle user interaction', () => {
       render(<FeatureComponent />)
       // Test user flows
     })
   })
   ```

7. **E2E Testing** (if applicable)

   ```gherkin
   Feature: [Feature Name]
     Scenario: [Happy path]
       Given [precondition]
       When [action]
       Then [expected result]
   ```

8. **Verify and Clean Up**

   ```bash
   pnpm lint
   pnpm test
   pnpm build
   ```

## Output Checklist

### Code Deliverables

- [ ] Types/interfaces defined
- [ ] Service layer implemented
- [ ] UI components created
- [ ] Hooks implemented (if needed)

### Quality Deliverables

- [ ] Unit tests (70%+ coverage for services)
- [ ] Component tests
- [ ] E2E tests (for critical paths)
- [ ] No linter errors
- [ ] Build passes

### Documentation Deliverables

- [ ] Code comments for complex logic
- [ ] README updated (if API changed)
- [ ] Feature spec status updated

## Example: Implementing Search Feature

### 1. Read Spec

```markdown
# docs/specs/features/tenant/search.feature.md

## Story 1: Keyword Search

As a tenant, I want to search properties by keyword...
```

### 2. Create Types

```typescript
// features/tenant/types/search.ts
export interface SearchFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
}

export interface SearchResult {
  properties: Property[];
  total: number;
  page: number;
}
```

### 3. Implement Service (TDD)

```typescript
// services/searchService.test.ts
describe("SearchService", () => {
  it("should return properties matching keyword", async () => {
    const service = new SearchService(mockApi);
    const result = await service.search({ keyword: "apartment" });
    expect(result.properties).toHaveLength(2);
  });
});

// services/searchService.ts
export class SearchService {
  async search(filters: SearchFilters): Promise<SearchResult> {
    return this.api.get("/properties/search", { params: filters });
  }
}
```

### 4. Create Components

```typescript
// components/SearchBar.tsx
export function SearchBar({ onSearch }: SearchBarProps) {
  const [keyword, setKeyword] = useState('')

  return (
    <form onSubmit={() => onSearch({ keyword })}>
      <Input
        value={keyword}
        onChange={setKeyword}
        placeholder="Search properties..."
      />
      <Button type="submit">Search</Button>
    </form>
  )
}
```

### 5. Create Hook

```typescript
// hooks/useSearch.ts
export function useSearch() {
  const [filters, setFilters] = useState<SearchFilters>({});
  const [results, setResults] = useState<SearchResult | null>(null);

  const search = async (newFilters: SearchFilters) => {
    setFilters(newFilters);
    const result = await searchService.search(newFilters);
    setResults(result);
  };

  return { filters, results, search };
}
```

### 6. Verify

```bash
pnpm test -- features/tenant
pnpm lint
pnpm build
```
