import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.PayPal;
const mod = registry.get(id)!;

describe('PayPal platform tests', () => {
  const samples = {
    profile: 'https://paypal.me/SampleUser',
    profileAlt: 'https://www.paypal.com/paypalme/SampleUser',
    payment: 'https://paypal.me/SampleUser/25',
    paymentCur: 'https://paypal.me/SampleUser/25USD',
    paymentAlt: 'https://paypal.com/paypalme/SampleUser/30',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(['https://example.com', 'https://paypal.me/'])(
      'should not detect invalid URL: %s',
      (url) => {
        expect(mod.detect(url)).toBe(false);
      },
    );
  });

  describe('parsing', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('SampleUser');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('payment', () => {
      const r = parse(samples.payment);
      expect(r.isValid).toBe(true);
      expect(r.metadata.isPayment).toBe(true);
      expect(r.ids.amount).toBe('25');
    });
    test('payment currency', () => {
      const r = parse(samples.paymentCur);
      expect(r.isValid).toBe(true);
      expect(r.ids.currency).toBe('USD');
    });
  });

  describe('builder', () => {
    test('build profile', () => {
      const url = mod.buildProfileUrl('john');
      expect(url).toBe('https://paypal.me/john');
      expect(mod.detect(url)).toBe(true);
    });
  });
});
