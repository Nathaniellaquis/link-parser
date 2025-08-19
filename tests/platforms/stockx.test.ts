import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.StockX)!;

describe('StockX parser', () => {
  const samples = {
    product: 'https://stockx.com/nike-air-max',
    productLong: 'https://stockx.com/nike-air-max-90-white-black',
  };

  describe('detection', () => {
    test('should detect StockX URLs', () => {
      expect(mod.detect(samples.product)).toBe(true);
      expect(mod.detect(samples.productLong)).toBe(true);
    });

    test('should not detect non-StockX URLs', () => {
      expect(mod.detect('https://example.com/product')).toBe(false);
      expect(mod.detect('https://grailed.com/nike')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract product slug', () => {
      const result = mod.extract(samples.product);
      expect(result).not.toBeNull();
      expect(result?.ids?.productSlug).toBe('nike-air-max');
      expect(result?.metadata?.contentType).toBe('product');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should extract long product slug', () => {
      const result = mod.extract(samples.productLong);
      expect(result).not.toBeNull();
      expect(result?.ids?.productSlug).toBe('nike-air-max-90-white-black');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://stockx.com/')).toBeNull();
      expect(mod.extract('https://stockx.com')).toBeNull();
    });
  });
});
