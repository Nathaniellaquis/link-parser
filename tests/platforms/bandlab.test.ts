import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.BandLab;
const mod = registry.get(id)!;

describe('BandLab platform tests', () => {
  const samples = {
    profile: 'https://www.bandlab.com/guitarhero',
    song: 'https://www.bandlab.com/guitarhero/awesome-song',
  };

  describe('detect', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });
  });

  describe('parse', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('guitarhero');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('song', () => {
      const r = parse(samples.song);
      expect(r.username).toBe('guitarhero');
      expect(r.ids.songSlug).toBe('awesome-song');
      expect(r.metadata.isAudio).toBe(true);
    });
  });
});
