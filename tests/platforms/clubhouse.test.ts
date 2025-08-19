import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Clubhouse;
const mod = registry.get(id)!;

describe('Clubhouse platform tests', () => {
  const samples = {
    profile: 'https://clubhouse.com/@speaker',
    club: 'https://clubhouse.com/club/tech-talk',
    event: 'https://clubhouse.com/event/abc123',
  };

  describe('detection', () => {
    describe('detection', () => {
      test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
        expect(mod.detect(url)).toBe(true);
      });
    });
    describe('reject invalid', () => {
      const bad = ['https://example.com', 'https://dd.com/user'];
      test.each(bad)('should not detect %s URL: %s', (url) => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  describe('parsing', () => {
    test('profile', () => {
      const r = parse(samples.profile);
      expect(r.isValid).toBe(true);
      expect(r.username).toBe('speaker');
      expect(r.metadata.isProfile).toBe(true);
    });
    test('club', () => {
      const r = parse(samples.club);
      expect(r.isValid).toBe(true);
      expect(r.ids.clubName).toBe('tech-talk');
      expect(r.metadata.isClub).toBe(true);
    });
    test('event', () => {
      const r = parse(samples.event);
      expect(r.isValid).toBe(true);
      expect(r.ids.eventId).toBe('abc123');
      expect(r.metadata.isEvent).toBe(true);
    });
  });

  describe('builder', () => {
    test('profile builder', () => {
      const url = mod.buildProfileUrl('john');
      expect(url).toBe('https://clubhouse.com/@john');
      expect(mod.detect(url)).toBe(true);
    });
    test('club builder', () => {
      const url = mod.buildContentUrl!('club', 'myclub');
      expect(url).toBe('https://clubhouse.com/club/myclub');
    });
    test('event builder', () => {
      const url = mod.buildContentUrl!('event', 'evt456');
      expect(url).toBe('https://clubhouse.com/event/evt456');
    });
  });
});
