import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Vimeo;
const mod = registry.get(id)!;

describe('Vimeo platform tests', () => {
  const samples = {
    profileUser: 'https://vimeo.com/user12345678',
    profileName: 'https://vimeo.com/sampleuser',
    video: 'https://vimeo.com/123456789',
    channel: 'https://vimeo.com/channels/staffpicks',
    showcase: 'https://vimeo.com/showcase/11838367?share=copy',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test('should not detect non-Vimeo URLs', () => {
      const nonPlatformUrls = [
        'https://example.com/test',
        'https://youtube.com/watch?v=123',
        'not-a-url',
      ];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse video: https://vimeo.com/123456789', () => {
      const result = parse(samples.video);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://vimeo.com/123456789');
      expect(result.ids.videoId).toBe('123456789');
      expect(result.metadata.isVideo).toBe(true);
      expect(result.metadata.contentType).toBe('video');
    });

    test('should parse channel: https://vimeo.com/channels/staffpicks', () => {
      const result = parse(samples.channel);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://vimeo.com/channels/staffpicks');
      expect(result.username).toBe('staffpicks');
      expect(result.metadata.isChannel).toBe(true);
      expect(result.metadata.contentType).toBe('channel');
    });

    test('should parse showcase: https://vimeo.com/showcase/11838367', () => {
      const result = parse(samples.showcase);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://vimeo.com/showcase/11838367?share=copy');
      expect(result.ids.showcaseId).toBe('11838367');
      expect(result.metadata.isShowcase).toBe(true);
      expect(result.metadata.contentType).toBe('showcase');
    });

    test('should parse profile user: https://vimeo.com/user12345678', () => {
      const result = parse(samples.profileUser);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://vimeo.com/user12345678');
      expect(result.username).toBe('user12345678');
      expect(result.metadata.isProfile).toBe(true);
      expect(result.metadata.contentType).toBe('profile');
    });

    test('should parse profile name: https://vimeo.com/sampleuser', () => {
      const result = parse(samples.profileName);
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://vimeo.com/sampleuser');
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      expect(result.metadata.contentType).toBe('profile');
    });
  });

  describe('profile URL building', () => {
    test('should build valid profile URLs', () => {
      const profileUrl = mod.buildProfileUrl('myname');
      expect(profileUrl).toBe('https://vimeo.com/myname');
      expect(mod.detect(profileUrl)).toBe(true);
    });
  });

  describe('URL normalization', () => {
    Object.entries(samples).forEach(([key, url]) => {
      test(`should normalize ${key} URL`, () => {
        const normalized = mod.normalizeUrl!(url);
        expect(normalized).toBeTruthy();
        expect(typeof normalized).toBe('string');
      });
    });
  });

  describe('embed info', () => {
    if (mod.getEmbedInfo) {
      test('should return embed info for video URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://vimeo.com/123456789');
        expect(embedInfo).not.toBeNull();
        expect(embedInfo?.embedUrl).toBe('https://player.vimeo.com/video/123456789');
        expect(embedInfo?.type).toBe('iframe');
      });

      test('should return embed info for showcase URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://vimeo.com/showcase/11838367');
        expect(embedInfo).not.toBeNull();
        expect(embedInfo?.embedUrl).toBe('https://vimeo.com/showcase/11838367/embed2');
        expect(embedInfo?.type).toBe('iframe');
      });

      test('should return null for profile URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://vimeo.com/sampleuser');
        expect(embedInfo).toBeNull();
      });

      test('should return null for channel URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://vimeo.com/channels/staffpicks');
        expect(embedInfo).toBeNull();
      });

      test('should return null for invalid URLs', () => {
        const embedInfo = mod.getEmbedInfo?.('https://example.com/invalid');
        expect(embedInfo).toBeNull();
      });
    }
  });
});
