import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.GitHub;
const mod = registry.get(id)!;

describe('GitHub platform tests', () => {
  const samples = {
    profile: "https://github.com/sampleuser",
    repo: "https://github.com/sampleuser/samplerepo",
    gist: "https://gist.github.com/sampleuser/abc123def456",
    raw: "https://raw.githubusercontent.com/sampleuser/repo/main/file.txt"
  };

  describe('detection', () => {
    test('should detect all GitHub URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-GitHub URLs', () => {
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
    test('should parse profile: https://github.com/sampleuser', () => {
      const result = parse('https://github.com/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://github.com/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://github.com/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse repo: https://github.com/sampleuser/samplerepo', () => {
      const result = parse('https://github.com/sampleuser/samplerepo');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://github.com/sampleuser/samplerepo');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.repoName).toBe('samplerepo');
      // Negative: invalid repo name (bad chars)
      const invalid = parse('https://github.com/sampleuser/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.repoName).toBeUndefined();
    });

    test('should parse gist: https://gist.github.com/sampleuser/abc123def456', () => {
      const result = parse('https://gist.github.com/sampleuser/abc123def456');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://gist.github.com/sampleuser/abc123def456');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.gistId).toBe('abc123def456');
      // Negative: invalid gist id (too short)
      const invalid = parse('https://gist.github.com/sampleuser/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.gistId).toBeUndefined();
    });

    test('should parse raw: https://raw.githubusercontent.com/sampleuser/repo/main/file.txt', () => {
      const result = parse('https://raw.githubusercontent.com/sampleuser/repo/main/file.txt');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://raw.githubusercontent.com/sampleuser/repo/main/file.txt');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.ids.repoName).toBe('repo');
      // Negative: invalid repo name (empty)
      const invalid = parse('https://raw.githubusercontent.com/sampleuser//main/file.txt');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.repoName).toBeUndefined();
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
