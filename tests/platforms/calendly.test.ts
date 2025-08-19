import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Calendly;
const mod = registry.get(id)!;

describe('Calendly tests', () => {
  const samples = {
    profile: 'https://calendly.com/johndoe',
    event: 'https://calendly.com/johndoe/30min',
  };
  describe('detection', () => {

    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

  });
  test('profile', () => {
    const r = parse(samples.profile);
    expect(r.username).toBe('johndoe');
    expect(r.metadata.isProfile).toBe(true);
  });
  test('event', () => {
    const r = parse(samples.event);
    expect(r.ids.eventType).toBe('30min');
    expect(r.metadata.isEvent).toBe(true);
  });
});
