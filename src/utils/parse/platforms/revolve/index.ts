import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['revolve.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const revolve: PlatformModule = {
  id: Platforms.Revolve,
  name: 'Revolve',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/brands/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,40}$/,
    content: {
      product: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]+)/dp/([A-Za-z0-9]+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const prod = this.patterns.content?.product?.exec(url);
    if (prod) {
      return {
        ids: {
          productSlug: prod[1],
          productCode: prod[2],
        },
        metadata: {
          isProduct: true,
          contentType: 'product',
        },
      };
    }
    const brand = this.patterns.profile.exec(url);
    if (brand) {
      return {
        username: brand[1],
        metadata: {
          isBrand: true,
          contentType: 'brand',
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

  buildProfileUrl(brand: string): string {
    return `https://revolve.com/brands/${brand}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'product') {
      return `https://revolve.com/${id}`;
    }
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
