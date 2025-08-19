import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';
import { generateUrlVariants } from '../utils/url-variants';
// import { applemusic } from '../../src/utils/parse/platforms/applemusic'

const id = Platforms.AppleMusic;
const mod = registry.get(id)!;

describe('Apple Music platform tests', () => {
  // Platform-specific configuration
  const musicDomains = ['music.apple.com', 'embed.music.apple.com'];
  const podcastsDomains = ['podcasts.apple.com', 'embed.podcasts.apple.com'];

  const pathTemplates = {
    artist: '{locale}/artist/taylor-swift/159260351',
    album: '{locale}/album/1989/1440913819',
    playlist:
      '{locale}/playlist/camila-cabello-apple-music-live/pl.a7f376b0f3af4918a722686f5e5bbc23',
    song: '{locale}/song/shake-it-off/1440913819',
    track: '{locale}/album/1989/1440913819?i=1440913821',
    station: '{locale}/station/apple-music-1/ra.978194965',
    podcast: '{locale}/podcast/the-daily/id1200361736',
    podcastEpisode: '{locale}/podcast/the-daily/id1200361736?i=1000123456789',
  };

  // Prepare variants
  const artistVariants = generateUrlVariants(musicDomains, pathTemplates.artist);
  const albumVariants = generateUrlVariants(musicDomains, pathTemplates.album);
  const playlistVariants = generateUrlVariants(musicDomains, pathTemplates.playlist);
  const songVariants = generateUrlVariants(musicDomains, pathTemplates.song);
  const trackVariants = generateUrlVariants(musicDomains, pathTemplates.track);
  const stationVariants = generateUrlVariants(musicDomains, pathTemplates.station);
  const podcastVariants = generateUrlVariants(podcastsDomains, pathTemplates.podcast);
  const podcastEpisodeVariants = generateUrlVariants(podcastsDomains, pathTemplates.podcastEpisode);

  describe('URL Detection', () => {
    test('detect basic URLs', () => {
      expect(mod.detect('https://music.apple.com/us/artist/taylor-swift/159260351')).toBe(true);
      expect(mod.detect('https://music.apple.com/us/album/1989/1440913819')).toBe(true);
      expect(
        mod.detect(
          'https://music.apple.com/us/playlist/camila-cabello-apple-music-live/pl.a7f376b0f3af4918a722686f5e5bbc23',
        ),
      ).toBe(true);
      expect(mod.detect('https://music.apple.com/us/song/shake-it-off/1440913819')).toBe(true);
      expect(mod.detect('https://music.apple.com/us/station/apple-music-1/ra.978194965')).toBe(
        true,
      );
      expect(mod.detect('https://podcasts.apple.com/us/podcast/the-daily/id1200361736')).toBe(true);
      expect(
        mod.detect(
          'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736?i=1000123456789',
        ),
      ).toBe(true);
      expect(mod.detect('https://google.com')).toBe(false);
    });

    test.each(artistVariants.allUrls)('detect artist URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(albumVariants.allUrls)('detect album URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(playlistVariants.allUrls)('detect playlist URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(songVariants.allUrls)('detect song URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(trackVariants.allUrls)('detect track URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(stationVariants.allUrls)('detect station URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(podcastVariants.allUrls)('detect podcast URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(podcastEpisodeVariants.allUrls)('detect podcast episode URL: %s', (url) => {
      expect(mod.detect(url)).toBe(true);
    });
  });

  describe('Artist Parsing', () => {
    test.each(artistVariants.allUrls)('parse artist URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.artistId).toBe('159260351');
      expect(r.metadata.contentType).toBe('artist');
      expect(r.metadata.isProfile).toBe(true);
    });
  });

  describe('Album Parsing', () => {
    test.each(albumVariants.allUrls)('parse album URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.albumId).toBe('1440913819');
      expect(r.metadata.contentType).toBe('album');
      expect(r.metadata.isAlbum).toBe(true);
    });
  });

  describe('Playlist Parsing', () => {
    test.each(playlistVariants.allUrls)('parse playlist URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.playlistId).toBe('pl.a7f376b0f3af4918a722686f5e5bbc23');
      expect(r.metadata.contentType).toBe('playlist');
      expect(r.metadata.isPlaylist).toBe(true);
    });
  });

  describe('Song Parsing', () => {
    test.each(songVariants.allUrls)('parse song URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.songId).toBe('1440913819');
      expect(r.metadata.contentType).toBe('song');
      expect(r.metadata.isSong).toBe(true);
    });
  });

  describe('Track Parsing', () => {
    test.each(trackVariants.allUrls)('parse track URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.albumId).toBe('1440913819');
      expect(r.ids.trackId).toBe('1440913821');
      expect(r.metadata.contentType).toBe('track');
      expect(r.metadata.isTrack).toBe(true);
    });
  });

  describe('Station Parsing', () => {
    test.each(stationVariants.allUrls)('parse station URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.stationId).toBe('ra.978194965');
      expect(r.metadata.contentType).toBe('station');
      expect(r.metadata.isStation).toBe(true);
    });
  });

  describe('Podcast Parsing', () => {
    test.each(podcastVariants.allUrls)('parse podcast URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.podcastId).toBe('1200361736');
      expect(r.metadata.contentType).toBe('podcast');
      expect(r.metadata.isPodcast).toBe(true);
    });
  });

  describe('Podcast Episode Parsing', () => {
    test.each(podcastEpisodeVariants.allUrls)('parse podcast episode URL: %s', (url) => {
      const r = parse(url);
      expect(r.isValid).toBe(true);
      expect(r.ids.podcastId).toBe('1200361736');
      expect(r.ids.episodeId).toBe('1000123456789');
      expect(r.metadata.contentType).toBe('podcastEpisode');
      expect(r.metadata.isPodcastEpisode).toBe(true);
    });
  });

  describe('Validation and Utils', () => {
    test('handle validation', () => {
      expect(mod.validateHandle('159260351')).toBe(true);
      expect(mod.validateHandle('1440913819')).toBe(true);
      expect(mod.validateHandle('abc123')).toBe(false);
      expect(mod.validateHandle('')).toBe(false);
    });

    test('profile URL builder', () => {
      const url = mod.buildProfileUrl('123456');
      expect(url).toBe('https://music.apple.com/us/artist/id123456');
    });

    test.each([
      {
        input: 'music.apple.com/us/artist/taylor-swift/159260351',
        expected: 'https://music.apple.com/us/artist/taylor-swift/159260351',
      },
      {
        input: 'https://music.apple.com/us/artist/taylor-swift/159260351/',
        expected: 'https://music.apple.com/us/artist/taylor-swift/159260351',
      },
      {
        input:
          'https://music.apple.com/us/artist/taylor-swift/159260351?utm_source=twitter&fbclid=abc123',
        expected: 'https://music.apple.com/us/artist/taylor-swift/159260351',
      },
    ])('should normalize URL: $input -> $expected', ({ input, expected }) => {
      expect(mod.normalizeUrl(input)).toBe(expected);
    });
  });

  describe('Embed Info', () => {
    test.each([
      {
        input: 'https://music.apple.com/us/artist/taylor-swift/159260351',
        expected: 'https://embed.music.apple.com/us/artist/taylor-swift/159260351?theme=auto',
        contentType: 'artist',
      },
      {
        input: 'https://music.apple.com/us/album/1989/1440913819',
        expected: 'https://embed.music.apple.com/us/album/1989/1440913819?theme=auto',
        contentType: 'album',
      },
      {
        input:
          'https://music.apple.com/us/playlist/camila-cabello-apple-music-live/pl.a7f376b0f3af4918a722686f5e5bbc23',
        expected:
          'https://embed.music.apple.com/us/playlist/camila-cabello-apple-music-live/pl.a7f376b0f3af4918a722686f5e5bbc23?theme=auto',
        contentType: 'playlist',
      },
      {
        input: 'https://music.apple.com/us/song/shake-it-off/1440913819',
        expected: 'https://embed.music.apple.com/us/song/shake-it-off/1440913819?theme=auto',
        contentType: 'song',
      },
      {
        input: 'https://music.apple.com/us/station/apple-music-1/ra.978194965',
        expected: 'https://embed.music.apple.com/us/station/apple-music-1/ra.978194965?theme=auto',
        contentType: 'station',
      },
    ])('should generate embed URL for $contentType: $input', ({ input, expected, contentType }) => {
      const embedInfo = mod.getEmbedInfo!(input);
      expect(embedInfo).toEqual({
        embedUrl: expected,
        type: 'iframe',
        contentType,
      });
    });

    test.each([
      {
        input: 'https://podcasts.apple.com/us/podcast/the-daily/id1200361736',
        expected: 'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736?theme=auto',
        contentType: 'podcast',
      },
      {
        input: 'https://podcasts.apple.com/us/podcast/the-daily/id1200361736?i=1000123456789',
        expected:
          'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736?i=1000123456789&theme=auto',
        contentType: 'podcastEpisode',
      },
    ])('should generate embed URL for $contentType: $input', ({ input, expected, contentType }) => {
      const embedInfo = mod.getEmbedInfo!(input);
      expect(embedInfo).toEqual({
        embedUrl: expected,
        type: 'iframe',
        contentType,
      });
    });

    test.each([
      {
        url: 'https://embed.music.apple.com/us/artist/taylor-swift/159260351',
        contentType: 'artist',
      },
      {
        url: 'https://embed.music.apple.com/us/album/1989/1440913819',
        contentType: 'album',
      },
      {
        url: 'https://embed.music.apple.com/us/playlist/camila-cabello-apple-music-live/pl.a7f376b0f3af4918a722686f5e5bbc23',
        contentType: 'playlist',
      },
      {
        url: 'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736',
        contentType: 'podcast',
      },
      {
        url: 'https://embed.podcasts.apple.com/us/podcast/the-daily/id1200361736?i=1000123456789',
        contentType: 'podcastEpisode',
      },
    ])('should detect already embed $contentType URL', ({ url, contentType }) => {
      const embedInfo = mod.getEmbedInfo!(url);
      const expectedUrl = url.includes('?') ? `${url}&theme=auto` : `${url}?theme=auto`;
      expect(embedInfo).toEqual({
        embedUrl: expectedUrl,
        // isEmbedAlready: true,
        type: 'iframe',
        contentType,
      });
    });

    test.each([
      'https://google.com',
      'https://music.apple.com/invalid/path',
      'https://podcasts.apple.com/invalid/path',
      'invalid-url',
    ])('should return null for invalid URL: %s', (url) => {
      const embedInfo = mod.getEmbedInfo!(url);
      expect(embedInfo).toBeNull();
    });

    test('preserve existing query parameters', () => {
      const input =
        'https://music.apple.com/us/artist/taylor-swift/159260351?utm_source=twitter&fbclid=abc123';
      const expected =
        'https://embed.music.apple.com/us/artist/taylor-swift/159260351?utm_source=twitter&fbclid=abc123&theme=auto';

      const embedInfo = mod.getEmbedInfo!(input);
      expect(embedInfo).toEqual({
        embedUrl: expected,
        type: 'iframe',
        contentType: 'artist',
      });
    });
  });
});
