# Agent 4: Architecture Restructuring - Professional & Productivity Platforms

## Overview
You are responsible for refactoring professional and productivity platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. github
2. gitlab
3. bitbucket
4. stackoverflow
5. medium
6. devto
7. substack
8. patreon
9. kofi
10. buymeacoffee
11. gofundme
12. calendly

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.username = match[1];
  result.ids.repoId = match[2];
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    username: match[1],
    ids: { repoId: match[2] },
    metadata: { contentType: 'repository' }
  };
}
```

### 2. Detection Logic Update (ONLY if needed)
**First check**: Is the current `detect()` method checking for specific patterns?
- If YES → Update to domain-only detection
- If NO (already domain-only) → Keep the existing implementation

**Update to domain-only detection (if needed):**
```typescript
detect(url: string): boolean {
  const urlLower = url.toLowerCase();
  return this.domains.some(domain => urlLower.includes(domain));
}
```

### 3. Use Centralized ExtractedData Type
The `ExtractedData` type is already defined in `src/utils/parse/core/types.ts`. Use the centralized type definition.

## Reference Pattern

Apply this pattern to professional platforms:
```typescript
extract(url: string): ExtractedData | null {
  // Handle repository URLs
  const repoMatch = this.patterns.content?.repository?.exec(url);
  if (repoMatch) {
    return {
      username: repoMatch[1],
      ids: { repoId: repoMatch[2] },
      metadata: {
        isRepository: true,
        contentType: 'repository'
      }
    };
  }

  // Handle issue/PR URLs
  const issueMatch = this.patterns.content?.issue?.exec(url);
  if (issueMatch) {
    return {
      username: issueMatch[1],
      ids: { 
        repoId: issueMatch[2],
        issueId: issueMatch[3]
      },
      metadata: {
        isIssue: true,
        contentType: 'issue'
      }
    };
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

## Platform-Specific Notes

### GitHub/GitLab/Bitbucket
- User profiles
- Repositories (user/repo format)
- Issues and Pull Requests
- Gists/Snippets
- Organizations

### StackOverflow
- User profiles with numeric IDs
- Questions with IDs
- Tags
- User reputation pages

### Medium/DevTo/Substack
- Author profiles
- Article slugs or IDs
- Publications (Medium)
- Series/Tags

### Patreon/Ko-fi/BuyMeACoffee
- Creator profiles
- Campaign pages
- Membership tiers
- Posts/Updates

## Testing Requirements

1. Update tests for new return format
2. Test multi-level paths (user/repo/issue)
3. Test different content types per platform
4. Verify metadata flags are set correctly

### Example Test Update:
```typescript
// Before
it('should extract repository info', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  github.extract('https://github.com/facebook/react', result);
  expect(result.username).toBe('facebook');
  expect(result.ids.repoId).toBe('react');
});

// After
it('should extract repository info', () => {
  const result = github.extract('https://github.com/facebook/react');
  expect(result).not.toBeNull();
  expect(result?.username).toBe('facebook');
  expect(result?.ids?.repoId).toBe('react');
  expect(result?.metadata?.contentType).toBe('repository');
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with GitHub (most complex URL patterns)
3. Run tests after each platform: `npm test -- tests/platforms/github`
4. Ensure consistency across similar platforms
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic updated only where overly restrictive
- Handle nested URL structures properly
- All tests pass
- No TypeScript errors

## Common Patterns for Professional Platforms

1. **Nested paths**: user/project/resource/id
2. **Numeric vs slug IDs**: Questions use numbers, articles use slugs
3. **Organizations vs Users**: Different URL patterns
4. **API endpoints**: Should detect but may not extract
5. **Documentation URLs**: Detect domain but no extraction

## Special Considerations

- GitHub has many subdomains (gist.github.com, raw.githubusercontent.com)
- Medium uses custom domains for publications
- StackOverflow has multiple Stack Exchange sites
- Substack uses custom subdomains for creators

## Important Notes

- Use similar patterns for similar content types
- Document complex extraction logic
- Note any issues in `agent-4-notes.md`