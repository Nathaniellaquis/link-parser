import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Revolve;
const mod = registry.get(id)!;

describe('Revolve tests', () => {
  const samples = {
    brand: 'https://revolve.com/brands/agolde',
    product: 'https://revolve.com/cool-dress/dp/123ABC',
  };

  describe('detection', () => {
    describe('detection', () => {

      test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

        expect(mod.detect(url)).toBe(true);

      });

    });

    test('should not detect non-Revolve URLs', () => {
      expect(mod.detect('https://example.com/brands/test')).toBe(false);
      expect(mod.detect('https://amazon.com/dp/123')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract brand data', () => {
      const result = mod.extract(samples.brand);
      expect(result).not.toBeNull();
      expect(result?.username).toBe('agolde');
      expect(result?.metadata?.isBrand).toBe(true);
      expect(result?.metadata?.contentType).toBe('brand');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.isStore).toBe(true);
    });

    test('should extract product data', () => {
      const result = mod.extract(samples.product);
      expect(result).not.toBeNull();
      expect(result?.ids?.productSlug).toBe('cool-dress');
      expect(result?.ids?.productCode).toBe('123ABC');
      expect(result?.metadata?.isProduct).toBe(true);
      expect(result?.metadata?.contentType).toBe('product');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://revolve.com')).toBeNull();
      expect(mod.extract('https://revolve.com/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('brand', () => {
      const r = parse(samples.brand);
      expect(r.username).toBe('agolde');
      expect(r.metadata.isBrand).toBe(true);
    });
    test('product', () => {
      const r = parse(samples.product);
      expect(r.ids.productCode).toBe('123ABC');
      expect(r.metadata.isProduct).toBe(true);
    });
  });
});
