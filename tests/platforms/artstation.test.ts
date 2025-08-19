import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.ArtStation;
const mod = registry.get(id)!;

describe('ArtStation platform tests', () => {
  const samples = {
    profile: 'https://www.artstation.com/artistname',
    artwork: 'https://www.artstation.com/artwork/abc123',
  };

  describe('detect', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });
  });

  describe('parse', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('artistname');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('artwork', () => {
      const r = parse(samples.artwork);
      expect(r.ids.artId).toBe('abc123');
      expect(r.metadata.isPost).toBe(true);
    });
  });

  describe('builders', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl?.('designer')).toBe('https://www.artstation.com/designer');
    });
    test('artwork builder', () => {
      expect(mod.buildContentUrl?.('artwork', 'def456')).toBe(
        'https://www.artstation.com/artwork/def456',
      );
    });
  });
});
