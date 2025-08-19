import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Threads;
const mod = registry.get(id)!;

describe('Threads platform tests', () => {
  const samples = {
    profile: 'https://threads.net/@sampleuser',
    post: 'https://threads.net/@sampleuser/post/ABC123DEF456',
    threadPost: 'https://www.threads.net/t/CudNjqlLSmA',
    // threads.com domain variations
    profileCom: 'https://www.threads.com/@brfootball',
    postCom: 'https://www.threads.com/@brfootball/post/DNgo3zCpF6K',
    threadPostCom: 'https://www.threads.com/t/DNgo3zCpF6K',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test('should not detect non-Threads URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://threads.net/@sampleuser', () => {
      const result = parse('https://threads.net/@sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://threads.net/@sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://threads.net/@a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://threads.net/@sampleuser/post/ABC123DEF456', () => {
      const result = parse('https://threads.net/@sampleuser/post/ABC123DEF456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://threads.net/@sampleuser/post/ABC123DEF456');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.postId).toBe('ABC123DEF456');
      expect(result.metadata.isPost).toBe(true);
      expect(result.metadata.contentType).toBe('post');
      // Negative: invalid post id (too short)
      const invalid = parse('https://threads.net/@sampleuser/post/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
    });

    test('should parse threadPost: https://www.threads.net/t/CudNjqlLSmA', () => {
      const result = parse('https://www.threads.net/t/CudNjqlLSmA');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.threads.net/t/CudNjqlLSmA');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('CudNjqlLSmA');
      expect(result.metadata.isPost).toBe(true);
      expect(result.metadata.contentType).toBe('post');
      expect(result.username).toBeUndefined(); // threadPost format doesn't include username
      // Negative: invalid post id (too short)
      const invalid = parse('https://threads.net/t/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
    });

    // threads.com domain tests
    test('should parse threads.com profile: https://www.threads.com/@brfootball', () => {
      const result = parse('https://www.threads.com/@brfootball');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.threads.com/@brfootball');
      expect(result.username).toBe('brfootball');
      expect(result.metadata.isProfile).toBe(true);
    });

    test('should parse threads.com post: https://www.threads.com/@brfootball/post/DNgo3zCpF6K', () => {
      const result = parse('https://www.threads.com/@brfootball/post/DNgo3zCpF6K');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.threads.com/@brfootball/post/DNgo3zCpF6K');
      expect(result.username).toBe('brfootball');
      expect(result.ids.postId).toBe('DNgo3zCpF6K');
      expect(result.metadata.isPost).toBe(true);
      expect(result.metadata.contentType).toBe('post');
    });

    test('should parse threads.com threadPost: https://www.threads.com/t/DNgo3zCpF6K', () => {
      const result = parse('https://www.threads.com/t/DNgo3zCpF6K');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.threads.com/t/DNgo3zCpF6K');
      expect(result.ids.postId).toBe('DNgo3zCpF6K');
      expect(result.metadata.isPost).toBe(true);
      expect(result.metadata.contentType).toBe('post');
      expect(result.username).toBeUndefined();
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

  describe('embed info', () => {
    if (mod.getEmbedInfo) {
      test('should return embed info for usernamePost format', () => {
        const embedInfo = mod.getEmbedInfo?.('https://threads.net/@sampleuser/post/ABC123DEF456');
        expect(embedInfo).not.toBeNull();
        expect(embedInfo?.embedUrl).toBe('https://www.threads.net/t/ABC123DEF456/embed');
        expect(embedInfo?.type).toBe('iframe');
      });

      test('should return embed info for threadPost format', () => {
        const embedInfo = mod.getEmbedInfo?.('https://www.threads.net/t/CudNjqlLSmA');
        expect(embedInfo).not.toBeNull();
        expect(embedInfo?.embedUrl).toBe('https://www.threads.net/t/CudNjqlLSmA/embed');
        expect(embedInfo?.type).toBe('iframe');
      });

      test('should return null for profile URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://threads.net/@sampleuser');
        expect(embedInfo).toBeNull();
      });

      test('should return null for invalid URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://example.com/invalid');
        expect(embedInfo).toBeNull();
      });

      // threads.com embed tests
      test('should return embed info for threads.com usernamePost format', () => {
        const embedInfo = mod.getEmbedInfo?.(
          'https://www.threads.com/@brfootball/post/DNgo3zCpF6K',
        );
        expect(embedInfo).not.toBeNull();
        expect(embedInfo?.embedUrl).toBe('https://www.threads.net/t/DNgo3zCpF6K/embed');
        expect(embedInfo?.type).toBe('iframe');
      });

      test('should return embed info for threads.com threadPost format', () => {
        const embedInfo = mod.getEmbedInfo?.('https://www.threads.com/t/DNgo3zCpF6K');
        expect(embedInfo).not.toBeNull();
        expect(embedInfo?.embedUrl).toBe('https://www.threads.net/t/DNgo3zCpF6K/embed');
        expect(embedInfo?.type).toBe('iframe');
      });

      test('should return null for threads.com profile URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://www.threads.com/@brfootball');
        expect(embedInfo).toBeNull();
      });
    }
  });
});
