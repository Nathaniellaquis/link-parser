import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Bandcamp;
const mod = registry.get(id)!;

describe('Bandcamp platform tests', () => {
  const samples = {
    profile: 'https://artistname.bandcamp.com',
    album: 'https://artistname.bandcamp.com/album/great-album',
    track: 'https://artistname.bandcamp.com/track/cool-track',
  };

  const invalid = ['https://example.com/artistname.bandcamp.com'];

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(invalid)('should not detect invalid URL: %s', (url) => {
      expect(mod.detect(url)).toBe(false);
    });
  });

  test('parse profile', () => {
    const r = parse(samples.profile);
    expect(r.isValid).toBe(true);
    expect(r.username).toBe('artistname');
    expect(r.metadata.isProfile).toBe(true);
  });

  test('parse album', () => {
    const r = parse(samples.album);
    expect(r.ids.albumSlug).toBe('great-album');
    expect(r.metadata.isAlbum).toBe(true);
  });

  test('parse track', () => {
    const r = parse(samples.track);
    expect(r.ids.trackSlug).toBe('cool-track');
    expect(r.metadata.isSingle).toBe(true);
  });

  test('builder', () => {
    const url = mod.buildProfileUrl('newartist');
    expect(url).toBe('https://newartist.bandcamp.com');
  });
});
