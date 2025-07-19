import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.SquareCheckout)!;

describe('Square checkout', () => {
  const good = 'https://square.link/pay/AbCd1234';
  const goodAlt = 'https://checkout.square.site/pay/zZyYxXwW';
  const bad = 'https://square.link/other/AbCd1234';

  test('detect variant', () => {
    expect(mod.detect(good)).toBe(true);
    expect(mod.detect(goodAlt)).toBe(true);
    expect(mod.detect(bad)).toBe(false);
  });

  test('parse code', () => {
    const r = parse(good);
    expect(r.ids.code).toBe('AbCd1234');
  });
});
