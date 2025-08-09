import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.Wish)!;

describe('Wish product links', () => {
  const samples = {
    product: 'https://www.wish.com/product/5e2f7ec4eb8ac75bf1533e4a',
  };

  describe('detection', () => {
    test('should detect Wish URLs', () => {
      expect(mod.detect(samples.product)).toBe(true);
    });

    test('should not detect non-Wish URLs', () => {
      expect(mod.detect('https://example.com/product/123')).toBe(false);
      expect(mod.detect('https://amazon.com/product/abc')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract product ID', () => {
      const result = mod.extract(samples.product);
      expect(result).not.toBeNull();
      expect(result?.ids?.productId).toBe('5e2f7ec4eb8ac75bf1533e4a');
      expect(result?.metadata?.contentType).toBe('product');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://www.wish.com/c/5e2f7ec4eb8ac75bf1533e4a')).toBeNull();
      expect(mod.extract('https://www.wish.com/product/notanid')).toBeNull();
      expect(mod.extract('https://wish.com')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('parse productId', () => {
      const r = parse(samples.product);
      expect(r.ids.productId).toBe('5e2f7ec4eb8ac75bf1533e4a');
    });
  });
});
