import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Threads;
const mod = registry.get(id)!;

describe('Threads platform tests', () => {
  const samples = {
    profile: 'https://threads.net/@sampleuser',
    post: 'https://threads.net/@sampleuser/post/ABC123DEF456',
  };

  describe('detection', () => {
    test('should detect all Threads URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Threads URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://threads.net/@sampleuser', () => {
      const result = parse('https://threads.net/@sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://threads.net/@sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://threads.net/@a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://threads.net/@sampleuser/post/ABC123DEF456', () => {
      const result = parse('https://threads.net/@sampleuser/post/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://threads.net/@sampleuser/post/ABC123DEF456');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('ABC123DEF456');
      // Negative: invalid post id (too short)
      const invalid = parse('https://threads.net/@sampleuser/post/a');
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
