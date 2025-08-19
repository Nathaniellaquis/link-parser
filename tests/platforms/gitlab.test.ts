import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.GitLab;
const mod = registry.get(id)!;

describe('GitLab platform tests', () => {
  const samples = {
    profile: 'https://gitlab.com/sampleuser',
    project: 'https://gitlab.com/sampleuser/sampleproject',
    group: 'https://gitlab.com/samplegroup',
    snippet: 'https://gitlab.com/sampleuser/sampleproject/-/snippets/123',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

    test('should not detect non-GitLab URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse profile: https://gitlab.com/sampleuser', () => {
      const result = parse('https://gitlab.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://gitlab.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://gitlab.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse project: https://gitlab.com/sampleuser/sampleproject', () => {
      const result = parse('https://gitlab.com/sampleuser/sampleproject');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://gitlab.com/sampleuser/sampleproject');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.projectName).toBe('sampleproject');
      // Negative: invalid project name (bad chars)
      const invalid = parse('https://gitlab.com/sampleuser/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.projectName).toBeUndefined();
    });

    test('should parse group: https://gitlab.com/samplegroup', () => {
      const result = parse('https://gitlab.com/samplegroup');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://gitlab.com/samplegroup');
      // Platform-specific assertions
      expect(result.username).toBe('samplegroup');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid group name (too short)
      const invalid = parse('https://gitlab.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse snippet: https://gitlab.com/sampleuser/sampleproject/-/snippets/123', () => {
      const result = parse('https://gitlab.com/sampleuser/sampleproject/-/snippets/123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://gitlab.com/sampleuser/sampleproject/-/snippets/123');
      // Platform-specific assertions
      expect(result.ids.snippetId).toBe('123');
      // Negative: invalid snippet id (letters)
      const invalid = parse('https://gitlab.com/sampleuser/sampleproject/-/snippets/abc');
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
