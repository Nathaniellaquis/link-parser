import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.AliExpress)!;

describe('AliExpress parser', () => {
  const samples = {
    product: 'https://www.aliexpress.com/item/1005003390123456.html',
    productShort: 'https://www.aliexpress.com/i/1005003390123456',
    store: 'https://www.aliexpress.com/store/123456',
  };

  describe('detection', () => {
    test('should detect AliExpress URLs', () => {
      expect(mod.detect(samples.product)).toBe(true);
      expect(mod.detect(samples.productShort)).toBe(true);
      expect(mod.detect(samples.store)).toBe(true);
    });

    test('should detect international domains', () => {
      expect(mod.detect('https://aliexpress.us/item/123456.html')).toBe(true);
      expect(mod.detect('https://aliexpress.ru/item/123456.html')).toBe(true);
    });

    test('should not detect non-AliExpress URLs', () => {
      expect(mod.detect('https://example.com/item/123.html')).toBe(false);
      expect(mod.detect('https://amazon.com/item/123')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract product ID from full URL', () => {
      const result = mod.extract(samples.product);
      expect(result).not.toBeNull();
      expect(result?.ids?.productId).toBe('1005003390123456');
      expect(result?.metadata?.contentType).toBe('product');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should extract product ID from short URL', () => {
      const result = mod.extract(samples.productShort);
      expect(result).not.toBeNull();
      expect(result?.ids?.productId).toBe('1005003390123456');
      expect(result?.metadata?.contentType).toBe('product');
    });

    test('should extract store ID', () => {
      const result = mod.extract(samples.store);
      expect(result).not.toBeNull();
      expect(result?.ids?.storeId).toBe('123456');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.isStore).toBe(true);
      expect(result?.metadata?.contentType).toBe('store');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://aliexpress.com')).toBeNull();
      expect(mod.extract('https://aliexpress.com/item/abc.html')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('parse product id', () => {
      const r = parse(samples.product);
      expect(r.ids.productId).toBe('1005003390123456');
      expect(r.metadata.contentType).toBe('product');
    });
  });
});
