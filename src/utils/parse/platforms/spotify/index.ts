import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url' // Not used - Spotify requires open. subdomain
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['spotify.com'];
const subdomains = ['open'];

// Spotify REQUIRES open.spotify.com - no other subdomain variations allowed
const DOMAIN_PATTERN = 'open\\.spotify\\.com';

export const spotify: PlatformModule = {
  id: Platforms.Spotify,
  name: 'Spotify',
  color: '#1DB954',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/user/([A-Za-z0-9._-]{2,32})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9._-]{2,32}$/,
    content: {
      artist: new RegExp(
        `^https?://${DOMAIN_PATTERN}/artist/([A-Za-z0-9]{20,22})/?${QUERY_HASH}$`,
        'i',
      ),
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/track/([A-Za-z0-9]{20,22})/?${QUERY_HASH}$`,
        'i',
      ),
      album: new RegExp(
        `^https?://${DOMAIN_PATTERN}/album/([A-Za-z0-9]{20,22})/?${QUERY_HASH}$`,
        'i',
      ),
      playlist: new RegExp(
        `^https?://${DOMAIN_PATTERN}/playlist/([A-Za-z0-9]{20,22})/?${QUERY_HASH}$`,
        'i',
      ),
      embed: new RegExp(
        `^https?://${DOMAIN_PATTERN}/embed/(track|album|playlist|artist)/([A-Za-z0-9]{20,22})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // First check if it's a Spotify domain
    if (!this.domains.some((d) => url.includes(d))) return false;

    // Spotify requires open.spotify.com specifically - reject www or bare domain
    if (!url.includes('open.spotify.com')) return false;

    // Check if it matches any valid pattern
    if (this.patterns.content?.embed?.test(url)) return true;
    if (this.patterns.content?.artist?.test(url)) return true;
    if (this.patterns.content?.track?.test(url)) return true;
    if (this.patterns.content?.album?.test(url)) return true;
    if (this.patterns.content?.playlist?.test(url)) return true;
    if (this.patterns.profile.test(url)) return true;

    return false;
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for embed URL first
    const embedMatch = this.patterns.content?.embed?.exec(url);
    if (embedMatch) {
      const [, type, id] = embedMatch;
      result.ids[`${type}Id`] = id;
      result.metadata.contentType = type;
      result.metadata.isEmbed = true;
      return;
    }

    // Check for artist
    const artistMatch = this.patterns.content?.artist?.exec(url);
    if (artistMatch) {
      result.ids.artistId = artistMatch[1];
      result.metadata.contentType = 'artist';
      return;
    }

    // Check for track
    const trackMatch = this.patterns.content?.track?.exec(url);
    if (trackMatch) {
      result.ids.trackId = trackMatch[1];
      result.metadata.contentType = 'track';
      return;
    }

    // Check for album
    const albumMatch = this.patterns.content?.album?.exec(url);
    if (albumMatch) {
      result.ids.albumId = albumMatch[1];
      result.metadata.contentType = 'album';
      return;
    }

    // Check for playlist
    const playlistMatch = this.patterns.content?.playlist?.exec(url);
    if (playlistMatch) {
      result.ids.playlistId = playlistMatch[1];
      result.metadata.contentType = 'playlist';
      return;
    }

    // Check for user profile
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      result.username = profileMatch[1];
      result.metadata.isProfile = true;
      result.metadata.contentType = 'profile';
      return;
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://open.spotify.com/user/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    return `https://open.spotify.com/${contentType}/${id}`;
  },

  generateEmbedUrl(contentType: string, id: string): string {
    return `https://open.spotify.com/embed/${contentType}/${id}`;
  },

  getEmbedInfo(url: string, parsed: ParsedUrl) {
    if (url.includes('/embed/')) {
      return { embedUrl: url, isEmbedAlready: true };
    }
    const types: Array<[string, string | undefined]> = [
      ['track', parsed.ids.trackId],
      ['album', parsed.ids.albumId],
      ['playlist', parsed.ids.playlistId],
      ['artist', parsed.ids.artistId],
    ];
    for (const [type, id] of types) {
      if (id) {
        const embedUrl = this.generateEmbedUrl
          ? this.generateEmbedUrl(type, id)
          : `https://open.spotify.com/embed/${type}/${id}`;
        return { embedUrl, type: 'iframe' };
      }
    }
    return null;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](si|utm_[^&]+)=[^&]+/g, ''));
  },
};
