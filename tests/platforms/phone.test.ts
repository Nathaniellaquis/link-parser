import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Phone;
const mod = registry.get(id)!;

describe('Phone platform tests', () => {
  const samples = {
    us: '+1-555-123-4567',
    usNoDash: '+15551234567',
    tel: 'tel:+15551234567',
    international: '+44 20 7946 0958',
  };

  describe('detection', () => {
    test('should detect all Phone URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Phone URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse us: +1-555-123-4567', () => {
      const result = parse('+1-555-123-4567');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('+1-555-123-4567');

      // Platform-specific assertions
      expect(result.metadata.phoneNumber).toBeTruthy();
      expect(result.metadata.phoneCountry).toBe('US');
    });

    test('should parse usNoDash: +15551234567', () => {
      const result = parse('+15551234567');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('+15551234567');

      // Platform-specific assertions
      expect(result.metadata.phoneNumber).toBeTruthy();
      expect(result.metadata.phoneCountry).toBe('US');
      // Negative: invalid phone (too short)
      const invalid = parse('+12');
      expect(invalid.isValid).toBe(false);
      expect(invalid.metadata.phoneNumber).toBeUndefined();
    });

    test('should parse tel: tel:+15551234567', () => {
      const result = parse('tel:+15551234567');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('tel:+15551234567');

      // Platform-specific assertions
      expect(result.metadata.phoneNumber).toBeTruthy();
      expect(result.metadata.phoneCountry).toBe('US');
      // Negative: invalid tel (letters)
      const invalid = parse('tel:abcdefg');
      expect(invalid.isValid).toBe(false);
      expect(invalid.metadata.phoneNumber).toBeUndefined();
    });

    test('should parse international: +44 20 7946 0958', () => {
      const result = parse('+44 20 7946 0958');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('+44 20 7946 0958');

      // Platform-specific assertions
      expect(result.metadata.phoneNumber).toBeTruthy();
      expect(result.metadata.phoneCountry).toBe('GB');
    });
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('+15551234567');
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
