import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Snapchat;
const mod = registry.get(id)!;

describe('Snapchat platform tests', () => {
  const samples = {
    profile: 'https://snapchat.com/add/sampleuser',
    story: 'https://story.snapchat.com/s/sampleuser',
    spotlight: 'https://www.snapchat.com/spotlight/ABC123DEF456',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

    test('should not detect non-Snapchat URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://snapchat.com/add/sampleuser', () => {
      const result = parse('https://snapchat.com/add/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://snapchat.com/add/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://snapchat.com/add/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse story: https://story.snapchat.com/s/sampleuser', () => {
      const result = parse('https://story.snapchat.com/s/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://story.snapchat.com/s/sampleuser');
      // Platform-specific assertions
      expect(result.ids.storyId).toBe('sampleuser');
      // Negative: invalid story id (empty)
      const invalid = parse('https://story.snapchat.com/s/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.storyId).toBeUndefined();
    });

    test('should parse spotlight: https://www.snapchat.com/spotlight/ABC123DEF456', () => {
      const result = parse('https://www.snapchat.com/spotlight/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.snapchat.com/spotlight/ABC123DEF456');
      // Platform-specific assertions
      expect(result.ids.spotlightId).toBe('ABC123DEF456');
      // Negative: invalid spotlight id (too short)
      const invalid = parse('https://www.snapchat.com/spotlight/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.spotlightId).toBeUndefined();
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
