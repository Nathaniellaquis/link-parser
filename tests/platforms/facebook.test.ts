import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Facebook;
const mod = registry.get(id)!;

describe('Facebook platform tests', () => {
  const samples = {
    profile: 'https://facebook.com/sampleuser',
    profileId: 'https://facebook.com/profile.php?id=1234567890',
    page: 'https://facebook.com/pages/Sample-Page/1234567890',
    post: 'https://facebook.com/sampleuser/posts/1234567890',
    video: 'https://facebook.com/watch/?v=1234567890',
    group: 'https://facebook.com/groups/samplegroup',
    event: 'https://facebook.com/events/1234567890',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(['https://example.com/test', 'https://google.com', 'not-a-url'])(
      'should not detect non-Facebook URL: %s',
      (url) => {
        expect(mod.detect(url)).toBe(false);
      },
    );
  });

  describe('parsing', () => {
    test('should parse profile: https://facebook.com/sampleuser', () => {
      const result = parse('https://facebook.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://facebook.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse profileId: https://facebook.com/profile.php?id=1234567890', () => {
      const result = parse('https://facebook.com/profile.php?id=1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/profile.php?id=1234567890');
      // Platform-specific assertions
      expect(result.ids.profileId).toBe('1234567890');
      // Negative: invalid id (letters)
      const invalid = parse('https://facebook.com/profile.php?id=abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.profileId).toBeUndefined();
    });

    test('should parse page: https://facebook.com/pages/Sample-Page/1234567890', () => {
      const result = parse('https://facebook.com/pages/Sample-Page/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/pages/Sample-Page/1234567890');
      // Platform-specific assertions
      expect(result.ids.pageId).toBe('1234567890');
      // Negative: invalid page id (too short)
      const invalid = parse('https://facebook.com/pages/Sample-Page/1');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.pageId).toBeUndefined();
    });

    test('should parse post: https://facebook.com/sampleuser/posts/1234567890', () => {
      const result = parse('https://facebook.com/sampleuser/posts/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/sampleuser/posts/1234567890');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('1234567890');
      // Negative: invalid post id (letters)
      const invalid = parse('https://facebook.com/sampleuser/posts/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
    });

    test('should parse video: https://facebook.com/watch/?v=1234567890', () => {
      const result = parse('https://facebook.com/watch/?v=1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/watch/?v=1234567890');
      // Platform-specific assertions
      expect(result.ids.videoId).toBe('1234567890');
      // Negative: invalid video id (letters)
      const invalid = parse('https://facebook.com/watch/?v=abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.videoId).toBeUndefined();
    });

    test('should parse group: https://facebook.com/groups/samplegroup', () => {
      const result = parse('https://facebook.com/groups/samplegroup');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/groups/samplegroup');
      // Platform-specific assertions
      expect(result.ids.groupName).toBe('samplegroup');
      // Negative: invalid group name (empty)
      const invalid = parse('https://facebook.com/groups/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.groupName).toBeUndefined();
    });

    test('should parse event: https://facebook.com/events/1234567890', () => {
      const result = parse('https://facebook.com/events/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://facebook.com/events/1234567890');
      // Platform-specific assertions
      expect(result.ids.eventId).toBe('1234567890');
      // Negative: invalid event id (letters)
      const invalid = parse('https://facebook.com/events/abc');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.eventId).toBeUndefined();
    });

    // New negative: invalid video id letters
    const badVideo = parse('https://facebook.com/watch/?v=abc');
    expect(badVideo.isValid).toBe(false);
    expect(badVideo.ids.videoId).toBeUndefined();

    // New negative: empty group
    const badGroup = parse('https://facebook.com/groups/');
    expect(badGroup.isValid).toBe(false);
    expect(badGroup.ids.groupName).toBeUndefined();
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

  describe('builder', () => {
    const url = mod.buildProfileUrl('someone');
    expect(url.startsWith('https://facebook.com')).toBe(true);
  });

  describe('live', () => {
    const liveUrl = 'https://facebook.com/somepage/live';
    test('detect', () => {
      expect(mod.detect(liveUrl)).toBe(true);
    });
    test('parse', () => {
      const r = parse(liveUrl);
      expect(r.username).toBe('somepage');
      expect(r.metadata.isLive).toBe(true);
    });
  });
});
