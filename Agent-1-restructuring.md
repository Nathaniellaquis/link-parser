# Agent 1: Architecture Restructuring - Major Social Platforms

## Overview
You are responsible for refactoring the core social media platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. instagram
2. facebook
3. twitter
4. tiktok
5. youtube
6. snapchat
7. linkedin
8. pinterest
9. reddit
10. threads
11. bluesky
12. tumblr

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.username = match[1];
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    username: match[1],
    ids: { postId: match[2] },
    metadata: { contentType: 'post' }
  };
}
```

### 2. Detection Logic Update (ONLY if needed)
**First check**: Does the current `detect()` method only check for specific patterns (profile, post, etc.)?
- If YES → Update to domain-only detection
- If NO (already domain-only) → Keep the existing implementation

**Example of restrictive detection (needs update):**
```typescript
detect(url: string): boolean {
  // This is TOO restrictive - only returns true for known patterns
  if (!this.domains.some(domain => url.includes(domain))) return false;
  
  if (this.patterns.profile.test(url)) return true;
  if (this.patterns.content?.post?.test(url)) return true;
  // etc...
  return false;
}
```

**Update to domain-only detection:**
```typescript
detect(url: string): boolean {
  // Simple domain check - allows ALL pages on the platform
  const urlLower = url.toLowerCase();
  return this.domains.some(domain => urlLower.includes(domain));
}
```

### 3. Use Centralized ExtractedData Type
The `ExtractedData` type is already defined in `src/utils/parse/core/types.ts`. Do NOT create duplicate type definitions in individual platform files.

## Complete Example: Instagram Refactoring

### Before (current instagram/index.ts):
```typescript
extract(url: string, result: ParsedUrl): void {
  // Handle embed URLs first
  const embedMatch = this.patterns.content?.embed?.exec(url)
  if (embedMatch) {
    result.ids.postId = embedMatch[1]
    result.metadata.isEmbed = true
    result.metadata.contentType = 'embed'
    return
  }
  // ... more mutations
}
```

### After (refactored instagram/index.ts):
```typescript
extract(url: string): ExtractedData | null {
  // Handle embed URLs first
  const embedMatch = this.patterns.content?.embed?.exec(url)
  if (embedMatch) {
    return {
      ids: { postId: embedMatch[1] },
      metadata: {
        isEmbed: true,
        contentType: 'embed'
      }
    };
  }

  // Handle story URLs
  const storyMatch = this.patterns.content?.story?.exec(url)
  if (storyMatch) {
    return {
      ids: {
        storyId: storyMatch[1],
        storyItemId: storyMatch[2]
      },
      metadata: {
        isStory: true,
        contentType: 'story'
      }
    };
  }

  // Handle live
  const liveMatch = this.patterns.content?.live?.exec(url)
  if (liveMatch) {
    return {
      username: liveMatch[1],
      metadata: {
        isLive: true,
        contentType: 'live'
      }
    };
  }

  // Handle other content types
  if (this.patterns.content) {
    for (const [type, patternValue] of Object.entries(this.patterns.content)) {
      if (type === 'story' || type === 'embed' || type === 'live') continue;
      const pattern = patternValue as RegExp | undefined;
      if (!pattern) continue;
      const match = pattern.exec(url);
      if (match) {
        return {
          ids: { [`${type}Id`]: match[1] },
          metadata: {
            [`is${type.charAt(0).toUpperCase() + type.slice(1)}`]: true,
            contentType: type
          }
        };
      }
    }
  }

  // Handle profile URLs
  const profileMatch = this.patterns.profile.exec(url);
  if (profileMatch) {
    return {
      username: profileMatch[1],
      metadata: {
        isProfile: true,
        contentType: 'profile'
      }
    };
  }

  return null;
}
```

## Testing Requirements

1. Update all test files to expect the new return format
2. Add tests for the simplified detect() method
3. Ensure all existing tests pass after refactoring
4. Add edge case tests for domain-only detection

### Example Test Update:
```typescript
// Before
it('should extract username', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  instagram.extract('https://instagram.com/johndoe', result);
  expect(result.username).toBe('johndoe');
});

// After
it('should extract username', () => {
  const result = instagram.extract('https://instagram.com/johndoe');
  expect(result).not.toBeNull();
  expect(result?.username).toBe('johndoe');
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with Instagram as the template
3. Run tests after each platform: `npm test -- tests/platforms/instagram`
4. Apply the same pattern to all 12 platforms
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic is updated ONLY where it's overly restrictive
- All tests pass
- No TypeScript errors
- Code follows existing style conventions

## Common Pitfalls to Avoid

1. Don't forget to handle null returns in tests
2. Ensure all metadata fields are properly migrated
3. Watch for platforms with unique extraction logic
4. Keep the same regex patterns - only change the method structure
5. Don't modify the normalizeUrl or other methods

## Questions?
If you encounter any edge cases or uncertainties, document them in a `agent-1-notes.md` file for team discussion.