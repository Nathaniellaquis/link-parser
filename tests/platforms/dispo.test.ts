import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Dispo;
const mod = registry.get(id)!;

describe('Dispo platform tests', () => {
  const samples = {
    profile: 'https://dispo.fun/@camera',
    roll: 'https://dispo.fun/r/holiday2024',
  };

  describe('detection', () => {
    test('detect', () => {
      Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
    });
    test('reject invalid', () => {
      const bad = ['https://example.com', 'https://dispo.fun/r/'];
      bad.forEach((u) => expect(mod.detect(u)).toBe(false));
    });
  });

  describe('parsing', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('camera');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('roll', () => {
      const r = parse(samples.roll);
      expect(r.isValid).toBe(true);
      expect(r.ids.rollId).toBe('holiday2024');
      expect(r.metadata.isRoll).toBe(true);
    });
  });

  describe('builder', () => {
    test('profile builder', () => {
      const url = mod.buildProfileUrl('lens');
      expect(url).toBe('https://dispo.fun/@lens');
      expect(mod.detect(url)).toBe(true);
    });
    test('roll builder', () => {
      const url = mod.buildContentUrl!('roll', 'myroll');
      expect(url).toBe('https://dispo.fun/r/myroll');
    });
  });
});
