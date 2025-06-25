# Contributing to link-parser

We love your input! We want to make contributing to link-parser as easy and transparent as possible.

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`.
2. If you've added code that should be tested, add tests.
3. If you've changed APIs, update the documentation.
4. Ensure the test suite passes.
5. Make sure your code lints.
6. Issue that pull request!

## Setting Up Development Environment

```bash
# Clone your fork
git clone https://github.com/your-username/link-parser.git
cd link-parser

# Install dependencies
npm install

# Run tests in watch mode
npm run test:watch

# Run linter
npm run lint

# Build the project
npm run build
```

## Adding a New Platform

See our [Platform Implementation Guide](./New-Platform-Implementation-Guide.md) for detailed instructions.

Quick overview:
1. Create a new module in `src/utils/parse/platforms/[platform-name]/`
2. Implement the `PlatformModule` interface
3. Add the platform to the `Platforms` enum
4. Register it in `src/utils/parse/platforms/index.ts`
5. Write comprehensive tests

## Code Style

- We use Prettier for code formatting (run `npm run format`)
- We use ESLint for linting (run `npm run lint`)
- Follow the existing code style
- Use descriptive variable names
- Add comments for complex logic

## Testing

- Write tests for all new functionality
- Aim for 100% code coverage
- Test edge cases and error conditions
- Use descriptive test names

Example test structure:
```typescript
describe('PlatformName', () => {
  describe('detection', () => {
    test('detects valid URLs', () => {
      // Test cases
    });
    
    test('rejects invalid URLs', () => {
      // Test cases
    });
  });
  
  describe('extraction', () => {
    test('extracts username from profile URL', () => {
      // Test cases
    });
  });
});
```

## Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update the platform list if you've added a new platform
3. The PR will be merged once you have the sign-off of at least one maintainer

## Any contributions you make will be under the MIT Software License

When you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project.

## Report bugs using GitHub's [issue tracker](https://github.com/Nathaniellaquis/link-parser/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/Nathaniellaquis/link-parser/issues/new).

**Great Bug Reports** tend to have:
- A quick summary and/or background
- Steps to reproduce
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 