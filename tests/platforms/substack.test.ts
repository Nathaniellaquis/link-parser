import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Substack;
const mod = registry.get(id)!;

describe('Substack platform tests', () => {
  const samples = {
    profile: "https://sampleuser.substack.com",
    post: "https://sampleuser.substack.com/p/sample-post",
    profileNew: "https://substack.com/@sampleuser"
  };

  describe('detection', () => {
    test('should detect all Substack URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Substack URLs', () => {
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
    test('should parse profile: https://sampleuser.substack.com', () => {
      const result = parse('https://sampleuser.substack.com');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://sampleuser.substack.com');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://a.substack.com');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://sampleuser.substack.com/p/sample-post', () => {
      const result = parse('https://sampleuser.substack.com/p/sample-post');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://sampleuser.substack.com/p/sample-post');
      // Platform-specific assertions
      expect(result.ids.postSlug).toBe('sample-post');
      // Negative: invalid post slug (empty)
      const invalid = parse('https://sampleuser.substack.com/p/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postSlug).toBeUndefined();
    });

    test('should parse profileNew: https://substack.com/@sampleuser', () => {
      const result = parse('https://substack.com/@sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://substack.com/@sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid handle (bad chars)
      const invalid = parse('https://substack.com/@!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
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
