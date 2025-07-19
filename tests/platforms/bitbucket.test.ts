import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Bitbucket;
const mod = registry.get(id)!;

describe('Bitbucket platform tests', () => {
  const samples = {
    profile: 'https://bitbucket.org/sampleuser',
    repo: 'https://bitbucket.org/sampleuser/samplerepo',
    snippet: 'https://bitbucket.org/snippets/sampleuser/ABC123',
  };

  describe('detection', () => {
    test('should detect all Bitbucket URLs', () => {
      Object.values(samples).forEach((url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-Bitbucket URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://bitbucket.org/sampleuser', () => {
      const result = parse('https://bitbucket.org/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://bitbucket.org/sampleuser');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://bitbucket.org/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse repo: https://bitbucket.org/sampleuser/samplerepo', () => {
      const result = parse('https://bitbucket.org/sampleuser/samplerepo');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://bitbucket.org/sampleuser/samplerepo');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.repoName).toBe('samplerepo');
      // Negative: invalid repo name (bad chars)
      const invalid = parse('https://bitbucket.org/sampleuser/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.repoName).toBeUndefined();
    });

    test('should parse snippet: https://bitbucket.org/snippets/sampleuser/ABC123', () => {
      const result = parse('https://bitbucket.org/snippets/sampleuser/ABC123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://bitbucket.org/snippets/sampleuser/ABC123');

      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.snippetId).toBe('ABC123');
      // Negative: invalid snippet id (too short)
      const invalid = parse('https://bitbucket.org/snippets/sampleuser/1');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.snippetId).toBeUndefined();
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
