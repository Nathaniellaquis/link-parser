import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Amazon;
const mod = registry.get(id)!;

describe('Amazon platform tests', () => {
  const samples = {
    product: "https://amazon.com/dp/B08N5WRWNW",
    productFull: "https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW",
    store: "https://amazon.com/stores/page/ABC123DEF",
    review: "https://amazon.com/review/R1234567890ABC"
  };

  describe('detection', () => {
    test('should detect all Amazon URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Amazon URLs', () => {
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
    test('should parse product: https://amazon.com/dp/B08N5WRWNW', () => {
      const result = parse('https://amazon.com/dp/B08N5WRWNW');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://amazon.com/dp/B08N5WRWNW');

      // Platform-specific assertions
      expect(result.ids.productId).toBe('B08N5WRWNW');
      expect(result.metadata.contentType).toBe('product');
      // Negative: invalid product id (too short)
      const invalid = parse('https://amazon.com/dp/123');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.productId).toBeUndefined();
    });

    test('should parse productFull: https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW', () => {
      const result = parse('https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW');

      // Platform-specific assertions
      expect(result.ids.productId).toBe('B08N5WRWNW');
      // Negative: invalid product id (bad chars)
      const invalid = parse('https://www.amazon.com/Echo-Dot-3rd-Gen/dp/!@#$%^&*');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.productId).toBeUndefined();
    });

    test('should parse store: https://amazon.com/stores/page/ABC123DEF', () => {
      const result = parse('https://amazon.com/stores/page/ABC123DEF');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://amazon.com/stores/page/ABC123DEF');

      // Platform-specific assertions
      expect(result.ids.storeId).toBe('ABC123DEF');
      // Negative: invalid store id (too short)
      const invalid = parse('https://amazon.com/stores/page/1');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.storeId).toBeUndefined();
    });

    test('should parse review: https://amazon.com/review/R1234567890ABC', () => {
      const result = parse('https://amazon.com/review/R1234567890ABC');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://amazon.com/review/R1234567890ABC');

      // Platform-specific assertions
      expect(result.ids.reviewId).toBe('R1234567890ABC');
      // Negative: invalid review id (missing R)
      const invalid = parse('https://amazon.com/review/1234567890ABC');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.reviewId).toBeUndefined();
    });
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('testuser');
        expect(profileUrl).toBeTruthy();
        expect(mod.detect(profileUrl)).toBe(true);
        // Negative: invalid username (empty)
        const invalidProfileUrl = mod.buildProfileUrl('');
        expect(typeof invalidProfileUrl).toBe('string');
        expect(mod.detect(invalidProfileUrl)).toBe(false);
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
