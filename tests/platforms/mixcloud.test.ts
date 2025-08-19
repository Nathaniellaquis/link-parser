import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Mixcloud;
const mod = registry.get(id)!;

describe('Mixcloud platform tests', () => {
  const samples = {
    profile: 'https://www.mixcloud.com/awesomeDJ/',
    profileNoSlash: 'https://mixcloud.com/awesomeDJ',
    track: 'https://mixcloud.com/awesomeDJ/summer-mix-2024/',
  };

  const invalid = [
    'https://awesomeDJ.mixcloud.com',
    'https://example.com/awesomeDJ/summer-mix-2024',
  ];

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(invalid)('should not detect invalid URL: %s', (url) => {
      expect(mod.detect(url)).toBe(false);
    });
  });

  test('parse profile', () => {
    const r = parse(samples.profileNoSlash);
    expect(r.username).toBe('awesomeDJ');
    expect(r.metadata.isProfile).toBe(true);
  });

  test('parse track', () => {
    const r = parse(samples.track);
    expect(r.username).toBe('awesomeDJ');
    expect(r.ids.trackSlug).toBe('summer-mix-2024');
    expect(r.metadata.isSingle).toBe(true);
  });

  test('builder', () => {
    const url = mod.buildProfileUrl('newdj');
    expect(url).toBe('https://www.mixcloud.com/newdj/');
  });
});
