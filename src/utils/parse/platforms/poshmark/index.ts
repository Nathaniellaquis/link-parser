import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['poshmark.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const poshmark: PlatformModule = {
  id: Platforms.Poshmark,
  name: 'Poshmark',
  color: '#C03838',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/closet/([A-Za-z0-9_.-]{3,40})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_.-]{3,40}$/,
    content: {
      listing: new RegExp(
        `^https?://${DOMAIN_PATTERN}/listing/([A-Za-z0-9_-]+)-(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const lst = this.patterns.content?.listing?.exec(url);
    if (lst) {
      return {
        ids: {
          listingSlug: lst[1],
          listingId: lst[2],
        },
        metadata: {
          isListing: true,
          contentType: 'listing',
          isProduct: true,
        },
      };
    }
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      return {
        username: prof[1],
        metadata: {
          isCloset: true,
          contentType: 'closet',
          isProfile: true,
          isStore: true,
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://poshmark.com/closet/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'listing') return `https://poshmark.com/listing/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
