import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['shopmy.us'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const shopmy: PlatformModule = {
  id: Platforms.ShopMy,
  name: 'ShopMy',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?!collections/)(?!p/)([A-Za-z0-9_-]{2,})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_-]{2,}$/,
    content: {
      collection: new RegExp(`^https?://${DOMAIN_PATTERN}/collections/(\\d+)/?${QUERY_HASH}$`, 'i'),
      product: new RegExp(`^https?://${DOMAIN_PATTERN}/p/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle collection URLs first
    const collectionMatch = this.patterns.content?.collection?.exec(url);
    if (collectionMatch) {
      return {
        ids: { collectionId: collectionMatch[1] },
        metadata: {
          isCollection: true,
          contentType: 'collection',
        },
      };
    }

    // Handle product URLs
    const productMatch = this.patterns.content?.product?.exec(url);
    if (productMatch) {
      return {
        ids: { productId: productMatch[1] },
        metadata: {
          isProduct: true,
          contentType: 'product',
        },
      };
    }

    // Handle profile URLs
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        username: profileMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'storefront',
        },
      };
    }

    return null;
  },

  validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{2,}$/.test(h),
  buildProfileUrl: (username: string): string => `https://shopmy.us/${username}`,
  normalizeUrl: (u: string): string => normalize(u),
};
