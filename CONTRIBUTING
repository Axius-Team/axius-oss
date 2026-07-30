Axius OSS Contributing Guide

Thank you for considering contributing to Axius OSS. This project is built for developers who want full control over their server management stack, and every contribution helps make it better.

Before contributing, please read the README and understand the core principles of the project: no cloud dependencies, no telemetry, single-user, self-hosted.

If you discover a security vulnerability, do not open a public issue or pull request. Please read the SECURITY file for instructions on how to report it privately.

Getting Started

1. Fork the repository.
2. Clone your fork locally.
3. Copy .env.example to .env.local and generate the required secrets as described in the README.
4. Run pnpm install to install dependencies.
5. Start the development environment with pnpm dev:all.

Development Workflow

This project follows these conventions:

- Commit messages follow Conventional Commits format.
- Code is written in TypeScript with strict mode enabled.
- UI components follow Atomic Design (atoms, molecules, organisms, templates, pages).
- Use existing shadcn/ui components before creating new ones.
- All code is written in English: variable names, function names, UI text, and comments.
- Inline comments in code are not permitted. Function and variable names should be self-documenting.

Pull Request Process

1. Create a feature branch from main. Use a descriptive name such as feat/add-container-logs or fix/session-timeout.
2. Make your changes following the coding conventions above.
3. Ensure your code builds without errors. Run pnpm build to verify.
4. Update documentation if your changes affect public APIs, configuration, or usage.
5. Open a pull request against the main branch.
6. Provide a clear description of the changes and the motivation behind them.

Code Review

All pull requests require review before merging. Maintainers may ask for changes or clarification. This is a normal part of the process. Please be responsive to feedback.

What to Contribute

We welcome contributions in these areas:

- Bug fixes and stability improvements.
- Performance optimizations.
- Documentation improvements.
- New integrations that align with the self-hosted philosophy.
- UI polish and accessibility improvements.

What Not to Contribute

The following changes are unlikely to be accepted:

- Features that introduce cloud dependencies or external API calls.
- Multi-user or role-based access control features.
- Telemetry or analytics of any kind.
- Features that require a database other than SQLite.
- Changes that break the single-user design principle.

Testing

Manual testing is sufficient for most contributions. If you add a new feature, describe how you tested it in your pull request. Automated test coverage is planned for future iterations.

Questions

If you have questions about contributing, open a discussion on GitHub or email support@axius.pro. The maintainers are happy to help.
