# Changelog

## 0.2.0

### Minor Changes

- f9f7d9a: ## 🎉 Initial Release (v0.1.0)

  First public release of @happytools/ai-cowork - a portable AI development workflow system.

  ### Features

  - **CLI Tool** (`ai-cowork`) with commands: `init`, `list`, `add`, `sync`, `update`
  - **Interactive stack selection** when stack cannot be auto-detected
  - **Multi-stack support**: React/TypeScript, PHP/Laravel, Node/Express
  - **AI tool bridges**: OpenCode, Claude Code, Cursor
  - **Skills**: code-review, debug, commit, refactor, documentation, notify, and more

  ### Installation

  ```bash
  npm install -g @happytools/ai-cowork
  npx @happytools/ai-cowork init
  ```

## 0.2.0

### Minor Changes

- f9f5315: ## 🎉 Initial Beta Release (v0.1.0)

  First public beta release of ai-cowork - a portable AI development workflow system.

  ### Features

  - **CLI Tool** (`ai-cowork`) with commands: `init`, `list`, `add`, `sync`, `update`
  - **Interactive stack selection** when stack cannot be auto-detected
  - **`--yes` flag** to skip prompts and use defaults
  - **Multi-stack support**: React/TypeScript, PHP/Laravel, Node/Express
  - **AI tool bridges**: OpenCode, Claude Code, Cursor
  - **Core standards**: code quality, naming, security, documentation, testing
  - **Core workflows**: BDD/TDD, code review, git workflow, contract-driven, stacked development
  - **Skills**: code-review, debug, commit, refactor, documentation, feature-implementation, notify, and more
  - **Notification support**: Telegram and Desktop notifications via shell scripts
  - **FSD Architecture**: Feature-Sliced Design support for React/TypeScript

  ### Installation

  ```bash
  npm install -g ai-cowork
  npx ai-cowork init
  ```

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.0] - 2026-01-11

### Added

- Initial project structure with `.ai/` directory
- CLI tool (`ai-cowork`) with commands: `init`, `list`, `add`, `sync`, `update`
- Interactive stack selection when stack cannot be detected
- `--yes` flag to skip prompts and use defaults
- Core standards: code quality, naming, security, documentation, testing
- Core workflows: BDD/TDD, code review, git workflow, contract-driven development
- Skills: code-review, debug, commit, refactor, documentation, feature-implementation, ui-ux, feature-decompose, worktree-agent, notify
- Notification skill with Telegram and Desktop support (shell scripts, no runtime required)
- Stacked development workflow for large features with multiple PRs
- FSD (Feature-Sliced Design) architecture support for react-typescript stack
- Stack templates: react-typescript, php-laravel, node-express
- AI tool sync: OpenCode, Claude Code
- Specialized agents: backend-engineer, frontend-engineer, tester, explorer, orchestrator
- Context loading system with `index.md` entry point

### Documentation

- README.md with installation and usage instructions
- README.zh-TW.md (Traditional Chinese)
- CONTRIBUTING.md with contribution guidelines
- CODE_OF_CONDUCT.md

---

[Unreleased]: https://github.com/AdemKao/ai-cowork/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/AdemKao/ai-cowork/releases/tag/v0.1.0
