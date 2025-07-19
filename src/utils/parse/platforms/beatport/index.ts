import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['beatport.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const slug = '[A-Za-z0-9-]+';

export const beatport: PlatformModule = {
  id: Platforms.Beatport,
  name: 'Beatport',
  color: '#A6CE38',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/artist/(${slug})/(\\d{1,7})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9-]{3,50}$/,
    content: {
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/track/(${slug})/(\\d{1,7})/?${QUERY_HASH}$`,
        'i',
      ),
      release: new RegExp(
        `^https?://${DOMAIN_PATTERN}/release/(${slug})/(\\d{1,7})/?${QUERY_HASH}$`,
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
    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      return {
        ids: { trackId: tr[2] },
        metadata: {
          isTrack: true,
          isAudio: true,
          contentType: 'track',
        },
      };
    }
    const rel = this.patterns.content?.release?.exec(url);
    if (rel) {
      return {
        ids: { releaseId: rel[2] },
        metadata: {
          contentType: 'release',
        },
      };
    }
    const ar = this.patterns.profile.exec(url);
    if (ar) {
      return {
        username: ar[1],
        userId: ar[2],
        metadata: {
          isProfile: true,
          isArtist: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return /^[A-Za-z0-9-]{3,50}$/.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.beatport.com/artist/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'track') return `https://www.beatport.com/track/slug/${id}`;
    if (type === 'release') return `https://www.beatport.com/release/slug/${id}`;
    return `https://www.beatport.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
