import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Twitter;
const mod = registry.get(id)!;

describe('Twitter platform tests', () => {
  const samples = {
    profile: 'https://twitter.com/sampleuser',
    profileX: 'https://x.com/sampleuser',
    tweet: 'https://twitter.com/sampleuser/status/1234567890123456789',
    tweetX: 'https://x.com/sampleuser/status/1234567890123456789',
    embed: 'https://platform.twitter.com/embed/Tweet.html?id=1234567890123456789',
  };

  describe('detection', () => {
    test('should detect all Twitter URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Twitter URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://twitter.com/sampleuser', () => {
      const result = parse('https://twitter.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://twitter.com/sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
    });

    test('should parse profileX: https://x.com/sampleuser', () => {
      const result = parse('https://x.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://x.com/sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://x.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse tweet: https://twitter.com/sampleuser/status/1234567890123456789', () => {
      const result = parse('https://twitter.com/sampleuser/status/1234567890123456789');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://twitter.com/sampleuser/status/1234567890123456789');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.tweetId).toBe('1234567890123456789');
      expect(result.embedData?.embedUrl).toBeTruthy();
    });

    test('should parse tweetX: https://x.com/sampleuser/status/1234567890123456789', () => {
      const result = parse('https://x.com/sampleuser/status/1234567890123456789');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://x.com/sampleuser/status/1234567890123456789');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.tweetId).toBe('1234567890123456789');
      // Negative: invalid tweet id (letters)
      const invalid = parse('https://x.com/sampleuser/status/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.tweetId).toBeUndefined();
    });

    test('should parse embed: https://platform.twitter.com/embed/Tweet.html?id=1234567890123456789', () => {
      const result = parse('https://platform.twitter.com/embed/Tweet.html?id=1234567890123456789');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe(
        'https://platform.twitter.com/embed/Tweet.html?id=1234567890123456789',
      );

      // Platform-specific assertions
      expect(result.embedData?.embedUrl).toContain('1234567890123456789');
      // Negative: invalid embed id (too short)
      const invalid = parse('https://platform.twitter.com/embed/Tweet.html?id=abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.embedData).toBeUndefined();
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
