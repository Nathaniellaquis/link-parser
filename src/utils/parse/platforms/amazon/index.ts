import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { getUrlSafe, normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first - include international domains
const domains = [
  'amazon.com',
  'amazon.co.uk',
  'amazon.de',
  'amazon.fr',
  'amazon.it',
  'amazon.es',
  'amazon.ca',
  'amazon.com.au',
  'amazon.co.jp',
  'amazon.in',
  'amazon.com.br',
  'amazon.com.mx',
  'amazon.nl',
  'amazon.se',
  'amazon.pl',
  'amazon.com.tr',
  'amazon.ae',
  'amazon.sg',
  'amazon.sa',
];
const subdomains = ['smile', 'www', 'sellercentral'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const amazon: PlatformModule = {
  id: Platforms.Amazon,
  name: 'Amazon',
  color: '#FF9900',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/shop/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]+$/,
    content: {
      product: new RegExp(`^https?://${DOMAIN_PATTERN}/.+/dp/([A-Z0-9]{10})/?${QUERY_HASH}$`, 'i'),
      productShort: new RegExp(
        `^https?://${DOMAIN_PATTERN}/dp/([A-Z0-9]{10})/?${QUERY_HASH}$`,
        'i',
      ),
      store: new RegExp(
        `^https?://${DOMAIN_PATTERN}/stores/page/([A-Z0-9]{2,})/?${QUERY_HASH}$`,
        'i',
      ),
      review: new RegExp(`^https?://${DOMAIN_PATTERN}/review/(R[A-Z0-9]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // const urlLower = url.toLowerCase();
    // return this.domains.some((domain) => urlLower.includes(domain));
    const urlObj = getUrlSafe(url);

    if (!urlObj) return false;
    if (urlObj.hostname.split('.').length > 2) {
      // we have subdomain
      return urlObj.hostname.includes('.amazon.');
    }
    return urlObj.hostname.startsWith('amazon.');
  },

  extract(url: string): ExtractedData | null {
    // Check for product (with path)
    const productMatch = this.patterns.content?.product?.exec(url);
    if (productMatch) {
      return {
        ids: { productId: productMatch[1] },
        metadata: {
          contentType: 'product',
          isProduct: true,
        },
      };
    }

    // Check for product (short form)
    const productShortMatch = this.patterns.content?.productShort?.exec(url);
    if (productShortMatch) {
      return {
        ids: { productId: productShortMatch[1] },
        metadata: {
          contentType: 'product',
          isProduct: true,
        },
      };
    }

    // Check for store
    const storeMatch = this.patterns.content?.store?.exec(url);
    if (storeMatch) {
      return {
        ids: { storeId: storeMatch[1] },
        metadata: {
          contentType: 'store',
          isStore: true,
        },
      };
    }

    // Check for review
    const reviewMatch = this.patterns.content?.review?.exec(url);
    if (reviewMatch) {
      return {
        ids: { reviewId: reviewMatch[1] },
        metadata: {
          contentType: 'review',
          isReview: true,
        },
      };
    }

    // Check for shop profile
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

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://amazon.com/shop/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    switch (contentType) {
      case 'product':
        return `https://amazon.com/dp/${id}`;
      case 'store':
        return `https://amazon.com/stores/page/${id}`;
      case 'review':
        return `https://amazon.com/review/${id}`;
      default:
        return `https://amazon.com/${contentType}/${id}`;
    }
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/smile\.amazon\.com/, 'amazon.com'));
  },
};
