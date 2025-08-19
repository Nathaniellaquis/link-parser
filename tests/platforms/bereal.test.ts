import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.BeReal;
const mod = registry.get(id)!;

describe('BeReal platform tests', () => {
  const samples = {
    profile: 'https://bereal.com/myusername',
  };

  describe('detection', () => {
    test('detect valid url', () => {
      expect(mod.detect(samples.profile)).toBe(true);
    });
    test('reject invalid', () => {
      const bad = ['https://example.com', 'https://bereal1.com'];
      bad.forEach((u) => expect(mod.detect(u)).toBe(false));
    });
  });

  describe('parsing', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.isValid).toBe(true);
      expect(r.platform).toBe(id);
      expect(r.username).toBe('myusername');
      expect(r.metadata.isProfile).toBe(true);
    });
  });

  describe('builder', () => {
    test('build profile', () => {
      const url = mod.buildProfileUrl('john');
      expect(url).toBe('https://bereal.com/john');
      expect(mod.detect(url)).toBe(true);
    });
  });
});
