import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['bandlab.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/;

export const bandlab: PlatformModule = {
  id: Platforms.BandLab,
  name: 'BandLab',
  color: '#DC2027',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
    handle: usernamePattern,
    content: {
      song: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`,
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
    const s = this.patterns.content?.song?.exec(url);
    if (s) {
      return {
        username: s[1],
        ids: { songSlug: s[2] },
        metadata: {
          isTrack: true,
          isAudio: true,
          contentType: 'song',
        },
      };
    }
    const p = this.patterns.profile.exec(url);
    if (p) {
      return {
        username: p[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return usernamePattern.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.bandlab.com/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'song') return `https://www.bandlab.com/${id}`;
    return `https://www.bandlab.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
