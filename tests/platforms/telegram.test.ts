import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Telegram;
const mod = registry.get(id)!;

describe('Telegram platform tests', () => {
  const samples = {
    profile: 'https://t.me/sampleuser',
    channel: 'https://t.me/s/samplechannel',
    post: 'https://t.me/samplechannel/123',
    join: 'https://t.me/joinchat/ABC123DEF456',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

    test('should not detect non-Telegram URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://t.me/sampleuser', () => {
      const result = parse('https://t.me/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://t.me/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://t.me/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse channel: https://t.me/s/samplechannel', () => {
      const result = parse('https://t.me/s/samplechannel');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://t.me/s/samplechannel');
      // Platform-specific assertions
      expect(result.ids.channelName).toBe('samplechannel');
      // Negative: invalid channel name (empty)
      const invalid = parse('https://t.me/s/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.channelName).toBeUndefined();
    });

    test('should parse post: https://t.me/samplechannel/123', () => {
      const result = parse('https://t.me/samplechannel/123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://t.me/samplechannel/123');
      // Platform-specific assertions
      expect(result.ids.channelName).toBe('samplechannel');
      expect(result.ids.postId).toBe('123');
      // Negative: invalid post id (letters)
      const invalid = parse('https://t.me/samplechannel/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
    });

    test('should parse join: https://t.me/joinchat/ABC123DEF456', () => {
      const result = parse('https://t.me/joinchat/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://t.me/joinchat/ABC123DEF456');
      // Platform-specific assertions
      expect(result.ids.joinCode).toBe('ABC123DEF456');
      // Negative: invalid join code (too short)
      const invalid = parse('https://t.me/joinchat/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.joinCode).toBeUndefined();
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
