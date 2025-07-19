import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Deezer;
const mod = registry.get(id)!;

describe('Deezer platform tests', () => {
  const samples = {
    artist: 'https://www.deezer.com/us/artist/27',
    album: 'https://www.deezer.com/us/album/302127',
    track: 'https://www.deezer.com/us/track/3135556',
    playlist: 'https://www.deezer.com/us/playlist/908622995',
  };

  test('detect', () => {
    Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
    expect(mod.detect('https://example.com')).toBe(false);
  });

  test('parse artist', () => {
    const r = parse(samples.artist);
    expect(r.isValid).toBe(true);
    expect(r.ids.artistId).toBe('27');
    expect(r.metadata.isProfile).toBe(true);
  });

  test('parse album', () => {
    const r = parse(samples.album);
    expect(r.isValid).toBe(true);
    expect(r.ids.albumId).toBe('302127');
    expect(r.metadata.isAlbum).toBe(true);
  });

  test('parse track', () => {
    const r = parse(samples.track);
    expect(r.isValid).toBe(true);
    expect(r.ids.trackId).toBe('3135556');
    expect(r.metadata.isSingle).toBe(true);
  });

  test('parse playlist', () => {
    const r = parse(samples.playlist);
    expect(r.isValid).toBe(true);
    expect(r.ids.playlistId).toBe('908622995');
    expect(r.metadata.isPlaylist).toBe(true);
  });

  test('builder', () => {
    const url = mod.buildProfileUrl('123');
    expect(url).toBe('https://deezer.com/artist/123');
  });
});
