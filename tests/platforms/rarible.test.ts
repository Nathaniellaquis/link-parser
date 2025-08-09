import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.Rarible)!;

describe('Rarible tests', () => {
  const samples = {
    token: 'https://rarible.com/token/ETHEREUM:0xabc123:12345',
    user: 'https://rarible.com/user/0xabc123',
  };

  describe('detection', () => {
    test('should detect Rarible URLs', () => {
      expect(mod.detect(samples.token)).toBe(true);
      expect(mod.detect(samples.user)).toBe(true);
    });

    test('should not detect non-Rarible URLs', () => {
      expect(mod.detect('https://example.com/token/123')).toBe(false);
      expect(mod.detect('https://opensea.io/user/abc')).toBe(false);
    });
  });

  describe('extraction', () => {
    test('should extract token data', () => {
      const result = mod.extract(samples.token);
      expect(result).not.toBeNull();
      expect(result?.ids?.contract).toBe('0xabc123');
      expect(result?.ids?.tokenId).toBe('12345');
      expect(result?.metadata?.contentType).toBe('token');
      expect(result?.metadata?.isProduct).toBe(true);
    });

    test('should extract user data', () => {
      const result = mod.extract(samples.user);
      expect(result).not.toBeNull();
      expect(result?.userId).toBe('0xabc123');
      expect(result?.metadata?.isProfile).toBe(true);
      expect(result?.metadata?.contentType).toBe('profile');
    });

    test('should return null for non-matching URLs', () => {
      expect(mod.extract('https://rarible.com')).toBeNull();
      expect(mod.extract('https://rarible.com/invalid')).toBeNull();
    });
  });

  describe('parsing', () => {
    test('parse token', () => {
      const r = parse(samples.token);
      expect(r.ids.contract).toBe('0xabc123');
      expect(r.ids.tokenId).toBe('12345');
    });
    test('parse user', () => {
      const r = parse(samples.user);
      expect(r.userId).toBe('0xabc123');
      expect(r.metadata.isProfile).toBe(true);
    });
  });
});
