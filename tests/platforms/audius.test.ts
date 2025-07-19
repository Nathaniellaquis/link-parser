import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Audius;
const mod = registry.get(id)!;

describe('Audius platform tests', () => {
  const samples = {
    profile: 'https://audius.co/djcool',
    track: 'https://audius.co/djcool/my-new-banger',
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
      expect(r.username).toBe('djcool');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('track', () => {
      const r = parse(samples.track);
      expect(r.username).toBe('djcool');
      expect(r.ids.trackSlug).toBe('my-new-banger');
      expect(r.metadata.isAudio).toBe(true);
    });
  });

  describe('builders', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl?.('artist')).toBe('https://audius.co/artist');
    });
    test('track builder', () => {
      expect(mod.buildContentUrl?.('track', 'artist/mega-hit')).toBe(
        'https://audius.co/artist/mega-hit',
      );
    });
  });
});
