import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.LinkedIn;
const mod = registry.get(id)!;

describe('LinkedIn platform tests', () => {
  const samples = {
    profileIn: "https://linkedin.com/in/sampleuser",
    company: "https://linkedin.com/company/samplecompany",
    school: "https://linkedin.com/school/sampleschool",
    post: "https://linkedin.com/posts/sampleuser_sample-post-1234567890",
    article: "https://linkedin.com/pulse/sample-article-sampleuser"
  };

  describe('detection', () => {
    test('should detect all LinkedIn URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-LinkedIn URLs', () => {
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
    test('should parse profileIn: https://linkedin.com/in/sampleuser', () => {
      const result = parse('https://linkedin.com/in/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://linkedin.com/in/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      // Negative: invalid username (too short)
      const invalid = parse('https://linkedin.com/in/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse company: https://linkedin.com/company/samplecompany', () => {
      const result = parse('https://linkedin.com/company/samplecompany');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://linkedin.com/company/samplecompany');
      // Platform-specific assertions
      expect(result.ids.companyName).toBe('samplecompany');
      // Negative: invalid company name (bad chars)
      const invalid = parse('https://linkedin.com/company/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.companyName).toBeUndefined();
    });

    test('should parse school: https://linkedin.com/school/sampleschool', () => {
      const result = parse('https://linkedin.com/school/sampleschool');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://linkedin.com/school/sampleschool');
      // Platform-specific assertions
      expect(result.ids.schoolName).toBe('sampleschool');
      // Negative: invalid school name (empty)
      const invalid = parse('https://linkedin.com/school/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.schoolName).toBeUndefined();
    });

    test('should parse post: https://linkedin.com/posts/sampleuser_sample-post-1234567890', () => {
      const result = parse('https://linkedin.com/posts/sampleuser_sample-post-1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://linkedin.com/posts/sampleuser_sample-post-1234567890');
      // Platform-specific assertions
      expect(result.ids.postId).toBe('sample-post-1234567890');
      // Negative: invalid post id (too short)
      const invalid = parse('https://linkedin.com/posts/a');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.postId).toBeUndefined();
    });

    test('should parse article: https://linkedin.com/pulse/sample-article-sampleuser', () => {
      const result = parse('https://linkedin.com/pulse/sample-article-sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://linkedin.com/pulse/sample-article-sampleuser');
      // Platform-specific assertions
      expect(result.ids.articleSlug).toBe('sample-article-sampleuser');
      // Negative: invalid article slug (empty)
      const invalid = parse('https://linkedin.com/pulse/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.articleSlug).toBeUndefined();
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
