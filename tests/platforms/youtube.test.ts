import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';
import { generateUrlVariants } from '../utils/url-variants';

const id = Platforms.YouTube;
const mod = registry.get(id)!;

describe('YouTube platform tests', () => {
  // Platform-specific configuration
  // Only test base domains - mobile subdomains tested separately to avoid www.m.youtube.com
  // generateUrlVariants will add www variants automatically to base domains
  const youtubeDomains = ['youtube.com', 'm.youtube.com', 'mobile.youtube.com'];
  const youtuBeDomains = ['youtu.be', 'm.youtu.be', 'mobile.youtu.be'];

  const pathTemplates = {
    // Profile patterns
    handle: '@{handle}',
    channel: 'channel/{channelId}',
    userProfile: 'user/{username}',
    cProfile: 'c/{username}',

    // Content patterns
    video: 'watch?v={videoId}',
    videoWithTimestamp: 'watch?v={videoId}&t={timestamp}',
    videoInPlaylist: 'watch?v={videoId}&list={playlistId}',
    short: 'shorts/{videoId}',
    playlist: 'playlist?list={playlistId}',
    live: 'live/{videoId}',
    embed: 'embed/{videoId}',

    // Live patterns
    liveWatch: 'watch?v={videoId}&live=1',
    handleLive: '@{handle}/live',
    userLive: 'user/{username}/live',
    channelLive: 'channel/{channelId}/live',
  };

  // Test data
  const testData = {
    handle: 'testchannel',
    channelId: 'UC1234567890abcdefghi',
    username: 'testuser',
    videoId: 'dQw4w9WgXcQ',
    playlistId: 'PL123456ABCDEF',
    timestamp: '42',
  };

  // Generate URL variants by replacing placeholders
  const handleVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports handles
    pathTemplates.handle.replace('{handle}', testData.handle),
  );
  const channelVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports channels
    pathTemplates.channel.replace('{channelId}', testData.channelId),
  );
  const userProfileVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports user profiles
    pathTemplates.userProfile.replace('{username}', testData.username),
  );
  const cProfileVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports c/ profiles
    pathTemplates.cProfile.replace('{username}', testData.username),
  );
  const videoVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports watch?v= format
    pathTemplates.video.replace('{videoId}', testData.videoId),
  );
  const videoShortVariants = generateUrlVariants(
    youtuBeDomains, // youtu.be supports direct /{videoId} format
    testData.videoId, // Direct video ID for youtu.be
  );
  const shortVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports shorts
    pathTemplates.short.replace('{videoId}', testData.videoId),
  );
  const playlistVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports playlists
    pathTemplates.playlist.replace('{playlistId}', testData.playlistId),
  );
  const embedVariants = generateUrlVariants(
    youtubeDomains, // Only YouTube.com supports embeds
    pathTemplates.embed.replace('{videoId}', testData.videoId),
  );

  describe('URL Detection', () => {
    test('detect basic URLs', () => {
      expect(mod.detect('https://youtube.com/@testchannel')).toBe(true);
      expect(mod.detect('https://youtube.com/channel/UC1234567890abcdefghi')).toBe(true);
      expect(mod.detect('https://youtube.com/user/testuser')).toBe(true);
      expect(mod.detect('https://youtube.com/c/testuser')).toBe(true);
      expect(mod.detect('https://youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://youtube.com/shorts/dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://youtube.com/playlist?list=PL123456ABCDEF')).toBe(true);
      expect(mod.detect('https://www.youtube.com/embed/dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://google.com')).toBe(false);
    });

    test('detect mobile subdomain URLs', () => {
      // Basic mobile subdomains
      expect(mod.detect('https://m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://mobile.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://m.youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://mobile.youtu.be/dQw4w9WgXcQ')).toBe(true);

      // www + mobile subdomain combinations
      expect(mod.detect('https://www.m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://www.mobile.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://www.m.youtu.be/dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('https://www.mobile.youtu.be/dQw4w9WgXcQ')).toBe(true);

      // Protocol-less versions
      expect(mod.detect('m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('www.m.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('mobile.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
      expect(mod.detect('www.mobile.youtube.com/watch?v=dQw4w9WgXcQ')).toBe(true);
    });

    test.each(handleVariants.allUrls)('detect handle URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(channelVariants.allUrls)('detect channel URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(userProfileVariants.allUrls)('detect user profile URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(videoVariants.allUrls)('detect video URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(videoShortVariants.allUrls)('detect youtu.be short URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(shortVariants.allUrls)('detect short URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(playlistVariants.allUrls)('detect playlist URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(embedVariants.allUrls)('detect embed URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });
  });

  describe('Handle Parsing', () => {
    test.each(handleVariants.allUrls)('parse handle URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('testchannel');
      expect(r.metadata.contentType).toBe('profile');
      expect(r.metadata.isProfile).toBe(true);
    });
  });

  describe('Channel Parsing', () => {
    test.each(channelVariants.allUrls)('parse channel URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.channelId).toBe('UC1234567890abcdefghi');
      expect(r.metadata.contentType).toBe('channel');
      expect(r.metadata.isProfile).toBe(true);
    });
  });

  describe('User Profile Parsing', () => {
    test.each(userProfileVariants.allUrls)('parse user profile URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('testuser');
      expect(r.metadata.contentType).toBe('userProfile');
      expect(r.metadata.isProfile).toBe(true);
    });
  });

  describe('C Profile Parsing', () => {
    test.each(cProfileVariants.allUrls)('parse c profile URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('testuser');
      expect(r.metadata.contentType).toBe('profile');
      expect(r.metadata.isProfile).toBe(true);
    });
  });

  describe('Video Parsing', () => {
    test.each(videoVariants.allUrls)('parse video URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(r.metadata.contentType).toBe('video');
      expect(r.metadata.isVideo).toBe(true);
    });

    test.each(videoShortVariants.allUrls)('parse youtu.be short video URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(r.metadata.contentType).toBe('videoShort');
      expect(r.metadata.isVideo).toBe(true);
    });

    test('parse mobile subdomain video URLs', () => {
      const mobileUrls = [
        // Basic mobile subdomains
        'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://mobile.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://m.youtu.be/dQw4w9WgXcQ',
        'https://mobile.youtu.be/dQw4w9WgXcQ',
        // www + mobile subdomain combinations
        'https://www.m.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.mobile.youtube.com/watch?v=dQw4w9WgXcQ',
        'https://www.m.youtu.be/dQw4w9WgXcQ',
        'https://www.mobile.youtu.be/dQw4w9WgXcQ',
        // Protocol-less versions
        'm.youtube.com/watch?v=dQw4w9WgXcQ',
        'www.m.youtube.com/watch?v=dQw4w9WgXcQ',
        'mobile.youtube.com/watch?v=dQw4w9WgXcQ',
        'www.mobile.youtube.com/watch?v=dQw4w9WgXcQ',
      ];

      mobileUrls.forEach((url) => {
        const r = parse(url);
        expect(r.isValid).toBe(true);
        expect(r.ids.videoId).toBe('dQw4w9WgXcQ');
        expect(r.metadata.contentType).toBe(url.includes('youtu.be') ? 'videoShort' : 'video');
        expect(r.metadata.isVideo).toBe(true);
      });
    });

    test('parse video with timestamp', () => {
      const r = parse('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42');
      expect(r.isValid).toBe(true);
      expect(r.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(r.metadata.timestamp).toBe(42);
    });

    test('parse video in playlist', () => {
      const r = parse('https://youtube.com/watch?v=60ItHLz5WEA&list=RD60ItHLz5WEA');
      expect(r.isValid).toBe(true);
      expect(r.ids.videoId).toBe('60ItHLz5WEA');
      expect(r.ids.playlistId).toBe('RD60ItHLz5WEA');
      expect(r.metadata.contentType).toBe('videoInPlaylist');
      expect(r.metadata.isVideo).toBe(true);
      expect(r.metadata.isPlaylist).toBe(true);
    });
  });

  describe('Short Parsing', () => {
    test.each(shortVariants.allUrls)('parse short URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.shortId).toBe('dQw4w9WgXcQ');
      expect(r.metadata.contentType).toBe('short');
      expect(r.metadata.isShort).toBe(true);
    });
  });

  describe('Playlist Parsing', () => {
    test.each(playlistVariants.allUrls)('parse playlist URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.playlistId).toBe('PL123456ABCDEF');
      expect(r.metadata.contentType).toBe('playlist');
      expect(r.metadata.isPlaylist).toBe(true);
    });
  });

  describe('Embed Parsing', () => {
    test.each(embedVariants.allUrls)('parse embed URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(r.metadata.contentType).toBe('embed');
      expect(r.metadata.isEmbed).toBe(true);
    });

    test('parse mobile subdomain embed URLs', () => {
      const mobileEmbedUrls = [
        'https://m.youtube.com/embed/dQw4w9WgXcQ',
        'https://mobile.youtube.com/embed/dQw4w9WgXcQ',
      ];

      mobileEmbedUrls.forEach((url) => {
        const r = parse(url);
        expect(r.isValid).toBe(true);
        expect(r.ids.videoId).toBe('dQw4w9WgXcQ');
        expect(r.metadata.contentType).toBe('embed');
        expect(r.metadata.isEmbed).toBe(true);
      });
    });
  });

  describe('Live Parsing', () => {
    test('parse live video', () => {
      const r = parse('https://youtube.com/live/abcDEFGHIJK');
      expect(r.isValid).toBe(true);
      expect(r.ids.liveId).toBe('abcDEFGHIJK');
      expect(r.metadata.contentType).toBe('live');
      expect(r.metadata.isLive).toBe(true);
    });

    test('parse live watch', () => {
      const r = parse('https://youtube.com/watch?v=abcDEFGHIJK&live=1');
      expect(r.isValid).toBe(true);
      expect(r.ids.liveId).toBe('abcDEFGHIJK');
      expect(r.metadata.contentType).toBe('liveWatch');
      expect(r.metadata.isLive).toBe(true);
    });

    test('parse handle live', () => {
      const r = parse('https://youtube.com/@testchannel/live');
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('testchannel');
      expect(r.metadata.contentType).toBe('channelLive');
      expect(r.metadata.isLive).toBe(true);
    });

    test('parse user live', () => {
      const r = parse('https://youtube.com/user/testuser/live');
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('testuser');
      expect(r.metadata.contentType).toBe('userLive');
      expect(r.metadata.isLive).toBe(true);
    });

    test('parse channel live', () => {
      const r = parse('https://youtube.com/channel/UC1234567890abcdefghi/live');
      expect(r.isValid).toBe(true);
      expect(r.ids.channelId).toBe('UC1234567890abcdefghi');
      expect(r.metadata.contentType).toBe('channelIdLive');
      expect(r.metadata.isLive).toBe(true);
    });
  });

  describe('Validation and Utils', () => {
    test('handle validation', () => {
      expect(mod.validateHandle('testuser')).toBe(true);
      expect(mod.validateHandle('test_user')).toBe(true);
      expect(mod.validateHandle('test-user')).toBe(true);
      expect(mod.validateHandle('test.user')).toBe(true);
      expect(mod.validateHandle('ab')).toBe(false);
      expect(mod.validateHandle('')).toBe(false);
    });

    test('profile URL builder', () => {
      const url = mod.buildProfileUrl('testuser');
      expect(url).toBe('https://youtube.com/@testuser');
      expect(mod.detect(url)).toBe(true);
    });

    test('URL normalization', () => {
      const testCases = [
        {
          input: 'youtube.com/@testuser',
          expected: 'https://youtube.com/@testuser',
        },
        {
          input: 'https://youtube.com/@testuser/',
          expected: 'https://youtube.com/@testuser',
        },
        {
          input: 'https://youtube.com/watch?v=dQw4w9WgXcQ&feature=share&si=abc123',
          expected: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
        },
        {
          input: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=42&feature=share',
          expected: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=42',
        },
      ];

      testCases.forEach(({ input, expected }) => {
        expect(mod.normalizeUrl(input)).toBe(expected);
      });
    });
  });

  describe('Embed Info', () => {
    test('generate embed URL for video content', () => {
      const testCases = [
        {
          input: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          input: 'https://youtu.be/dQw4w9WgXcQ',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'videoShort',
        },
        {
          input: 'https://youtube.com/shorts/prJTPJMBVps',
          expected: 'https://www.youtube.com/embed/prJTPJMBVps',
          contentType: 'short',
        },
        {
          input: 'https://youtube.com/watch?v=60ItHLz5WEA&list=RD60ItHLz5WEA',
          expected: 'https://www.youtube.com/embed/60ItHLz5WEA?list=RD60ItHLz5WEA',
          contentType: 'videoInPlaylist',
        },
      ];

      testCases.forEach(({ input, expected, contentType }) => {
        const embedInfo = mod.getEmbedInfo!(input);
        expect(embedInfo).toEqual({
          embedUrl: expected,
          type: 'iframe',
          contentType,
        });
      });
    });

    test('generate embed URL for playlist content', () => {
      const testCases = [
        {
          input: 'https://youtube.com/playlist?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj',
          expected:
            'https://www.youtube.com/embed/videoseries?list=PLMC9KNkIncKtPzgY-5rmhvj7fax8fdxoj',
          contentType: 'playlist',
        },
        {
          input: 'https://youtube.com/channel/UClIuv1CvBae7se6CJ9bwBug',
          expected: 'https://www.youtube.com/embed/videoseries?list=UUlIuv1CvBae7se6CJ9bwBug',
          contentType: 'channel',
        },
      ];

      testCases.forEach(({ input, expected, contentType }) => {
        const embedInfo = mod.getEmbedInfo!(input);
        expect(embedInfo).toEqual({
          embedUrl: expected,
          type: 'iframe',
          contentType,
        });
      });
    });

    test('detect already embed URLs', () => {
      const testCases = [
        {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          url: 'https://youtube.com/embed/prJTPJMBVps',
          contentType: 'video',
        },
        {
          url: 'https://m.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          url: 'https://mobile.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
      ];

      testCases.forEach(({ url, contentType }) => {
        const embedInfo = mod.getEmbedInfo!(url);
        expect(embedInfo).toEqual({
          embedUrl: url,
          isEmbedAlready: true,
          type: 'iframe',
          contentType,
        });
      });
    });

    test('return null for non-embeddable content', () => {
      const testCases = [
        'https://youtube.com/@testchannel/live',
        'https://youtube.com/user/testuser/live',
        'https://youtube.com/channel/UC1234567890abcdefghi/live',
        'https://youtube.com/watch?v=abcDEFGHIJK&live=1',
        'https://youtube.com/live/abcDEFGHIJK',
      ];

      testCases.forEach((url) => {
        const embedInfo = mod.getEmbedInfo!(url);
        expect(embedInfo).toBeNull();
      });
    });

    test('return null for user profiles (sync)', () => {
      const url = 'https://youtube.com/user/testuser';
      const embedInfo = mod.getEmbedInfo!(url);
      expect(embedInfo).toBeNull();
    });

    test('preserve existing query parameters in embed URLs', () => {
      const testCases = [
        {
          input: 'https://youtube.com/watch?v=dQw4w9WgXcQ&utm_source=twitter&fbclid=abc123',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          input: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=42&utm_source=share',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          input: 'https://youtube.com/playlist?list=PL123456ABCDEF&utm_medium=social',
          expected: 'https://www.youtube.com/embed/videoseries?list=PL123456ABCDEF',
          contentType: 'playlist',
        },
      ];

      testCases.forEach(({ input, expected, contentType }) => {
        const embedInfo = mod.getEmbedInfo!(input);
        expect(embedInfo).toEqual({
          embedUrl: expected,
          type: 'iframe',
          contentType,
        });
      });
    });

    test('generate embed URLs for mobile subdomain URLs', () => {
      const testCases = [
        {
          input: 'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          input: 'https://mobile.youtube.com/shorts/prJTPJMBVps',
          expected: 'https://www.youtube.com/embed/prJTPJMBVps',
          contentType: 'short',
        },
        {
          input: 'https://m.youtu.be/dQw4w9WgXcQ',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'videoShort',
        },
      ];

      testCases.forEach(({ input, expected, contentType }) => {
        const embedInfo = mod.getEmbedInfo!(input);
        expect(embedInfo).toEqual({
          embedUrl: expected,
          type: 'iframe',
          contentType,
        });
      });
    });

    test('generate embed URLs for protocol-less URLs', () => {
      const testCases = [
        {
          input: 'youtube.com/watch?v=dQw4w9WgXcQ',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          input: 'youtu.be/dQw4w9WgXcQ',
          expected: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          contentType: 'videoShort',
        },
        {
          input: 'www.youtube.com/shorts/prJTPJMBVps',
          expected: 'https://www.youtube.com/embed/prJTPJMBVps',
          contentType: 'short',
        },
      ];

      testCases.forEach(({ input, expected, contentType }) => {
        const embedInfo = mod.getEmbedInfo!(input);
        expect(embedInfo).toEqual({
          embedUrl: expected,
          type: 'iframe',
          contentType,
        });
      });
    });

    test('return null for invalid URLs', () => {
      const testCases = [
        'https://google.com',
        'https://youtube.com/invalid/path',
        'https://vimeo.com/123456',
        'invalid-url',
        'not-a-youtube-url',
      ];

      testCases.forEach((url) => {
        const embedInfo = mod.getEmbedInfo!(url);
        expect(embedInfo).toBeNull();
      });
    });
  });

  describe('Async Embed Info', () => {
    test('should have getEmbedInfoAsync method', () => {
      expect(typeof mod.getEmbedInfoAsync).toBe('function');
    });

    test('fallback to sync method for regular content', async () => {
      const testCases = [
        {
          url: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
          contentType: 'video',
        },
        {
          url: 'https://youtube.com/shorts/prJTPJMBVps',
          contentType: 'short',
        },
        {
          url: 'https://youtube.com/playlist?list=PL123456ABCDEF',
          contentType: 'playlist',
        },
        {
          url: 'https://youtu.be/dQw4w9WgXcQ',
          contentType: 'videoShort',
        },
        {
          url: 'https://youtube.com/channel/UClIuv1CvBae7se6CJ9bwBug',
          contentType: 'channel',
        },
      ];

      for (const { url, contentType } of testCases) {
        const asyncResult = await mod.getEmbedInfoAsync?.(url);
        const syncResult = mod.getEmbedInfo?.(url);
        expect(asyncResult).toEqual(syncResult);
        expect((asyncResult as any)?.contentType).toBe(contentType);
      }
    });

    test('handle user profile with API resolution', async () => {
      const url = 'https://youtube.com/user/TestUser';
      const result = await mod.getEmbedInfoAsync?.(url);

      expect(result).not.toBeNull();
      expect(result?.embedUrl).toBe(
        'https://www.youtube.com/embed?listType=user_uploads&list=TestUser',
      );
      expect(result?.type).toBe('iframe');
      expect((result as any)?.contentType).toBe('userProfile');
    });

    test('handle user profile API failure gracefully', async () => {
      // Test with a likely non-existent user to trigger fallback
      const url = 'https://youtube.com/user/NonExistentUser12345';
      const result = await mod.getEmbedInfoAsync?.(url);

      // Should still return fallback embed
      expect(result).not.toBeNull();
      expect(result?.embedUrl).toBe(
        'https://www.youtube.com/embed?listType=user_uploads&list=NonExistentUser12345',
      );
      expect(result?.type).toBe('iframe');
      expect((result as any)?.contentType).toBe('userProfile');
    });

    test('return null for live content (async)', async () => {
      const testCases = [
        'https://youtube.com/@testchannel/live',
        'https://youtube.com/user/testuser/live',
        'https://youtube.com/channel/UC1234567890abcdefghi/live',
        'https://youtube.com/watch?v=abcDEFGHIJK&live=1',
        'https://youtube.com/live/abcDEFGHIJK',
      ];

      for (const url of testCases) {
        const result = await mod.getEmbedInfoAsync?.(url);
        expect(result).toBeNull();
      }
    });

    test('return null for invalid URLs (async)', async () => {
      const testCases = ['https://google.com', 'https://youtube.com/invalid/path', 'invalid-url'];

      for (const url of testCases) {
        const result = await mod.getEmbedInfoAsync?.(url);
        expect(result).toBeNull();
      }
    });

    test('handle protocol-less user profile URLs', async () => {
      const url = 'youtube.com/user/TestUser';
      const result = await mod.getEmbedInfoAsync?.(url);

      expect(result).not.toBeNull();
      expect(result?.embedUrl).toBe(
        'https://www.youtube.com/embed?listType=user_uploads&list=TestUser',
      );
      expect(result?.type).toBe('iframe');
      expect((result as any)?.contentType).toBe('userProfile');
    });

    test('handle mobile subdomain user profile URLs', async () => {
      const testCases = [
        'https://m.youtube.com/user/TestUser',
        'https://mobile.youtube.com/user/TestUser',
      ];

      for (const url of testCases) {
        const result = await mod.getEmbedInfoAsync?.(url);
        expect(result).not.toBeNull();
        expect(result?.embedUrl).toBe(
          'https://www.youtube.com/embed?listType=user_uploads&list=TestUser',
        );
        expect(result?.type).toBe('iframe');
        expect((result as any)?.contentType).toBe('userProfile');
      }
    });
  });
});
