import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.CoinbaseCommerce)!;

describe('Coinbase Commerce', () => {
  const good =
    'https://commerce.coinbase.com/checkout/abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
  const notCheckout =
    'https://commerce.coinbase.com/charges/abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789';
  const badId = 'https://commerce.coinbase.com/checkout/shortid';

  test('detect', () => {
    expect(mod.detect(good)).toBe(true);
    expect(mod.detect(notCheckout)).toBe(false);
    expect(mod.detect(badId)).toBe(false);
  });

  test('parse uuid', () => {
    const r = parse(good);
    expect(r.ids.checkoutId).toBe(
      'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789',
    );
  });
});
