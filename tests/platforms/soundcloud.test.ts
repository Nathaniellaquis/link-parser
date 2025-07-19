import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.SoundCloud;
const mod = registry.get(id)!;

describe('SoundCloud platform tests', () => {
  const samples = {
    profile: 'https://soundcloud.com/sampleuser',
    track: 'https://soundcloud.com/sampleuser/sample-track',
    set: 'https://soundcloud.com/sampleuser/sets/sample-playlist',
    embed: 'https://w.soundcloud.com/player/?url=https://soundcloud.com/sampleuser/sample-track',
  };

  describe('detection', () => {
    test('should detect all SoundCloud URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-SoundCloud URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://soundcloud.com/sampleuser', () => {
      const result = parse('https://soundcloud.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://soundcloud.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://soundcloud.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse track: https://soundcloud.com/sampleuser/sample-track', () => {
      const result = parse('https://soundcloud.com/sampleuser/sample-track');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://soundcloud.com/sampleuser/sample-track');
      // Platform-specific assertions
      expect(result.ids.trackId).toBe('sample-track');
      // Negative: invalid track id (bad chars)
      const invalid = parse('https://soundcloud.com/sampleuser/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.trackId).toBeUndefined();
    });

    test('should parse set: https://soundcloud.com/sampleuser/sets/sample-playlist', () => {
      const result = parse('https://soundcloud.com/sampleuser/sets/sample-playlist');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://soundcloud.com/sampleuser/sets/sample-playlist');
      // Platform-specific assertions
      expect(result.ids.setId).toBe('sample-playlist');
      // Negative: invalid set id (empty)
      const invalid = parse('https://soundcloud.com/sampleuser/sets/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.setId).toBeUndefined();
    });

    test('should parse embed: https://w.soundcloud.com/player/?url=https://soundcloud.com/sampleuser/sample-track', () => {
      const result = parse(
        'https://w.soundcloud.com/player/?url=https://soundcloud.com/sampleuser/sample-track',
      );
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe(
        'https://w.soundcloud.com/player/?url=https://soundcloud.com/sampleuser/sample-track',
      );
      // Platform-specific assertions
      expect(result.embedData?.embedUrl).toContain('soundcloud.com/sampleuser/sample-track');
      // Negative: invalid embed url (missing url param)
      const invalid = parse('https://w.soundcloud.com/player/');
      expect(invalid.isValid).toBe(false);
      expect(result.embedData?.embedUrl).toBeDefined(); // valid case
      expect(invalid.embedData).toBeUndefined(); // invalid case
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
