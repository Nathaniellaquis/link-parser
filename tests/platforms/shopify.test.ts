import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Shopify;
const mod = registry.get(id)!;

describe('Shopify platform tests', () => {
  const samples = {
    store: 'https://samplestore.myshopify.com',
    product: 'https://samplestore.myshopify.com/products/sample-product',
    collection: 'https://samplestore.myshopify.com/collections/all',
    page: 'https://samplestore.myshopify.com/pages/about-us',
  };

  describe('detection', () => {
    test('should detect all Shopify URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Shopify URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('extraction', () => {
    test('should extract store from homepage', () => {
      const result = mod.extract('https://samplestore.myshopify.com');
      expect(result).not.toBeNull();
      expect(result?.ids?.storeName).toBe('samplestore');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.contentType).toBe('storefront');
    });

    test('should extract product data', () => {
      const result = mod.extract('https://samplestore.myshopify.com/products/sample-product');
      expect(result).not.toBeNull();
      expect(result?.ids?.storeName).toBe('samplestore');
      expect(result?.ids?.productHandle).toBe('sample-product');
      expect(result?.metadata?.isProduct).toBe(true);
      expect(result?.metadata?.contentType).toBe('product');
    });

    test('should extract collection data', () => {
      const result = mod.extract('https://samplestore.myshopify.com/collections/all');
      expect(result).not.toBeNull();
      expect(result?.ids?.storeName).toBe('samplestore');
      expect(result?.ids?.collectionName).toBe('all');
      expect(result?.metadata?.isCollection).toBe(true);
      expect(result?.metadata?.contentType).toBe('collection');
    });

    test('should extract page data', () => {
      const result = mod.extract('https://samplestore.myshopify.com/pages/about-us');
      expect(result).not.toBeNull();
      expect(result?.ids?.storeName).toBe('samplestore');
      expect(result?.ids?.pageSlug).toBe('about-us');
      expect(result?.metadata?.isPage).toBe(true);
      expect(result?.metadata?.contentType).toBe('page');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://example.com')).toBeNull();
      expect(mod.extract('https://myshopify.com')).toBeNull();
      expect(mod.extract('https://samplestore.myshopify.com/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('should parse store: https://samplestore.myshopify.com', () => {
      const result = parse('https://samplestore.myshopify.com');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://samplestore.myshopify.com');
      // Platform-specific assertions
      expect(result.ids.storeName).toBe('samplestore');
      // Negative: invalid store name (empty)
      const invalid = parse('https://.myshopify.com');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.storeName).toBeUndefined();
    });

    test('should parse product: https://samplestore.myshopify.com/products/sample-product', () => {
      const result = parse('https://samplestore.myshopify.com/products/sample-product');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://samplestore.myshopify.com/products/sample-product');
      // Platform-specific assertions
      expect(result.ids.productHandle).toBe('sample-product');
      // Negative: invalid product handle (bad chars)
      const invalid = parse('https://samplestore.myshopify.com/products/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.productHandle).toBeUndefined();
    });

    test('should parse collection: https://samplestore.myshopify.com/collections/all', () => {
      const result = parse('https://samplestore.myshopify.com/collections/all');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://samplestore.myshopify.com/collections/all');
      // Platform-specific assertions
      expect(result.ids.collectionName).toBe('all');
      // Negative: invalid collection name (empty)
      const invalid = parse('https://samplestore.myshopify.com/collections/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.collectionName).toBeUndefined();
    });

    test('should parse page: https://samplestore.myshopify.com/pages/about-us', () => {
      const result = parse('https://samplestore.myshopify.com/pages/about-us');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://samplestore.myshopify.com/pages/about-us');
      // Platform-specific assertions
      expect(result.ids.pageSlug).toBe('about-us');
      // Negative: invalid page slug (empty)
      const invalid = parse('https://samplestore.myshopify.com/pages/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.pageSlug).toBeUndefined();
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
