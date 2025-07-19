import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.HooBe)!;

describe('Hoo.be tests', () => {
  const url = 'https://hoo.be/my.profile';
  test('detect', () => {
    expect(mod.detect(url)).toBe(true);
  });
  test('parse', () => {
    const r = parse(url);
    expect(r.username).toBe('my.profile');
  });
  test('handle validator', () => {
    expect(mod.validateHandle('good-handle')).toBe(true);
    expect(mod.validateHandle('a')).toBe(false);
    expect(mod.validateHandle('.dotstart')).toBe(false);
    expect(mod.validateHandle('bad!char')).toBe(false);
  });
});
