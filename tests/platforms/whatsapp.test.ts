import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.WhatsApp;
const mod = registry.get(id)!;

describe('WhatsApp platform tests', () => {
  const samples = {
    phone: 'https://wa.me/15551234567',
    apiSend: 'https://api.whatsapp.com/send?phone=15551234567',
    group: 'https://chat.whatsapp.com/ABCDEFGHijklMNOPQRSTUV',
  };

  describe('detect', () => {
    Object.values(samples).forEach((url) => {
      test(`detect ${url}`, () => {
        expect(mod.detect(url)).toBe(true);
      });
    });
  });

  describe('parse', () => {
    test('phone profile', () => {
      const r = parse(samples.phone);
      expect(r.isValid).toBe(true);
      expect(r.userId).toBe('15551234567');
      expect(r.metadata.isProfile).toBe(true);
    });

    test('group invite', () => {
      const r = parse(samples.group);
      expect(r.isValid).toBe(true);
      expect(r.ids.groupInviteCode).toBe('ABCDEFGHijklMNOPQRSTUV');
      expect(r.metadata.isGroupInvite).toBe(true);
    });
  });

  describe('builder', () => {
    test('build profile url', () => {
      const url = mod.buildProfileUrl('15559876543');
      expect(url).toBe('https://wa.me/15559876543');
    });
  });
});
