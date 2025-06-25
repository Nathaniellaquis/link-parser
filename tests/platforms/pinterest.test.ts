import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Pinterest;
const mod = registry.get(id)!;

describe('Pinterest platform tests', () => {
  const samples = {
    profile: "https://pinterest.com/sampleuser",
    pin: "https://pinterest.com/pin/1234567890",
    board: "https://pinterest.com/sampleuser/sample-board"
  };

  describe('detection', () => {
    test('should detect all Pinterest URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Pinterest URLs', () => {
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
    test('should parse profile: https://pinterest.com/sampleuser', () => {
      const result = parse('https://pinterest.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://pinterest.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://pinterest.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse pin: https://pinterest.com/pin/1234567890', () => {
      const result = parse('https://pinterest.com/pin/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://pinterest.com/pin/1234567890');
      // Platform-specific assertions
      expect(result.ids.pinId).toBe('1234567890');
      // Negative: invalid pin id (letters)
      const invalid = parse('https://pinterest.com/pin/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.pinId).toBeUndefined();
    });

    test('should parse board: https://pinterest.com/sampleuser/sample-board', () => {
      const result = parse('https://pinterest.com/sampleuser/sample-board');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://pinterest.com/sampleuser/sample-board');
      // Platform-specific assertions
      expect(result.ids.boardName).toBe('sample-board');
      // Negative: invalid board name (empty)
      const invalid = parse('https://pinterest.com/sampleuser/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.boardName).toBeUndefined();
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
