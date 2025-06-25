import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Patreon;
const mod = registry.get(id)!;

describe('Patreon platform tests', () => {
  const samples = {
    profile: "https://patreon.com/sampleuser",
    profileC: "https://patreon.com/c/samplecreator",
    post: "https://patreon.com/posts/sample-post-12345678"
  };

  describe('detection', () => {
    test('should detect all Patreon URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Patreon URLs', () => {
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
    test('should parse profile: https://patreon.com/sampleuser', () => {
      const result = parse('https://patreon.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://patreon.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://patreon.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse profileC: https://patreon.com/c/samplecreator', () => {
      const result = parse('https://patreon.com/c/samplecreator');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://patreon.com/c/samplecreator');
      // Platform-specific assertions
      expect(result.username).toBe('samplecreator');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (bad chars)
      const invalid = parse('https://patreon.com/c/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://patreon.com/posts/sample-post-12345678', () => {
      const result = parse('https://patreon.com/posts/sample-post-12345678');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://patreon.com/posts/sample-post-12345678');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('sample-post-12345678');
      // Negative: invalid post id (too short)
      const invalid = parse('https://patreon.com/posts/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
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
