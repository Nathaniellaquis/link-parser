import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Ticketmaster;
const mod = registry.get(id)!;

describe('Ticketmaster tests', () => {
  const samples = {
    artist: 'https://ticketmaster.com/artist/12345',
    event: 'https://ticketmaster.com/event/EVT123',
    venue: 'https://ticketmaster.com/venue/VEN456',
  };
  describe('detection', () => {

    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

  });
  test('artist', () => {
    const r = parse(samples.artist);
    expect(r.ids.artistId).toBe('12345');
    expect(r.metadata.isArtist).toBe(true);
  });
  test('event', () => {
    const r = parse(samples.event);
    expect(r.ids.eventId).toBe('EVT123');
    expect(r.metadata.isEvent).toBe(true);
  });
  test('venue', () => {
    const r = parse(samples.venue);
    expect(r.ids.venueId).toBe('VEN456');
    expect(r.metadata.isVenue).toBe(true);
  });
});
