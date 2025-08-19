import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Bluesky;
const mod = registry.get(id)!;

describe('Bluesky platform tests', () => {
  const samples = {
    profile: 'https://bsky.app/profile/sampleuser.bsky.social',
    profileDid: 'https://bsky.app/profile/did:plc:abc123def456',
    post: 'https://bsky.app/profile/sampleuser.bsky.social/post/abc123',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

    test('should not detect non-Bluesky URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://bsky.app/profile/sampleuser.bsky.social', () => {
      const result = parse('https://bsky.app/profile/sampleuser.bsky.social');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://bsky.app/profile/sampleuser.bsky.social');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser.bsky.social');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (no dot)
      const invalid = parse('https://bsky.app/profile/sampleuser');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse profileDid: https://bsky.app/profile/did:plc:abc123def456', () => {
      const result = parse('https://bsky.app/profile/did:plc:abc123def456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://bsky.app/profile/did:plc:abc123def456');

      // Platform-specific assertions
      expect(result.username).toBe('did:plc:abc123def456');
      // Negative: invalid DID (missing plc)
      const invalid = parse('https://bsky.app/profile/did:abc123def456');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse post: https://bsky.app/profile/sampleuser.bsky.social/post/abc123', () => {
      const result = parse('https://bsky.app/profile/sampleuser.bsky.social/post/abc123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe(
        'https://bsky.app/profile/sampleuser.bsky.social/post/abc123',
      );

      // Platform-specific assertions
      expect(result.ids.postId).toBe('abc123');
      // Negative: invalid post id (too short)
      const invalid = parse('https://bsky.app/profile/sampleuser.bsky.social/post/a');
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
