import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['grailed.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/;
const listingId = '\\d{5,8}';

export const grailed: PlatformModule = {
  id: Platforms.Grailed,
  name: 'Grailed',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
    handle: usernamePattern,
    content: {
      listing: new RegExp(
        `^https?://${DOMAIN_PATTERN}/listings/(${listingId})(?:-[A-Za-z0-9-]+)?/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const l = this.patterns.content?.listing?.exec(url);
    if (l) {
      return {
        ids: { listingId: l[1] },
        metadata: {
          contentType: 'listing',
          isProduct: true,
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
    return `https://www.grailed.com/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'listing') return `https://www.grailed.com/listings/${id}`;
    return `https://www.grailed.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
