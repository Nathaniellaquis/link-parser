import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['audiomack.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const audiomack: PlatformModule = {
  id: Platforms.Audiomack,
  name: 'Audiomack',
  color: '#ff8800',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-z0-9_-]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-z0-9_-]{3,30}$/i,
    content: {
      song: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-z0-9_-]{3,30})/song/([a-z0-9_-]{3,120})/?${QUERY_HASH}$`,
        'i',
      ),
      album: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-z0-9_-]{3,30})/album/([a-z0-9_-]{3,120})/?${QUERY_HASH}$`,
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
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      return {
        username: prof[1],
        metadata: {
          isProfile: true,
          isArtist: true,
          contentType: 'artist',
        },
      };
    }

    const song = this.patterns.content?.song?.exec(url);
    if (song) {
      return {
        username: song[1],
        ids: { trackSlug: song[2] },
        metadata: {
          isTrack: true,
          isSingle: true,
          contentType: 'track',
        },
      };
    }

    const album = this.patterns.content?.album?.exec(url);
    if (album) {
      return {
        username: album[1],
        ids: { albumSlug: album[2] },
        metadata: {
          isAlbum: true,
          contentType: 'album',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(handle: string): string {
    return `https://audiomack.com/${handle}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
