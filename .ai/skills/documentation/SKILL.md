# Documentation Skill

> Create and maintain clear, useful documentation.

## Trigger

- New feature completed
- API changed
- Setup process changed
- User requests documentation

## Documentation Types

| Type     | Purpose                | Location        |
| -------- | ---------------------- | --------------- |
| README   | Project overview       | Root            |
| API Docs | Endpoint reference     | `/docs/api/`    |
| Guides   | How-to tutorials       | `/docs/guides/` |
| Specs    | Feature specifications | `/docs/specs/`  |
| ADRs     | Decision records       | `/docs/adr/`    |
| Comments | Code explanations      | In source       |

## Steps

1. **Identify Documentation Need**
   - What changed?
   - Who needs to know?
   - What format is best?

2. **Gather Information**
   - Read the code
   - Understand the feature
   - Note important details

3. **Choose Template**
   - Use existing templates when available
   - Follow project conventions

4. **Write Documentation**
   - Clear and concise
   - Include examples
   - Use proper formatting

5. **Review and Verify**
   - Test code examples
   - Check links
   - Proofread

## Templates

### README Section

```markdown
## Feature Name

Brief description of what this feature does.

### Usage

\`\`\`typescript
// Example code
const result = featureFunction(input)
\`\`\`

### Configuration

| Option  | Type   | Default | Description |
| ------- | ------ | ------- | ----------- |
| option1 | string | ''      | Description |
| option2 | number | 0       | Description |

### Examples

#### Basic Usage

\`\`\`typescript
// Code example
\`\`\`

#### Advanced Usage

\`\`\`typescript
// Code example
\`\`\`
```

### API Endpoint

```markdown
## Endpoint Name

Brief description.

### Request

\`\`\`
POST /api/resource
\`\`\`

#### Headers

| Header        | Required | Description  |
| ------------- | -------- | ------------ |
| Authorization | Yes      | Bearer token |

#### Body

\`\`\`json
{
"field": "value"
}
\`\`\`

### Response

#### Success (200)

\`\`\`json
{
"id": "uuid",
"field": "value"
}
\`\`\`

#### Errors

| Status | Code             | Description        |
| ------ | ---------------- | ------------------ |
| 400    | VALIDATION_ERROR | Invalid input      |
| 404    | NOT_FOUND        | Resource not found |
```

### How-To Guide

```markdown
# How to [Accomplish Task]

This guide explains how to [task] in [context].

## Prerequisites

- Prerequisite 1
- Prerequisite 2

## Steps

### Step 1: [Action]

Explanation of what to do.

\`\`\`bash
command to run
\`\`\`

### Step 2: [Action]

Explanation.

\`\`\`typescript
// Code example
\`\`\`

### Step 3: [Action]

Explanation.

## Verification

How to confirm it worked:

\`\`\`bash
verification command
\`\`\`

## Troubleshooting

### Problem 1

Solution.

### Problem 2

Solution.

## Next Steps

- Link to related guide
- Link to API docs
```

### ADR (Architecture Decision Record)

```markdown
# ADR-XXX: [Decision Title]

## Status

[Proposed | Accepted | Deprecated | Superseded]

## Context

What is the issue that we're seeing that is motivating this decision?

## Decision

What is the change that we're proposing and/or doing?

## Consequences

### Positive

- Benefit 1
- Benefit 2

### Negative

- Drawback 1
- Drawback 2

### Neutral

- Trade-off 1

## Alternatives Considered

### Alternative 1

Description and why rejected.

### Alternative 2

Description and why rejected.
```

## Writing Guidelines

### Be Direct

```markdown
# ❌ Verbose

In order to successfully install the package, you will need to run
the following command in your terminal application.

# ✅ Direct

Install with:
\`\`\`
npm install package
\`\`\`
```

### Use Examples

```markdown
# ❌ Abstract

The function accepts configuration options.

# ✅ Concrete

\`\`\`typescript
createUser({
name: 'John',
email: 'john@example.com',
role: 'admin'
})
\`\`\`
```

### Keep Current

```markdown
# ❌ Outdated

See the `config.json` file for options.
(But project now uses config.yaml)

# ✅ Current

See `config.yaml` for options:
\`\`\`yaml
option: value
\`\`\`
```

## Checklist

Before publishing:

- [ ] Spelling and grammar checked
- [ ] Code examples tested
- [ ] Links verified
- [ ] Formatting consistent
- [ ] No sensitive information
- [ ] Added to navigation/index (if applicable)
