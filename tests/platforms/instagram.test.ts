import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Instagram;
const mod = registry.get(id)!;

describe('Instagram platform tests', () => {
  const samples = {
    profileHandle: 'https://instagram.com/sampleuser',
    profileFull: 'https://www.instagram.com/sampleuser/',
    post: 'https://instagram.com/p/ABC123DEF456',
    reel: 'https://instagram.com/reel/ABC123DEF456',
    story: 'https://instagram.com/stories/sampleuser/1234567890',
    tv: 'https://instagram.com/tv/ABC123DEF456',
    embed: 'https://instagram.com/p/ABC123DEF456/embed',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(['https://example.com/test', 'https://google.com', 'not-a-url'])(
      'should not detect non-Instagram URL: %s',
      (url) => {
        expect(mod.detect(url)).toBe(false);
      },
    );
  });

  describe('parsing', () => {
    test('should parse profileHandle: https://instagram.com/sampleuser', () => {
      const result = parse('https://instagram.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://instagram.com/sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
    });

    test('should parse profileFull: https://www.instagram.com/sampleuser/', () => {
      const result = parse('https://www.instagram.com/sampleuser/');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.instagram.com/sampleuser/');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      expect(result.metadata.contentType).toBe('profile');
      // Negative: invalid username (bad chars)
      const invalid = parse('https://www.instagram.com/!@#$/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://instagram.com/p/ABC123DEF456', () => {
      const result = parse('https://instagram.com/p/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://instagram.com/p/ABC123DEF456');

      // Platform-specific assertions
      expect(result.ids.postId).toBe('ABC123DEF456');
      expect(result.embedData?.embedUrl).toBeTruthy();
    });

    test('should parse reel: https://instagram.com/reel/ABC123DEF456', () => {
      const result = parse('https://instagram.com/reel/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://instagram.com/reel/ABC123DEF456');

      // Platform-specific assertions
      expect(result.ids.reelId).toBe('ABC123DEF456');
    });

    test('should parse story: https://instagram.com/stories/sampleuser/1234567890', () => {
      const result = parse('https://instagram.com/stories/sampleuser/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://instagram.com/stories/sampleuser/1234567890');

      // Platform-specific assertions
      expect(result.ids.storyId).toBe('sampleuser');
    });

    test('should parse tv: https://instagram.com/tv/ABC123DEF456', () => {
      const result = parse('https://instagram.com/tv/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://instagram.com/tv/ABC123DEF456');

      // Platform-specific assertions
      expect(result.ids.tvId).toBe('ABC123DEF456');
      expect(result.metadata.isTv).toBe(true);
      expect(result.metadata.contentType).toBe('tv');
    });

    test('should parse embed: https://instagram.com/p/ABC123DEF456/embed', () => {
      const result = parse('https://instagram.com/p/ABC123DEF456/embed');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://instagram.com/p/ABC123DEF456/embed');

      // Platform-specific assertions
      expect(result.embedData?.embedUrl).toContain('ABC123DEF456/embed');
      if (result.embedData?.embedUrl === 'https://instagram.com/p/ABC123DEF456/embed') {
        expect(result.metadata.isEmbed).toBe(true);
      }
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
      test.each(Object.entries(samples))('should normalize %s URL', (_, url) => {
        const normalized = mod.normalizeUrl!(url);
        expect(normalized).toBeTruthy();
        expect(typeof normalized).toBe('string');
      });
    }
  });

  describe('live', () => {
    const liveUrl = 'https://instagram.com/sampleuser/live';
    test('detect', () => {
      expect(mod.detect(liveUrl)).toBe(true);
    });
    test('parse', () => {
      const r = parse(liveUrl);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('sampleuser');
      expect(r.metadata.isLive).toBe(true);
      expect(r.metadata.contentType).toBe('live');
    });
  });
});
