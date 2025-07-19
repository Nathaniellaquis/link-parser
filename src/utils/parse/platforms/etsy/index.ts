import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['etsy.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const shopPattern = /^[A-Za-z0-9][A-Za-z0-9-]{1,30}$/;
const listingId = '\\d{9,12}';

export const etsy: PlatformModule = {
  id: Platforms.Etsy,
  name: 'Etsy',
  color: '#F56400',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/shop/([A-Za-z0-9-]{2,32})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: shopPattern,
    content: {
      listing: new RegExp(
        `^https?://${DOMAIN_PATTERN}/listing/(${listingId})(?:/[A-Za-z0-9-]+)?/?${QUERY_HASH}$`,
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
    const s = this.patterns.profile.exec(url);
    if (s) {
      return {
        username: s[1],
        metadata: {
          isProfile: true,
          contentType: 'shop',
          isStore: true,
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return shopPattern.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.etsy.com/shop/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'listing') return `https://www.etsy.com/listing/${id}`;
    return `https://www.etsy.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
