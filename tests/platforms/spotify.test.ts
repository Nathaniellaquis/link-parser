import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Spotify;
const mod = registry.get(id)!;

describe('Spotify platform tests', () => {
  const samples = {
    artist: 'https://open.spotify.com/artist/1234567890abcdefghij',
    track: 'https://open.spotify.com/track/1234567890abcdefghij',
    album: 'https://open.spotify.com/album/1234567890abcdefghij',
    playlist: 'https://open.spotify.com/playlist/1234567890abcdefghij',
    show: 'https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk',
    episode: 'https://open.spotify.com/episode/7vGNNrTk7c9jTqUoH4Gf6n',
    user: 'https://open.spotify.com/user/sampleuser',
    embed: 'https://open.spotify.com/embed/track/1234567890abcdefghij',
    embedShow: 'https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk',
    shortUrl: 'https://spotify.link/abc123xyz',
  };

  describe('detection', () => {
    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {
      expect(mod.detect(url)).toBe(true);
    });

    test.each(['https://example.com/test', 'https://google.com', 'not-a-url'])(
      'should not detect non-Spotify URL: %s',
      (url) => {
        expect(mod.detect(url)).toBe(false);
      },
    );
  });

  describe('parsing', () => {
    test('should parse artist: https://open.spotify.com/artist/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/artist/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/artist/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.artistId).toBe('1234567890abcdefghij');
      expect(result.metadata.contentType).toBe('artist');
      expect(result.metadata.isArtist).toBe(true);

      // Negative: invalid artist id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/artist/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.artistId).toBeUndefined();
    });

    test('should parse track: https://open.spotify.com/track/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/track/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/track/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.trackId).toBe('1234567890abcdefghij');
      expect(result.metadata.contentType).toBe('track');
      expect(result.metadata.isTrack).toBe(true);

      // Negative: invalid track id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/track/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.trackId).toBeUndefined();
    });

    test('should parse album: https://open.spotify.com/album/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/album/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/album/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.albumId).toBe('1234567890abcdefghij');
      expect(result.metadata.contentType).toBe('album');
      expect(result.metadata.isAlbum).toBe(true);

      // Negative: invalid album id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/album/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.albumId).toBeUndefined();
    });

    test('should parse playlist: https://open.spotify.com/playlist/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/playlist/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/playlist/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.playlistId).toBe('1234567890abcdefghij');
      expect(result.metadata.contentType).toBe('playlist');
      expect(result.metadata.isPlaylist).toBe(true);

      // Negative: invalid playlist id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/playlist/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.playlistId).toBeUndefined();
    });

    test('should parse podcast show: https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk', () => {
      const result = parse('https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk');
      // Platform-specific assertions
      expect(result.ids.showId).toBe('4rOoJ6Egrf8K2IrywzwOMk');
      expect(result.metadata.contentType).toBe('show');
      expect(result.metadata.isPodcast).toBe(true);

      // Negative: invalid show id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/show/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.showId).toBeUndefined();
    });

    test('should parse podcast episode: https://open.spotify.com/episode/7vGNNrTk7c9jTqUoH4Gf6n', () => {
      const result = parse('https://open.spotify.com/episode/7vGNNrTk7c9jTqUoH4Gf6n');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/episode/7vGNNrTk7c9jTqUoH4Gf6n');
      // Platform-specific assertions
      expect(result.ids.episodeId).toBe('7vGNNrTk7c9jTqUoH4Gf6n');
      expect(result.metadata.contentType).toBe('episode');
      expect(result.metadata.isPodcastEpisode).toBe(true);

      // Negative: invalid episode id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/episode/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.episodeId).toBeUndefined();
    });

    test('should parse user: https://open.spotify.com/user/sampleuser', () => {
      const result = parse('https://open.spotify.com/user/sampleuser');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/user/sampleuser');
      // Platform-specific assertions
      expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);
      expect(result.metadata.contentType).toBe('profile');

      // Negative: invalid username (contains spaces)
      const invalid = parse('https://open.spotify.com/user/invalid user');
      expect(invalid.isValid).toBe(false);
      expect(invalid.username).toBeUndefined();
    });

    test('should parse embed: https://open.spotify.com/embed/track/1234567890abcdefghij', () => {
      const result = parse('https://open.spotify.com/embed/track/1234567890abcdefghij');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/embed/track/1234567890abcdefghij');
      // Platform-specific assertions
      expect(result.ids.trackId).toBe('1234567890abcdefghij');
      expect(result.metadata.contentType).toBe('track');
      expect(result.metadata.isEmbed).toBe(true);
      expect(result.metadata.isTrack).toBe(true);
      expect(result.embedData?.embedUrl).toContain('1234567890abcdefghij');

      // Negative: invalid embed id (contains invalid characters)
      const invalid = parse('https://open.spotify.com/embed/track/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.embedData).toBeUndefined();
    });

    test('should parse embed show: https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk', () => {
      const result = parse('https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk');
      // Platform-specific assertions
      expect(result.ids.showId).toBe('4rOoJ6Egrf8K2IrywzwOMk');
      expect(result.metadata.contentType).toBe('show');
      expect(result.metadata.isEmbed).toBe(true);
      expect(result.metadata.isPodcast).toBe(true);
      expect(result.embedData?.embedUrl).toContain('4rOoJ6Egrf8K2IrywzwOMk');
    });

    test('should handle short IDs now that length restrictions are removed', () => {
      // These should now work since we removed length restrictions
      const shortTrack = parse('https://open.spotify.com/track/abc');
      expect(shortTrack.isValid).toBe(true);
      expect(shortTrack.ids.trackId).toBe('abc');

      const shortArtist = parse('https://open.spotify.com/artist/xyz');
      expect(shortArtist.isValid).toBe(true);
      expect(shortArtist.ids.artistId).toBe('xyz');
    });

    test('should parse Spotify short URL: https://spotify.link/abc123xyz', () => {
      const result = parse('https://spotify.link/abc123xyz');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('https://spotify.link/abc123xyz');
      // Platform-specific assertions
      expect(result.ids.shortId).toBe('abc123xyz');
      expect(result.metadata.contentType).toBe('shortLink');
      expect(result.metadata.isShortUrl).toBe(true);

      // Negative: invalid short ID (contains invalid characters)
      const invalid = parse('https://spotify.link/invalid@chars!');
      expect(invalid.isValid).toBe(false);
      expect(invalid.ids.shortId).toBeUndefined();
    });
  });

  describe('embed functionality', () => {
    test('should generate embed info for tracks', () => {
      const embedInfo = mod.getEmbedInfo?.('https://open.spotify.com/track/1234567890abcdefghij');
      expect(embedInfo).toBeDefined();
      expect(embedInfo?.embedUrl).toBe('https://open.spotify.com/embed/track/1234567890abcdefghij');
      expect(embedInfo?.type).toBe('iframe');
    });

    test('should generate embed info for podcast shows', () => {
      const embedInfo = mod.getEmbedInfo?.('https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk');
      expect(embedInfo).toBeDefined();
      expect(embedInfo?.embedUrl).toBe(
        'https://open.spotify.com/embed/show/4rOoJ6Egrf8K2IrywzwOMk',
      );
      expect(embedInfo?.type).toBe('iframe');
    });

    test('should generate embed info for podcast episodes', () => {
      const embedInfo = mod.getEmbedInfo?.(
        'https://open.spotify.com/episode/7vGNNrTk7c9jTqUoH4Gf6n',
      );
      expect(embedInfo).toBeDefined();
      expect(embedInfo?.embedUrl).toBe(
        'https://open.spotify.com/embed/episode/7vGNNrTk7c9jTqUoH4Gf6n',
      );
      expect(embedInfo?.type).toBe('iframe');
    });

    test('should return null for user profiles (not embeddable)', () => {
      const embedInfo = mod.getEmbedInfo?.('https://open.spotify.com/user/sampleuser');
      expect(embedInfo).toBeNull();
    });

    test('should handle existing embed URLs', () => {
      const embedInfo = mod.getEmbedInfo?.(
        'https://open.spotify.com/embed/track/1234567890abcdefghij',
      );
      expect(embedInfo).toBeDefined();
      expect(embedInfo?.embedUrl).toBe('https://open.spotify.com/embed/track/1234567890abcdefghij');
      expect(embedInfo?.isEmbedAlready).toBe(true);
    });

    test('should return null for short URLs in sync getEmbedInfo', () => {
      // Short URLs should return null in sync method since they need async resolution
      const embedInfo = mod.getEmbedInfo?.('https://spotify.link/abc123xyz');
      expect(embedInfo).toBeNull();
    });
  });

  describe('async functionality', () => {
    test('should have getEmbedInfoAsync method', () => {
      expect(typeof mod.getEmbedInfoAsync).toBe('function');
    });

    test('should handle async embed info for resolved short URLs with resolveShortUrl option', async () => {
      // Mock resolver function that returns a Spotify track URL
      const mockResolveShortUrl = jest
        .fn()
        .mockResolvedValue('https://open.spotify.com/track/1234567890abcdefghij');

      const result = await mod.getEmbedInfoAsync?.('https://spotify.link/abc123xyz', {
        resolveShortUrl: mockResolveShortUrl,
      });

      expect(mockResolveShortUrl).toHaveBeenCalledWith('https://spotify.link/abc123xyz');
      expect(result).toBeDefined();
      expect(result?.embedUrl).toBe('https://open.spotify.com/embed/track/1234567890abcdefghij');
      expect(result?.type).toBe('iframe');
    });

    test('should fall back to sync method for non-short URLs', async () => {
      const result = await mod.getEmbedInfoAsync?.(
        'https://open.spotify.com/track/1234567890abcdefghij',
      );
      expect(result).toBeDefined();
      expect(result?.embedUrl).toBe('https://open.spotify.com/embed/track/1234567890abcdefghij');
    });

    test('should return null if short URL resolver is not provided', async () => {
      const result = await mod.getEmbedInfoAsync?.('https://spotify.link/abc123xyz');
      expect(result).toBeNull();
    });
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('testuser');
        expect(profileUrl).toBeTruthy();
        expect(mod.detect(profileUrl)).toBe(true);
      });
    }
  });

  describe('URL normalization', () => {
    if (mod.normalizeUrl) {
      test.each(Object.entries(samples))('should normalize %s URL', (_, url) => {
        const normalized = mod.normalizeUrl!(url);
        expect(normalized).toBeTruthy();
        expect(typeof normalized).toBe('string');
      });
    }
  });
});
