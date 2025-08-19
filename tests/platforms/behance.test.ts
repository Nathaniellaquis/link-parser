import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Behance;
const mod = registry.get(id)!;

describe('Behance platform tests', () => {
  const samples = {
    profile: 'https://www.behance.net/creativeguru',
    project: 'https://www.behance.net/gallery/123456789/Awesome-Project',
  };

  describe('detect', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });
  });

  describe('parse', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('creativeguru');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('project', () => {
      const r = parse(samples.project);
      expect(r.ids.projectId).toBe('123456789');
      expect(r.metadata.isProject).toBe(true);
    });
  });

  describe('builders', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl?.('artist')).toBe('https://www.behance.net/artist');
    });
    test('project builder', () => {
      expect(mod.buildContentUrl?.('project', '987654321')).toBe(
        'https://www.behance.net/gallery/987654321',
      );
    });
  });
});
