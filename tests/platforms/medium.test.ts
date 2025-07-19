import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Medium;
const mod = registry.get(id)!;

describe('Medium platform tests', () => {
  const samples = {
    profileHandle: 'https://medium.com/@sampleuser',
    profileUid: 'https://medium.com/u/abcdef123456',
    profileSub: 'https://sampleuser.medium.com',
    postUser: 'https://medium.com/@sampleuser/test-post-title-abcdef123456',
    postP: 'https://medium.com/p/abcdef123456',
    postSub: 'https://sampleuser.medium.com/test-post-title-abcdef123456',
  };

  describe('detect', () => {
    Object.values(samples).forEach((url) => {
      test(`detect ${url}`, () => {
        expect(mod.detect(url)).toBe(true);
      });
    });
  });

  describe('parse profiles', () => {
    test('handle profile', () => {
      const r = parse(samples.profileHandle);
      expect(r.username).toBe('sampleuser');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('uid profile', () => {
      const r = parse(samples.profileUid);
      expect(r.userId).toBe('abcdef123456');
    });
    test('subdomain profile', () => {
      const r = parse(samples.profileSub);
      expect(r.username).toBe('sampleuser');
    });
  });

  describe('parse posts', () => {
    test('user post', () => {
      const r = parse(samples.postUser);
      expect(r.ids.postSlug).toContain('abcdef123456');
      expect(r.metadata.isPost).toBe(true);
    });
    test('p post', () => {
      const r = parse(samples.postP);
      expect(r.ids.postSlug).toBe('abcdef123456');
    });
    test('subdomain post', () => {
      const r = parse(samples.postSub);
      expect(r.ids.postSlug).toContain('abcdef123456');
    });
  });

  describe('builder', () => {
    test('profile builder', () => {
      const url = mod.buildProfileUrl('tester');
      expect(url).toBe('https://medium.com/@tester');
    });
  });
});
