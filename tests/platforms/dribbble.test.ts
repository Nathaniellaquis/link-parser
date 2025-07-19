import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Dribbble;
const mod = registry.get(id)!;

describe('Dribbble platform tests', () => {
  const samples = {
    profile: 'https://dribbble.com/johndoe',
    shot: 'https://dribbble.com/shots/12345678-awesome-design',
  };

  describe('detect', () => {
    Object.values(samples).forEach((url) => {
      test(url, () => {
        expect(mod.detect(url)).toBe(true);
      });
    });
  });

  describe('parse', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('johndoe');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('shot', () => {
      const r = parse(samples.shot);
      expect(r.ids.shotId).toBe('12345678');
      expect(r.metadata.isPost).toBe(true);
    });
  });

  describe('builders', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl?.('designer')).toBe('https://dribbble.com/designer');
    });
    test('shot builder', () => {
      expect(mod.buildContentUrl?.('shot', '98765432')).toBe('https://dribbble.com/shots/98765432');
    });
  });
});
