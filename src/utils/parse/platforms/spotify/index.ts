import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
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
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Check for embed URL first
    const embedMatch = this.patterns.content?.embed?.exec(url);
    if (embedMatch) {
      const [, type, id] = embedMatch;
      return {
        ids: { [`${type}Id`]: id },
        metadata: {
          contentType: type,
          isEmbed: true,
        },
      };
    }

    // Check for artist
    const artistMatch = this.patterns.content?.artist?.exec(url);
    if (artistMatch) {
      return {
        ids: { artistId: artistMatch[1] },
        metadata: {
          isArtist: true,
          contentType: 'artist',
        },
      };
    }

    // Check for track
    const trackMatch = this.patterns.content?.track?.exec(url);
    if (trackMatch) {
      return {
        ids: { trackId: trackMatch[1] },
        metadata: {
          isTrack: true,
          contentType: 'track',
        },
      };
    }

    // Check for album
    const albumMatch = this.patterns.content?.album?.exec(url);
    if (albumMatch) {
      return {
        ids: { albumId: albumMatch[1] },
        metadata: {
          isAlbum: true,
          contentType: 'album',
        },
      };
    }

    // Check for playlist
    const playlistMatch = this.patterns.content?.playlist?.exec(url);
    if (playlistMatch) {
      return {
        ids: { playlistId: playlistMatch[1] },
        metadata: {
          isPlaylist: true,
          contentType: 'playlist',
        },
      };
    }

    // Check for user profile
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        username: profileMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    return null;
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

  getEmbedInfo(url: string) {
    if (url.includes('/embed/')) {
      return { embedUrl: url, isEmbedAlready: true };
    }

    // Extract data to determine content type and ID
    const extractedData = this.extract(url);
    if (!extractedData || !extractedData.ids) {
      return null;
    }

    const types: Array<[string, string | undefined]> = [
      ['track', extractedData.ids.trackId],
      ['album', extractedData.ids.albumId],
      ['playlist', extractedData.ids.playlistId],
      ['artist', extractedData.ids.artistId],
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
