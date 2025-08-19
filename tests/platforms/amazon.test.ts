import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Amazon;
const mod = registry.get(id)!;

describe('Amazon platform tests', () => {
  const samples = {
    product: 'https://amazon.com/dp/B08N5WRWNW',
    productFull: 'https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW',
    store: 'https://amazon.com/stores/page/ABC123DEF',
    review: 'https://amazon.com/review/R1234567890ABC',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(['https://example.com/test', 'https://google.com', 'not-a-url'])(
      'should not detect non-Amazon URL: %s',
      (url) => {
        expect(mod.detect(url)).toBe(false);
      },
    );
  });

  describe('extraction', () => {
    test('should extract product ID from short URL', () => {
      const result = mod.extract('https://amazon.com/dp/B08N5WRWNW');
      expect(result).not.toBeNull();
      expect(result?.ids?.productId).toBe('B08N5WRWNW');
      expect(result?.metadata?.contentType).toBe('product');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should extract product ID from full URL', () => {
      const result = mod.extract('https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW');
      expect(result).not.toBeNull();
      expect(result?.ids?.productId).toBe('B08N5WRWNW');
      expect(result?.metadata?.contentType).toBe('product');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should extract store ID', () => {
      const result = mod.extract('https://amazon.com/stores/page/ABC123DEF');
      expect(result).not.toBeNull();
      expect(result?.ids?.storeId).toBe('ABC123DEF');
      expect(result?.metadata?.contentType).toBe('store');
      expect(result?.metadata?.isStore).toBe(true);
    });

    test('should extract review ID', () => {
      const result = mod.extract('https://amazon.com/review/R1234567890ABC');
      expect(result).not.toBeNull();
      expect(result?.ids?.reviewId).toBe('R1234567890ABC');
      expect(result?.metadata?.contentType).toBe('review');
      expect(result?.metadata?.isReview).toBe(true);
    });

    test('should extract shop profile', () => {
      const result = mod.extract('https://amazon.com/shop/teststore');
      expect(result).not.toBeNull();
      expect(result?.username).toBe('teststore');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.contentType).toBe('storefront');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://amazon.com/')).toBeNull();
      expect(mod.extract('https://amazon.com/dp/123')).toBeNull(); // Too short
      expect(mod.extract('https://amazon.com/stores/page/1')).toBeNull(); // Too short
    });

    test('should work with international domains', () => {
      const ukResult = mod.extract('https://amazon.co.uk/dp/B08N5WRWNW');
      expect(ukResult).not.toBeNull();
      expect(ukResult?.ids?.productId).toBe('B08N5WRWNW');

      const deResult = mod.extract('https://amazon.de/dp/B08N5WRWNW');
      expect(deResult).not.toBeNull();
      expect(deResult?.ids?.productId).toBe('B08N5WRWNW');
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

    test('should parse product with query: https://www.amazon.com/Example-Product/dp/B08N5WRWNW?ref_=abc123#details', () => {
      const withQuery = parse(
        'https://www.amazon.com/Example-Product/dp/B08N5WRWNW?ref_=abc123#details',
      );
      expect(withQuery.isValid).toBe(true);
      expect(withQuery.ids.productId).toBe('B08N5WRWNW');
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
      test.each(Object.entries(samples))('should normalize %s URL', (_, url) => {
        const normalized = mod.normalizeUrl!(url);
        expect(normalized).toBeTruthy();
        expect(typeof normalized).toBe('string');
      });
    }
  });
});
