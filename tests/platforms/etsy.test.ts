import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Etsy;
const mod = registry.get(id)!;

describe('Etsy platform tests', () => {
  const samples = {
    shop: 'https://www.etsy.com/shop/CoolCrafts',
    listing: 'https://www.etsy.com/listing/123456789/handmade-ring',
  };

  describe('detection', () => {
    test('should detect Etsy URLs', () => {
      expect(mod.detect(samples.shop)).toBe(true);
      expect(mod.detect(samples.listing)).toBe(true);
    });

    test('should not detect non-Etsy URLs', () => {
      expect(mod.detect('https://example.com')).toBe(false);
      expect(mod.detect('https://amazon.com/shop/test')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract shop data', () => {
      const result = mod.extract(samples.shop);
      expect(result).not.toBeNull();
      expect(result?.username).toBe('CoolCrafts');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.contentType).toBe('shop');
      expect(result?.metadata?.isStore).toBe(true);
    });

    test('should extract listing data', () => {
      const result = mod.extract(samples.listing);
      expect(result).not.toBeNull();
      expect(result?.ids?.listingId).toBe('123456789');
      expect(result?.metadata?.contentType).toBe('listing');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://etsy.com')).toBeNull();
      expect(mod.extract('https://etsy.com/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('parse shop', () => {
      const r = parse(samples.shop);
      expect(r.username).toBe('CoolCrafts');
      expect(r.metadata.isProfile).toBe(true);
    });

    test('parse listing', () => {
      const r = parse(samples.listing);
      expect(r.ids.listingId).toBe('123456789');
      expect(r.metadata.contentType).toBe('listing');
    });
  });
});
