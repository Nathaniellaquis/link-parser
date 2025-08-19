import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Poshmark;
const mod = registry.get(id)!;

describe('Poshmark platform tests', () => {
  const samples = {
    closet: 'https://poshmark.com/closet/fashionista',
    listing: 'https://poshmark.com/listing/cute-dress-123456789',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(['https://example.com/closet/user', 'https://grailed.com/listing/123'])(
      'should not detect non-Poshmark URL: %s',
      (url) => {
        expect(mod.detect(url)).toBe(false);
      },
    );
  });

  describe('extraction', () => {
    test('should extract closet data', () => {
      const result = mod.extract(samples.closet);
      expect(result).not.toBeNull();
      expect(result?.username).toBe('fashionista');
      expect(result?.metadata?.isCloset).toBe(true);
      expect(result?.metadata?.contentType).toBe('closet');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.isStore).toBe(true);
    });

    test('should extract listing data', () => {
      const result = mod.extract(samples.listing);
      expect(result).not.toBeNull();
      expect(result?.ids?.listingSlug).toBe('cute-dress');
      expect(result?.ids?.listingId).toBe('123456789');
      expect(result?.metadata?.isListing).toBe(true);
      expect(result?.metadata?.contentType).toBe('listing');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://poshmark.com')).toBeNull();
      expect(mod.extract('https://poshmark.com/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('closet', () => {
      const r = parse(samples.closet);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('fashionista');
      expect(r.metadata.isCloset).toBe(true);
    });
    test('listing', () => {
      const r = parse(samples.listing);
      expect(r.isValid).toBe(true);
      expect(r.ids.listingId).toBe('123456789');
      expect(r.metadata.isListing).toBe(true);
    });
  });
});
