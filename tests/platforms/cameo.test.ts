import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Cameo;
const mod = registry.get(id)!;

describe('Cameo platform tests', () => {
  const samples = {
    profile: 'https://cameo.com/theoffice',
    profileWWW: 'http://www.cameo.com/theoffice',
    category: 'https://cameo.com/c/actors',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test('should not detect non-Cameo URL', () => {
      expect(mod.detect('https://example.com')).toBe(false);
    });
  });

  test('parse profile', () => {
    const r = parse(samples.profile);
    expect(r.isValid).toBe(true);
    expect(r.username).toBe('theoffice');
    expect(r.metadata.isProfile).toBe(true);
  });

  test('parse category', () => {
    const r = parse(samples.category);
    expect(r.isValid).toBe(true);
    expect(r.username).toBe('actors');
    expect(r.metadata.isCategory).toBe(true);
  });

  test('builder', () => {
    const url = mod.buildProfileUrl('myuser');
    expect(url).toBe('https://cameo.com/myuser');
    expect(mod.detect(url)).toBe(true);
  });
});
