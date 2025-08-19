import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['stockx.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const slugPattern = '[a-z0-9-]+';

export const stockx: PlatformModule = {
  id: Platforms.StockX,
  name: 'StockX',
  color: '#136F63',

  domains: domains,
  subdomains: subdomains,
  domainsRegexp: new RegExp(`^(?:https?://)?${DOMAIN_PATTERN}(/|$)`, 'i'),

  patterns: {
    profile: /^$/, // N/A
    handle: /^$/,
    content: {
      product: new RegExp(`^https?://${DOMAIN_PATTERN}/(${slugPattern})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // const urlLower = url.toLowerCase();
    // return this.domains.some((domain) => urlLower.includes(domain));
    return this.domainsRegexp!.test(url);
  },

  extract(url: string): ExtractedData | null {
    const m = this.patterns.content?.product?.exec(url);
    if (m) {
      return {
        ids: { productSlug: m[1] },
        metadata: {
          contentType: 'product',
          isProduct: true,
        },
      };
    }
    return null;
  },

  validateHandle(): boolean {
    return false;
  },

  buildProfileUrl(): string {
    return 'https://stockx.com/';
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'product') return `https://stockx.com/${id}`;
    return `https://stockx.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
