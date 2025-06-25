import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.YouTube;
const mod = registry.get(id)!;

describe('YouTube platform tests', () => {
  const samples = {
    profileHandle: "https://youtube.com/@sampleuser",
    profileChannel: "https://youtube.com/channel/UC1234567890abcdefghi",
    profileUser: "https://youtube.com/user/sampleuser",
    profileC: "https://youtube.com/c/sampleuser",
    video: "https://youtu.be/dQw4w9WgXcQ",
    videoQS: "https://youtube.com/watch?v=dQw4w9WgXcQ&t=42",
    short: "https://youtube.com/shorts/dQw4w9WgXcQ",
    live: "https://youtube.com/live/dQw4w9WgXcQ",
    playlist: "https://youtube.com/playlist?list=PL123456ABCDEF",
    embed: "https://www.youtube.com/embed/dQw4w9WgXcQ"
  };

  describe('detection', () => {
    test('should detect all YouTube URLs', () => {
      Object.entries(samples).forEach(([key, url]) => {
        const result = mod.detect(url);
        if (!result) console.log(`Failed to detect ${key}: ${url}`);
        expect(result).toBe(true);
      });
    });

    test('should not detect non-YouTube URLs', () => {
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
    test('should parse profileHandle: https://youtube.com/@sampleuser', () => {
      const result = parse('https://youtube.com/@sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/@sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
    });

    test('should parse profileChannel: https://youtube.com/channel/UC1234567890abcdefghi', () => {
      const result = parse('https://youtube.com/channel/UC1234567890abcdefghi');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/channel/UC1234567890abcdefghi');

      // Platform-specific assertions
      expect(result.ids.channelId).toBe('UC1234567890abcdefghi');
      // Negative: invalid channel id (too short)
      const invalid = parse('https://youtube.com/channel/UCabc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.channelId).toBeUndefined();
    });

    test('should parse profileUser: https://youtube.com/user/sampleuser', () => {
      const result = parse('https://youtube.com/user/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/user/sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid user id (too short)
      const invalid = parse('https://youtube.com/user/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse profileC: https://youtube.com/c/sampleuser', () => {
      const result = parse('https://youtube.com/c/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/c/sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid c id (bad chars)
      const invalid = parse('https://youtube.com/c/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse video: https://youtu.be/dQw4w9WgXcQ', () => {
      const result = parse('https://youtu.be/dQw4w9WgXcQ');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtu.be/dQw4w9WgXcQ');

      // Platform-specific assertions
      expect(result.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(result.embedData?.embedUrl).toContain('youtube.com/embed');
    });

    test('should parse videoQS: https://youtube.com/watch?v=dQw4w9WgXcQ&t=42', () => {
      const result = parse('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42');

      // Platform-specific assertions
      expect(result.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(result.metadata.timestamp).toBe(42);
    });

    test('should parse short: https://youtube.com/shorts/dQw4w9WgXcQ', () => {
      const result = parse('https://youtube.com/shorts/dQw4w9WgXcQ');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/shorts/dQw4w9WgXcQ');

      // Platform-specific assertions
      expect(result.ids.shortId).toBe('dQw4w9WgXcQ');
    });

    test('should parse live: https://youtube.com/live/dQw4w9WgXcQ', () => {
      const result = parse('https://youtube.com/live/dQw4w9WgXcQ');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/live/dQw4w9WgXcQ');

      // Platform-specific assertions
      expect(result.ids.liveId).toBe('dQw4w9WgXcQ');
      // Negative: invalid live id (too short)
      const invalid = parse('https://youtube.com/live/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.liveId).toBeUndefined();
    });

    test('should parse playlist: https://youtube.com/playlist?list=PL123456ABCDEF', () => {
      const result = parse('https://youtube.com/playlist?list=PL123456ABCDEF');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://youtube.com/playlist?list=PL123456ABCDEF');

      // Platform-specific assertions
      expect(result.ids.playlistId).toBe('PL123456ABCDEF');
    });

    test('should parse embed: https://www.youtube.com/embed/dQw4w9WgXcQ', () => {
      const result = parse('https://www.youtube.com/embed/dQw4w9WgXcQ');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://www.youtube.com/embed/dQw4w9WgXcQ');

      // Platform-specific assertions
      expect(result.embedData?.embedUrl).toContain('dQw4w9WgXcQ');
      // Negative: invalid embed id (too short)
      const invalid = parse('https://www.youtube.com/embed/abc');
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

  describe('builders', () => {
    const url = mod.buildProfileUrl('SomeChannel')
    expect(url).toContain('youtube.com')
  })

  describe('live', () => {
    const liveWatch = 'https://www.youtube.com/watch?v=abcDEFGHIJK&live=1'
    const channelLive = 'https://www.youtube.com/@somechannel/live'
    test('detect', () => {
      expect(mod.detect(liveWatch)).toBe(true)
      expect(mod.detect(channelLive)).toBe(true)
    })
    test('parse watch live', () => {
      const r = parse(liveWatch)
      expect(r.ids.liveId).toBe('abcDEFGHIJK')
      expect(r.metadata.isLive).toBe(true)
    })
    test('parse channel live', () => {
      const r = parse(channelLive)
      expect(r.username).toBe('somechannel')
      expect(r.metadata.isLive).toBe(true)
    })
  })
});
