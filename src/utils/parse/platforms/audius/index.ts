import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['audius.co'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const usernamePattern = /^[A-Za-z0-9_]{3,30}$/;
const slugPattern = '[a-z0-9-]+';

export const audius: PlatformModule = {
  id: Platforms.Audius,
  name: 'Audius',
  color: '#CC0BFF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: usernamePattern,
    content: {
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{3,30})/(${slugPattern})/?${QUERY_HASH}$`,
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
    const t = this.patterns.content?.track?.exec(url);
    if (t) {
      return {
        username: t[1],
        ids: { trackSlug: t[2] },
        metadata: {
          isTrack: true,
          isAudio: true,
          contentType: 'track',
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
    return `https://audius.co/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'track') return `https://audius.co/${id}`;
    return `https://audius.co/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
