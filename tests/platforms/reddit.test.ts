import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Reddit;
const mod = registry.get(id)!;

describe('Reddit platform tests', () => {
  const samples = {
    profile: 'https://reddit.com/user/sampleuser',
    profileU: 'https://reddit.com/u/sampleuser',
    subreddit: 'https://reddit.com/r/samplesubreddit',
    post: 'https://reddit.com/r/samplesubreddit/comments/abc123/sample_post',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

    test('should not detect non-Reddit URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://reddit.com/user/sampleuser', () => {
      const result = parse('https://reddit.com/user/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://reddit.com/user/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://reddit.com/user/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse profileU: https://reddit.com/u/sampleuser', () => {
      const result = parse('https://reddit.com/u/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://reddit.com/u/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (bad chars)
      const invalid = parse('https://reddit.com/u/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse subreddit: https://reddit.com/r/samplesubreddit', () => {
      const result = parse('https://reddit.com/r/samplesubreddit');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://reddit.com/r/samplesubreddit');
      // Platform-specific assertions
      expect(result.ids.subreddit).toBe('samplesubreddit');
      // Negative: invalid subreddit (too short)
      const invalid = parse('https://reddit.com/r/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.subreddit).toBeUndefined();
    });

    test('should parse post: https://reddit.com/r/samplesubreddit/comments/abc123/sample_post', () => {
      const result = parse('https://reddit.com/r/samplesubreddit/comments/abc123/sample_post');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe(
        'https://reddit.com/r/samplesubreddit/comments/abc123/sample_post',
      );
      // Platform-specific assertions
      expect(result.ids.postId).toBe('abc123');
      // Negative: invalid post id (empty)
      const invalid = parse('https://reddit.com/r/samplesubreddit/comments//sample_post');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
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
