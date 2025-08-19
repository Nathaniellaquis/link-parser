import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.LooksRare)!;

describe('LooksRare', () => {
  const good = 'https://looksrare.org/collections/0x1234567890abcdef1234567890abcdef12345678/1234';
  const badContract = 'https://test.org/collections/notacontract/1234';

  test('detect', () => {
    expect(mod.detect(good)).toBe(true);
    expect(mod.detect(badContract)).toBe(false);
  });

  test('parse ids', () => {
    const r = parse(good);
    expect(r.ids.contract).toBe('0x1234567890abcdef1234567890abcdef12345678');
    expect(r.ids.tokenId).toBe('1234');
  });
});
