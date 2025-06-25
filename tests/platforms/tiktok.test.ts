import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.TikTok;
const mod = registry.get(id)!;

describe('TikTok platform tests', () => {
  const samples = {
    profileHandle: "https://tiktok.com/@sampleuser",
    video: "https://tiktok.com/@sampleuser/video/1234567890123456789",
    live: "https://tiktok.com/@sampleuser/live",
    embed: "https://tiktok.com/embed/v2/1234567890123456789"
  };

  describe('detection', () => {
    test('should detect all TikTok URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-TikTok URLs', () => {
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
    test('should parse profileHandle: https://tiktok.com/@sampleuser', () => {
      const result = parse('https://tiktok.com/@sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://tiktok.com/@sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
    });

    test('should parse video: https://tiktok.com/@sampleuser/video/1234567890123456789', () => {
      const result = parse('https://tiktok.com/@sampleuser/video/1234567890123456789');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://tiktok.com/@sampleuser/video/1234567890123456789');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.videoId).toBe('1234567890123456789');
      expect(result.embedData?.embedUrl).toBeTruthy();
    });

    test('should parse live: https://tiktok.com/@sampleuser/live', () => {
      const result = parse('https://tiktok.com/@sampleuser/live');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://tiktok.com/@sampleuser/live');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isLive).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://tiktok.com/@a/live');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse embed: https://tiktok.com/embed/v2/1234567890123456789', () => {
      const result = parse('https://tiktok.com/embed/v2/1234567890123456789');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://tiktok.com/embed/v2/1234567890123456789');
      // Platform-specific assertions
      expect(result.embedData?.embedUrl).toContain('1234567890123456789');
      // Negative: invalid embed id (too short)
      const invalid = parse('https://tiktok.com/embed/v2/abc');
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
