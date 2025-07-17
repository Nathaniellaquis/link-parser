# Agent 7: Architecture Restructuring - Creative & Portfolio Platforms

## Overview
You are responsible for refactoring creative and portfolio platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. dribbble
2. behance
3. artstation
4. flickr
5. vsco
6. dispo
7. bereal
8. quora
9. looksrare
10. etherscan
11. matterport
12. mediakits

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.username = match[1];
  result.ids.shotId = match[2];
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    username: match[1],
    ids: { shotId: match[2] },
    metadata: { contentType: 'shot' }
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

Apply this pattern to creative platforms:
```typescript
extract(url: string): ExtractedData | null {
  // Handle project/shot URLs
  const projectMatch = this.patterns.content?.project?.exec(url);
  if (projectMatch) {
    return {
      username: projectMatch[1],
      ids: { projectId: projectMatch[2] },
      metadata: {
        isProject: true,
        contentType: 'project'
      }
    };
  }

  // Handle gallery URLs
  const galleryMatch = this.patterns.content?.gallery?.exec(url);
  if (galleryMatch) {
    return {
      ids: { galleryId: galleryMatch[1] },
      metadata: {
        isGallery: true,
        contentType: 'gallery'
      }
    };
  }

  // Handle photo URLs
  const photoMatch = this.patterns.content?.photo?.exec(url);
  if (photoMatch) {
    return {
      ids: { photoId: photoMatch[1] },
      metadata: {
        isPhoto: true,
        contentType: 'photo'
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

### Dribbble
- Shots (individual designs)
- User profiles
- Collections
- Teams

### Behance
- Projects (can contain multiple images)
- User profiles
- Galleries/Collections
- WIP (Work in Progress)

### ArtStation
- Projects/Artworks
- User profiles
- Marketplace items
- Learning courses

### Flickr
- Photos with numeric IDs
- Albums/Galleries
- Groups
- User photostreams

### Blockchain Platforms (LooksRare, Etherscan)
- Contract addresses
- Transaction hashes
- Token IDs
- Wallet addresses

### Quora
- Questions with slugs
- Answer permalinks
- User profiles
- Spaces (topics)

## Testing Requirements

1. Update tests for new return format
2. Test various content types per platform
3. Handle nested URLs (user/project/item)
4. Test blockchain address formats

### Example Test Update:
```typescript
// Before
it('should extract shot ID', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  dribbble.extract('https://dribbble.com/shots/123456', result);
  expect(result.ids.shotId).toBe('123456');
});

// After
it('should extract shot ID', () => {
  const result = dribbble.extract('https://dribbble.com/shots/123456');
  expect(result).not.toBeNull();
  expect(result?.ids?.shotId).toBe('123456');
  expect(result?.metadata?.contentType).toBe('shot');
  expect(result?.metadata?.isProject).toBe(true);
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with Dribbble or Behance (clear patterns)
3. Run tests after each platform: `npm test -- tests/platforms/dribbble`
4. Handle blockchain platforms carefully
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic updated only where overly restrictive
- Handle creative content types properly
- All tests pass
- Consistent metadata structure

## Common Patterns for Creative Platforms

1. **Projects vs Individual Items**: Projects contain multiple works
2. **User galleries**: Collections of work
3. **Numeric vs Slug IDs**: Varies by platform
4. **Nested ownership**: user/collection/item
5. **Blockchain addresses**: Hex format validation

## Special Considerations

- Some platforms use very long URLs with titles
- Blockchain platforms need special handling
- Photo IDs can be very long
- Some platforms have multiple content types
- VSCO and Dispo are mobile-first

## Important Notes

- Use consistent naming for similar content
- Align project/gallery/collection terminology
- Document blockchain-specific patterns
- Note any issues in `agent-7-notes.md`