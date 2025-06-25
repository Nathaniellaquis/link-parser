import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.KoFi;
const mod = registry.get(id)!;

describe('KoFi platform tests', () => {
  const samples = {
    profile: "https://ko-fi.com/sampleuser",
    shop: "https://ko-fi.com/sampleuser/shop",
    post: "https://ko-fi.com/post/Sample-Post-A1234ABC"
  };

  describe('detection', () => {
    test('should detect all KoFi URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-KoFi URLs', () => {
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
    test('should parse profile: https://ko-fi.com/sampleuser', () => {
      const result = parse('https://ko-fi.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://ko-fi.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://ko-fi.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse shop: https://ko-fi.com/sampleuser/shop', () => {
      const result = parse('https://ko-fi.com/sampleuser/shop');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://ko-fi.com/sampleuser/shop');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.shop).toBe('shop');
      // Negative: invalid shop (empty)
      const invalid = parse('https://ko-fi.com/sampleuser/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.shop).toBeUndefined();
    });

    test('should parse post: https://ko-fi.com/post/Sample-Post-A1234ABC', () => {
      const result = parse('https://ko-fi.com/post/Sample-Post-A1234ABC');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://ko-fi.com/post/Sample-Post-A1234ABC');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('Sample-Post-A1234ABC');
      // Negative: invalid post id (too short)
      const invalid = parse('https://ko-fi.com/post/a');
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
