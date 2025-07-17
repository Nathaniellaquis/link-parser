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
    'https://mixcloud.com/',
    'https://awesomeDJ.mixcloud.com',
    'https://example.com/awesomeDJ/summer-mix-2024',
  ];

  test('detect positives', () => {
    Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
  });

  test('detect negatives', () => {
    invalid.forEach((u) => expect(mod.detect(u)).toBe(false));
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
