import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.ShopMy;
const mod = registry.get(id)!;

describe('ShopMy platform tests', () => {
  const samples = {
    profile: "https://shopmy.us/sampleuser",
    collection: "https://shopmy.us/collections/12345",
    product: "https://shopmy.us/p/ABC123"
  };

  describe('detection', () => {
    test('should detect all ShopMy URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-ShopMy URLs', () => {
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
    test('should parse profile: https://shopmy.us/sampleuser', () => {
      const result = parse('https://shopmy.us/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://shopmy.us/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://shopmy.us/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse collection: https://shopmy.us/collections/12345', () => {
      const result = parse('https://shopmy.us/collections/12345');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://shopmy.us/collections/12345');
      // Platform-specific assertions
      expect(result.ids.collectionId).toBe('12345');
      // Negative: invalid collection id (letters)
      const invalid = parse('https://shopmy.us/collections/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.collectionId).toBeUndefined();
    });

    test('should parse product: https://shopmy.us/p/ABC123', () => {
      const result = parse('https://shopmy.us/p/ABC123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://shopmy.us/p/ABC123');
      // Platform-specific assertions
      expect(result.ids.productId).toBe('ABC123');
      // Negative: invalid product id (too short)
      const invalid = parse('https://shopmy.us/p/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.productId).toBeUndefined();
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
