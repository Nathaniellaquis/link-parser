import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Discord;
const mod = registry.get(id)!;

describe('Discord platform tests', () => {
  const samples = {
    invite: 'https://discord.gg/ABC123',
    inviteFull: 'https://discord.com/invite/ABC123',
    server: 'https://discord.com/servers/sample-server',
    user: 'https://discord.com/users/1234567890',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

    test('should not detect non-Discord URLs', () => {
      const nonPlatformUrls = ['https://example.com/test', 'https://google.com', 'not-a-url'];

      nonPlatformUrls.forEach((url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('should parse invite: https://discord.gg/ABC123', () => {
      const result = parse('https://discord.gg/ABC123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://discord.gg/ABC123');

      // Platform-specific assertions
      expect(result.ids.inviteCode).toBe('ABC123');
      // Negative: invalid invite code (too short)
      const invalid = parse('https://discord.gg/1');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.inviteCode).toBeUndefined();
    });

    test('should parse inviteFull: https://discord.com/invite/ABC123', () => {
      const result = parse('https://discord.com/invite/ABC123');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://discord.com/invite/ABC123');

      // Platform-specific assertions
      expect(result.ids.inviteCode).toBe('ABC123');
      // Negative: invalid invite code (bad chars)
      const invalid = parse('https://discord.com/invite/!@#$%');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.inviteCode).toBeUndefined();
    });

    test('should parse server: https://discord.com/servers/sample-server', () => {
      const result = parse('https://discord.com/servers/sample-server');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://discord.com/servers/sample-server');

      // Platform-specific assertions
      expect(result.ids.serverName).toBe('sample-server');
      // Negative: invalid server name (empty)
      const invalid = parse('https://discord.com/servers/');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.serverName).toBeUndefined();
    });

    test('should parse user: https://discord.com/users/1234567890', () => {
      const result = parse('https://discord.com/users/1234567890');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://discord.com/users/1234567890');

      // Platform-specific assertions
      expect(result.ids.userId).toBe('1234567890');
      // Negative: invalid user id (letters)
      const invalid = parse('https://discord.com/users/abcdef');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.userId).toBeUndefined();
    });
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('123456789012345678');
        expect(profileUrl).toBeTruthy();
        expect(mod.detect(profileUrl)).toBe(true);
      });
    }
  });

  describe('URL normalization', () => {
    if (mod.normalizeUrl) {
      Object.entries(samples).forEach(([key, url]) => {
        test(`should normalize ${key} URL`, () => {
          const normalized = mod.normalizeUrl!(url);
          expect(normalized).toBeTruthy();
          expect(typeof normalized).toBe('string');
        });
      });
    }
  });
});
