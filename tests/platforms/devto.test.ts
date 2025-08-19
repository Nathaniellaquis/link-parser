import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.DevTo;
const mod = registry.get(id)!;

describe('Dev.to platform tests', () => {
  const samples = {
    profile: 'https://dev.to/sampleuser',
    post: 'https://dev.to/sampleuser/my-first-post-123',
  };

  describe('detect', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });
  });

  describe('parse', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('sampleuser');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('post', () => {
      const r = parse(samples.post);
      expect(r.username).toBe('sampleuser');
      expect(r.ids.postSlug).toBe('my-first-post-123');
      expect(r.metadata.isPost).toBe(true);
    });
  });

  describe('builder', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl('tester')).toBe('https://dev.to/tester');
    });
  });
});
