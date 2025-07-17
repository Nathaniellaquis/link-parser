# Agent 5: Architecture Restructuring - Music & Audio Platforms

## Overview
You are responsible for refactoring music and audio platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. spotify
2. soundcloud
3. applemusic
4. deezer
5. pandora
6. tidal
7. bandcamp
8. mixcloud
9. audiomack
10. audius
11. beatport
12. bandlab

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.ids.trackId = match[1];
  result.metadata.contentType = 'track';
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    ids: { trackId: match[1] },
    metadata: { 
      isTrack: true,
      contentType: 'track' 
    }
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

Apply this pattern to music platforms:
```typescript
extract(url: string): ExtractedData | null {
  // Handle track URLs
  const trackMatch = this.patterns.content?.track?.exec(url);
  if (trackMatch) {
    return {
      ids: { trackId: trackMatch[1] },
      metadata: {
        isTrack: true,
        contentType: 'track'
      }
    };
  }

  // Handle album URLs
  const albumMatch = this.patterns.content?.album?.exec(url);
  if (albumMatch) {
    return {
      ids: { albumId: albumMatch[1] },
      metadata: {
        isAlbum: true,
        contentType: 'album'
      }
    };
  }

  // Handle playlist URLs
  const playlistMatch = this.patterns.content?.playlist?.exec(url);
  if (playlistMatch) {
    return {
      ids: { playlistId: playlistMatch[1] },
      metadata: {
        isPlaylist: true,
        contentType: 'playlist'
      }
    };
  }

  // Handle artist/profile URLs
  const profileMatch = this.patterns.profile.exec(url);
  if (profileMatch) {
    return {
      username: profileMatch[1],
      metadata: {
        isProfile: true,
        isArtist: true,
        contentType: 'artist'
      }
    };
  }

  return null;
}
```

## Platform-Specific Notes

### Spotify
- Tracks, albums, playlists, artists, shows, episodes
- Uses Spotify URIs (spotify:track:xxx)
- Open.spotify.com URLs

### SoundCloud
- Tracks with numeric IDs
- Sets (similar to playlists)
- User profiles with custom URLs
- Private tracks with secret tokens

### Apple Music
- Country-specific domains
- Albums, playlists, artists
- Apple Music IDs

### Bandcamp
- Artist.bandcamp.com subdomains
- Track and album pages
- Merch pages

## Testing Requirements

1. Update tests for new return format
2. Test various content types (track, album, playlist, artist)
3. Test embed URLs for platforms that support them
4. Verify all metadata flags

### Example Test Update:
```typescript
// Before
it('should extract track ID', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  spotify.extract('https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp', result);
  expect(result.ids.trackId).toBe('3n3Ppam7vgaVa1iaRUc9Lp');
});

// After
it('should extract track ID', () => {
  const result = spotify.extract('https://open.spotify.com/track/3n3Ppam7vgaVa1iaRUc9Lp');
  expect(result).not.toBeNull();
  expect(result?.ids?.trackId).toBe('3n3Ppam7vgaVa1iaRUc9Lp');
  expect(result?.metadata?.contentType).toBe('track');
  expect(result?.metadata?.isTrack).toBe(true);
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with Spotify (most content types)
3. Run tests after each platform: `npm test -- tests/platforms/spotify`
4. Handle platform-specific features
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic updated only where overly restrictive
- Handle all music content types properly
- All tests pass
- Consistent naming for similar content

## Common Patterns for Music Platforms

1. **Content hierarchy**: Artist → Album → Track
2. **Playlists vs Albums**: Different ID formats
3. **User profiles vs Artist pages**: May use same URL pattern
4. **Podcasts/Shows**: Spotify, Apple Music support these
5. **Embed players**: Special iframe URLs

## Special Considerations

- Some platforms use numeric IDs, others use alphanumeric
- Country-specific URLs (Apple Music)
- Custom subdomains (Bandcamp)
- Private/secret links (SoundCloud)
- Different URL formats for same content

## Important Notes

- Use consistent content type names (track, not song)
- Align metadata flags across platforms
- Document any unique patterns
- Note any issues in `agent-5-notes.md`