import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.BandsInTown;
const mod = registry.get(id)!;

describe('BandsInTown tests', () => {
  const samples = {
    artist: 'https://bandsintown.com/a/12345',
    event: 'https://bandsintown.com/e/98765',
  };
  test('detect', () => {
    Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
  });
  test('artist parse', () => {
    const r = parse(samples.artist);
    expect(r.ids.artistId).toBe('12345');
    expect(r.metadata.isArtist).toBe(true);
  });
  test('event parse', () => {
    const r = parse(samples.event);
    expect(r.ids.eventId).toBe('98765');
    expect(r.metadata.isEvent).toBe(true);
  });
});
