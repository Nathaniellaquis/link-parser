import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Twitch;
const mod = registry.get(id)!;

describe('Twitch platform tests', () => {
  const samples = {
    profile: 'https://twitch.tv/sampleuser',
    video: 'https://twitch.tv/videos/1234567890',
    clip: 'https://clips.twitch.tv/SampleClipName',
    collection: 'https://twitch.tv/collections/ABC123DEF456',
  };

  describe('detection', () => {
    test('should detect all Twitch URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Twitch URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://twitch.tv/sampleuser', () => {
      const result = parse('https://twitch.tv/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://twitch.tv/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://twitch.tv/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse video: https://twitch.tv/videos/1234567890', () => {
      const result = parse('https://twitch.tv/videos/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://twitch.tv/videos/1234567890');
      // Platform-specific assertions
      expect(result.ids.videoId).toBe('1234567890');
      // Negative: invalid video id (letters)
      const invalid = parse('https://twitch.tv/videos/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.videoId).toBeUndefined();
    });

    test('should parse clip: https://clips.twitch.tv/SampleClipName', () => {
      const result = parse('https://clips.twitch.tv/SampleClipName');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://clips.twitch.tv/SampleClipName');
      // Platform-specific assertions
      expect(result.ids.clipName).toBe('SampleClipName');
      // Negative: invalid clip name (empty)
      const invalid = parse('https://clips.twitch.tv/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.clipName).toBeUndefined();
    });

    test('should parse collection: https://twitch.tv/collections/ABC123DEF456', () => {
      const result = parse('https://twitch.tv/collections/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://twitch.tv/collections/ABC123DEF456');
      // Platform-specific assertions
      expect(result.ids.collectionId).toBe('ABC123DEF456');
      // Negative: invalid collection id (too short)
      const invalid = parse('https://twitch.tv/collections/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.collectionId).toBeUndefined();
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
