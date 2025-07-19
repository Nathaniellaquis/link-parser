import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['tidal.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const tidal: PlatformModule = {
  id: Platforms.Tidal,
  name: 'Tidal',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/artist/(\\d+)/?${QUERY_HASH}$`, 'i'),
    handle: /^\d+$/,
    content: {
      album: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/album/(\\d+)/?${QUERY_HASH}$`, 'i'),
      track: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/track/(\\d+)/?${QUERY_HASH}$`, 'i'),
      playlist: new RegExp(
        `^https?://${DOMAIN_PATTERN}/browse/playlist/([A-Za-z0-9-]{36})/?${QUERY_HASH}$`,
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
    const art = this.patterns.profile.exec(url);
    if (art) {
      return {
        ids: { artistId: art[1] },
        metadata: {
          isProfile: true,
          isArtist: true,
          contentType: 'artist',
        },
      };
    }
    const alb = this.patterns.content?.album?.exec(url);
    if (alb) {
      return {
        ids: { albumId: alb[1] },
        metadata: {
          isAlbum: true,
          contentType: 'album',
        },
      };
    }
    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      return {
        ids: { trackId: tr[1] },
        metadata: {
          isTrack: true,
          isSingle: true,
          contentType: 'track',
        },
      };
    }
    const pl = this.patterns.content?.playlist?.exec(url);
    if (pl) {
      return {
        ids: { playlistId: pl[1] },
        metadata: {
          isPlaylist: true,
          contentType: 'playlist',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(artistId: string): string {
    return `https://tidal.com/browse/artist/${artistId}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
