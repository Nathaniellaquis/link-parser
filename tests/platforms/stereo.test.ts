import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Stereo;
const mod = registry.get(id)!;

describe('Stereo tests', () => {
  const samples = {
    profile: 'https://stereo.com/radiohost',
    show: 'https://stereo.com/s/SHOW123',
  };
  describe('detection', () => {

    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

  });
  test('profile parse', () => {
    const r = parse(samples.profile);
    expect(r.username).toBe('radiohost');
    expect(r.metadata.isProfile).toBe(true);
  });
  test('show parse', () => {
    const r = parse(samples.show);
    expect(r.ids.showId).toBe('SHOW123');
    expect(r.metadata.isShow).toBe(true);
  });
});
