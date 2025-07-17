# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

link-parser (published as `social-link-parser` on npm) is a TypeScript library that extracts structured data from social media URLs across 100+ platforms. It provides URL parsing, handle validation, URL building, and embed generation functionality.

## Essential Commands

### Development
```bash
# Install dependencies
npm install

# Run tests
npm test

# Run a specific test file
npm test -- tests/platforms/twitter/twitter.test.ts

# Run tests in watch mode
npm test -- --watch

# Build the library (both CommonJS and ESM)
npm run build

# Build only CommonJS
npm run build:cjs

# Build only ESM
npm run build:esm

# Lint code
npm run lint

# Format code
npm run format

# Clean build artifacts
npm run clean
```

### Publishing
```bash
# Bump version (updates package.json and creates git tag)
npm version patch|minor|major

# Publish to npm
npm publish
```

## Architecture

### Core Structure
The library follows a modular platform-based architecture:

```
src/
├── index.ts                    # Exports main parse() function
└── utils/parse/
    ├── core/
    │   ├── detector.ts        # Platform detection from URLs
    │   ├── parser.ts          # Main parsing orchestration
    │   └── types.ts           # TypeScript interfaces (ParseResult, Platform enum)
    ├── platforms/             # Each platform has its own module
    │   └── [platform]/
    │       ├── regex.ts       # URL patterns for the platform
    │       ├── extract.ts     # Extract data from URL matches
    │       ├── build.ts       # Build URLs from usernames/IDs
    │       ├── validate.ts    # Validate handles/usernames
    │       └── types.ts       # Platform-specific types
    └── utils/
        ├── url.ts            # URL normalization (removes tracking params)
        └── constants.ts      # Shared regex patterns
```

### Key Design Patterns

1. **Platform Detection Flow**: 
   - `detector.ts` iterates through all platforms checking URL patterns
   - Returns first matching platform or null
   - Each platform defines multiple URL patterns in `regex.ts`

2. **Data Extraction**:
   - Platform's `extract()` function receives regex match groups
   - Extracts username, userID, and other metadata
   - Returns structured data conforming to ParseResult interface

3. **Dual Module System**:
   - Builds to both CommonJS (`dist/cjs/`) and ESM (`dist/esm/`)
   - ESM build requires post-processing to add `.js` extensions
   - Type definitions exported separately

### Important Implementation Notes

- The current `extract()` method uses object mutation (documented as an anti-pattern in architecture-fixes.md)
- Platform detection stops at first match (can miss valid alternate formats)
- URL normalization runs before parsing to handle tracking parameters
- Protocol-less URLs (e.g., "youtube.com/watch?v=...") are supported via smart domain detection

## Testing Approach

- Each platform has comprehensive test coverage in `tests/platforms/[platform]/`
- Tests cover: URL parsing, handle validation, URL building, edge cases
- Use Jest snapshots sparingly - prefer explicit assertions
- Minimum 80% code coverage required

## Adding New Platforms

See `New-Platform-Implementation-Guide.md` for detailed instructions. Basic steps:
1. Create new directory under `src/utils/parse/platforms/`
2. Implement required modules: regex, extract, build, validate, types
3. Add to Platform enum in `src/utils/parse/core/types.ts`
4. Create comprehensive tests
5. Update platform count in README.md