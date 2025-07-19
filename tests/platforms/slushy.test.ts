import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Slushy;
const mod = registry.get(id)!;

describe('Slushy tests', () => {
  const profile = 'https://slushy.com/@creator';
  test('detect', () => {
    expect(mod.detect(profile)).toBe(true);
  });
  test('parse', () => {
    const r = parse(profile);
    expect(r.username).toBe('creator');
    expect(r.metadata.isProfile).toBe(true);
  });
});
