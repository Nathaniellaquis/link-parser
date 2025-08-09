import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['deezer.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const LOCALE = '(?:[a-z]{2}(?:-[a-z]{2})?)';

export const deezer: PlatformModule = {
  id: Platforms.Deezer,
  name: 'Deezer',
  color: '#EF5466',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?artist/(\\d+)/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^\d+$/, // artist id numeric
    content: {
      album: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?album/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?track/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      playlist: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?playlist/(\\d+)/?${QUERY_HASH}$`,
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
    const artist = this.patterns.profile.exec(url);
    if (artist) {
      return {
        ids: { artistId: artist[1] },
        metadata: {
          contentType: 'artist',
          isProfile: true,
          isArtist: true,
        },
      };
    }
    const alb = this.patterns.content?.album?.exec(url);
    if (alb) {
      return {
        ids: { albumId: alb[1] },
        metadata: {
          contentType: 'album',
          isAlbum: true,
        },
      };
    }
    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      return {
        ids: { trackId: tr[1] },
        metadata: {
          contentType: 'track',
          isTrack: true,
          isSingle: true,
        },
      };
    }
    const pl = this.patterns.content?.playlist?.exec(url);
    if (pl) {
      return {
        ids: { playlistId: pl[1] },
        metadata: {
          contentType: 'playlist',
          isPlaylist: true,
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(artistId: string): string {
    return `https://deezer.com/artist/${artistId}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
