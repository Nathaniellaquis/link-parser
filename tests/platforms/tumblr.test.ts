import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Tumblr;
const mod = registry.get(id)!;

describe('Tumblr platform tests', () => {
  const samples = {
    profile: "https://sampleuser.tumblr.com",
    profileBlog: "https://tumblr.com/sampleuser",
    post: "https://sampleuser.tumblr.com/post/1234567890/sample-post"
  };

  describe('detection', () => {
    test('should detect all Tumblr URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Tumblr URLs', () => {
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
    test('should parse profile: https://sampleuser.tumblr.com', () => {
      const result = parse('https://sampleuser.tumblr.com');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://sampleuser.tumblr.com');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://a.tumblr.com');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse profileBlog: https://tumblr.com/sampleuser', () => {
      const result = parse('https://tumblr.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://tumblr.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid blog name (bad chars)
      const invalid = parse('https://tumblr.com/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://sampleuser.tumblr.com/post/1234567890/sample-post', () => {
      const result = parse('https://sampleuser.tumblr.com/post/1234567890/sample-post');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://sampleuser.tumblr.com/post/1234567890/sample-post');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('1234567890');
      // Negative: invalid post id (letters)
      const invalid = parse('https://sampleuser.tumblr.com/post/abc/sample-post');
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
