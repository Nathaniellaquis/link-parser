# Agent 2: Architecture Restructuring - Video & Streaming Platforms

## Overview
You are responsible for refactoring video and streaming platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. twitch
2. vimeo
3. dailymotion
4. rumble
5. bitchute
6. kick
7. peertube
8. triller
9. bandsintown
10. ticketmaster
11. stereo
12. imdb

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
    ids: { videoId: match[2] },
    metadata: { contentType: 'video' }
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

Use this pattern as a guide:
```typescript
extract(url: string): ExtractedData | null {
  // Try each pattern in order of specificity
  
  // Handle special content types first
  const clipMatch = this.patterns.content?.clip?.exec(url);
  if (clipMatch) {
    return {
      ids: { clipId: clipMatch[1] },
      metadata: {
        isClip: true,
        contentType: 'clip'
      }
    };
  }

  // Handle video content
  const videoMatch = this.patterns.content?.video?.exec(url);
  if (videoMatch) {
    return {
      ids: { videoId: videoMatch[1] },
      metadata: {
        isVideo: true,
        contentType: 'video'
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

### Twitch
- Has clips, videos, and live streams
- Channel names vs user IDs
- Special handling for clip URLs

### Vimeo
- Videos have numeric IDs
- Channels and showcases
- Staff picks and categories

### Dailymotion
- Videos with alphanumeric IDs
- User profiles
- Playlists

### Rumble
- Videos and channels
- Embed URLs
- Categories

## Testing Requirements

1. Update test files to check for returned objects instead of mutations
2. Test null returns for invalid URLs
3. Test domain-based detection with edge cases
4. Verify all content types are handled

### Example Test Update:
```typescript
// Before
it('should extract video ID', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  twitch.extract('https://twitch.tv/videos/123456', result);
  expect(result.ids.videoId).toBe('123456');
});

// After
it('should extract video ID', () => {
  const result = twitch.extract('https://twitch.tv/videos/123456');
  expect(result).not.toBeNull();
  expect(result?.ids?.videoId).toBe('123456');
  expect(result?.metadata?.contentType).toBe('video');
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with Twitch as it's the most complex
3. Run tests after each platform: `npm test -- tests/platforms/twitch`
4. Apply consistent patterns across all platforms
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic updated only where overly restrictive
- All tests pass
- No TypeScript errors
- Each platform has a separate commit

## Common Patterns for Video Platforms

1. **Video IDs**: Usually alphanumeric, sometimes just numeric
2. **Channel/User distinction**: Some platforms separate these
3. **Live vs VOD**: Different URL patterns
4. **Embeds**: Special iframe URLs
5. **Clips/Highlights**: Shorter content with different IDs

## Platform-Specific Notes

- Document any platform-specific quirks
- If you find issues with the approach, document in `agent-2-notes.md`
- Keep consistent naming conventions for content types