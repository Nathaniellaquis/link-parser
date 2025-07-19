import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['aliexpress.com', 'aliexpress.us', 'aliexpress.ru'];
const subdomains = ['m'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const aliexpress: PlatformModule = {
  id: Platforms.AliExpress,
  name: 'AliExpress',
  color: '#FF4747',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/store/(\\d+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9_-]+$/,
    content: {
      item: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:item|i)/(\\d+)(?:\\.html)?/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        ids: { storeId: profileMatch[1] },
        metadata: {
          isProfile: true,
          isStore: true,
          contentType: 'store',
        },
      };
    }

    const itemMatch = this.patterns.content?.item?.exec(url);
    if (itemMatch) {
      return {
        ids: { productId: itemMatch[1] },
        metadata: {
          contentType: 'product',
          isProduct: true,
        },
      };
    }

    return null;
  },

  validateHandle(h: string): boolean {
    return this.patterns.handle.test(h);
  },
  buildProfileUrl(storeId: string): string {
    return `https://www.aliexpress.com/store/${storeId}`;
  },
  buildContentUrl(_t: string, id: string): string {
    return `https://www.aliexpress.com/item/${id}.html`;
  },
  normalizeUrl(url: string): string {
    return url;
  },
};
