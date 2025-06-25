import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Email;
const mod = registry.get(id)!;

describe('Email platform tests', () => {
  const samples = {
    plain: "user@example.com",
    mailto: "mailto:user@example.com",
    mailtoSubject: "mailto:user@example.com?subject=Hello"
  };

  describe('detection', () => {
    test('should detect all Email URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Email URLs', () => {
      const nonPlatformUrls = [
        'https://example.com/test',
        'https://google.com',
        'not-a-url',
      ];

      nonPlatformUrls.forEach(url => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse plain: user@example.com', () => {
      const result = parse('user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('user@example.com');

      // Platform-specific assertions
      expect(result.username).toBe('user@example.com');
      expect(result.metadata.email).toBe('user@example.com');
    });

    test('should parse mailto: mailto:user@example.com', () => {
      const result = parse('mailto:user@example.com');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('mailto:user@example.com');

      // Platform-specific assertions
      expect(result.metadata.email).toBe('user@example.com');
    });

    test('should parse mailtoSubject: mailto:user@example.com?subject=Hello', () => {
      const result = parse('mailto:user@example.com?subject=Hello');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('mailto:user@example.com?subject=Hello');

      // Platform-specific assertions
      expect(result.metadata.email).toBe('user@example.com');
      // Negative: invalid email (bad format)
      const invalid = parse('mailto:user@.com?subject=Hello');
      expect(invalid.isValid).toBe(false);
      expect(invalid.metadata.email).toBeUndefined();
    });
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('user@example.com');
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
