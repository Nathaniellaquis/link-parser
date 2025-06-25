import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Spotify;
const mod = registry.get(id)!;

describe('Spotify platform tests', () => {
  const samples = {
    artist: "https://open.spotify.com/artist/1234567890abcdefghij",
    track: "https://open.spotify.com/track/1234567890abcdefghij",
    album: "https://open.spotify.com/album/1234567890abcdefghij",
    playlist: "https://open.spotify.com/playlist/1234567890abcdefghij",
    user: "https://open.spotify.com/user/sampleuser",
    embed: "https://open.spotify.com/embed/track/1234567890abcdefghij"
  };

  describe('detection', () => {
    test('should detect all Spotify URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Spotify URLs', () => {
      const nonPlatformUrls = [
        'https://example.com/test',
        'https://google.com',
        'not-a-url',
      ];

      nonPlatformUrls.forEach(url => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse artist: https://open.spotify.com/artist/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/artist/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/artist/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.artistId).toBe('1234567890abcdefghij');
      // Negative: invalid artist id (too short)
      const invalid = parse('https://open.spotify.com/artist/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.artistId).toBeUndefined();
    });

    test('should parse track: https://open.spotify.com/track/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/track/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/track/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.trackId).toBe('1234567890abcdefghij');
      // Negative: invalid track id (bad chars)
      const invalid = parse('https://open.spotify.com/track/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.trackId).toBeUndefined();
    });

    test('should parse album: https://open.spotify.com/album/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/album/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/album/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.albumId).toBe('1234567890abcdefghij');
      // Negative: invalid album id (too short)
      const invalid = parse('https://open.spotify.com/album/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.albumId).toBeUndefined();
    });

    test('should parse playlist: https://open.spotify.com/playlist/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/playlist/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/playlist/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.playlistId).toBe('1234567890abcdefghij');
      // Negative: invalid playlist id (bad chars)
      const invalid = parse('https://open.spotify.com/playlist/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.playlistId).toBeUndefined();
    });

    test('should parse user: https://open.spotify.com/user/sampleuser', () => {
      const result = parse('https://open.spotify.com/user/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/user/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://open.spotify.com/user/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse embed: https://open.spotify.com/embed/track/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/embed/track/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/embed/track/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.embedData?.embedUrl).toContain('1234567890abcdefghij');
      // Negative: invalid embed id (too short)
      const invalid = parse('https://open.spotify.com/embed/track/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.embedData).toBeUndefined();
    });
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('testuser');
        expect(profileUrl).toBeTruthy();
        expect(mod.detect(profileUrl)).toBe(true);
      });
    }
  });

  describe('URL normalization', () => {
    if (mod.normalizeUrl) {
      Object.entries(samples).forEach(([key, url]) => {
        test(`should normalize ${key} URL`, () => {
          const normalized = mod.normalizeUrl!(url);
          expect(normalized).toBeTruthy();
          expect(typeof normalized).toBe('string');
        });
      });
    }
  });
});
