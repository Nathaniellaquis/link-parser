import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.EBay;
const mod = registry.get(id)!;

describe('eBay platform tests', () => {
  const samples = {
    item: 'https://www.ebay.com/itm/123456789012',
    itemWithTitle: 'https://www.ebay.com/itm/vintage-camera/123456789012',
  };

  describe('detection', () => {
    test('should detect eBay URLs', () => {
      expect(mod.detect(samples.item)).toBe(true);
      expect(mod.detect(samples.itemWithTitle)).toBe(true);
    });

    test('should detect international eBay URLs', () => {
      expect(mod.detect('https://www.ebay.co.uk/itm/123456789012')).toBe(true);
      expect(mod.detect('https://www.ebay.de/itm/123456789012')).toBe(true);
    });

    test('should not detect non-eBay URLs', () => {
      expect(mod.detect('https://example.com')).toBe(false);
      expect(mod.detect('https://amazon.com/itm/123')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract item ID', () => {
      const result = mod.extract(samples.item);
      expect(result).not.toBeNull();
      expect(result?.ids?.itemId).toBe('123456789012');
      expect(result?.metadata?.contentType).toBe('item');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should extract item ID with title', () => {
      const result = mod.extract(samples.itemWithTitle);
      expect(result).not.toBeNull();
      expect(result?.ids?.itemId).toBe('123456789012');
      expect(result?.metadata?.contentType).toBe('item');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://ebay.com')).toBeNull();
      expect(mod.extract('https://ebay.com/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('parse item', () => {
      const r = parse(samples.item);
      expect(r.ids.itemId).toBe('123456789012');
    });
  });
});
