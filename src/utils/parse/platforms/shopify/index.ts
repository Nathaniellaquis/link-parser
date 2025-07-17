import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['myshopify.com'];
// Universal subdomain support for any shopify store name
const subdomains = ['*'];

// Create the domain pattern using the config values
// const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const shopify: PlatformModule = {
  id: Platforms.Shopify,
  name: 'Shopify Store',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Note: Shopify patterns need to capture specific subdomain names (store names), so we can't use DOMAIN_PATTERN directly
    // Each pattern captures the store name from the subdomain
    profile: new RegExp(`^https?://([a-z0-9-]+)\\.myshopify\\.com/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-z0-9-]+$/i,
    content: {
      product: new RegExp(
        `^https?://([a-z0-9-]+)\\.myshopify\\.com/products/([a-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      collection: new RegExp(
        `^https?://([a-z0-9-]+)\\.myshopify\\.com/collections/([a-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      page: new RegExp(
        `^https?://([a-z0-9-]+)\\.myshopify\\.com/pages/([a-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle product URLs
    const productMatch = this.patterns.content?.product?.exec(url);
    if (productMatch) {
      return {
        ids: {
          storeName: productMatch[1],
          productHandle: productMatch[2],
        },
        metadata: {
          isProduct: true,
          contentType: 'product',
        },
      };
    }

    // Handle collection URLs
    const collectionMatch = this.patterns.content?.collection?.exec(url);
    if (collectionMatch) {
      return {
        ids: {
          storeName: collectionMatch[1],
          collectionName: collectionMatch[2],
        },
        metadata: {
          isCollection: true,
          contentType: 'collection',
        },
      };
    }

    // Handle page URLs
    const pageMatch = this.patterns.content?.page?.exec(url);
    if (pageMatch) {
      return {
        ids: {
          storeName: pageMatch[1],
          pageSlug: pageMatch[2],
        },
        metadata: {
          isPage: true,
          contentType: 'page',
        },
      };
    }

    // Handle store URLs
    const storeMatch = this.patterns.profile.exec(url);
    if (storeMatch) {
      return {
        ids: {
          storeName: storeMatch[1],
        },
        metadata: {
          isProfile: true,
          contentType: 'storefront',
        },
      };
    }

    return null;
  },

  validateHandle(h: string): boolean {
    return /^[a-z0-9-]+$/i.test(h);
  },
  buildProfileUrl(u: string): string {
    return `https://${u}.myshopify.com`;
  },
  normalizeUrl(u: string): string {
    return normalize(u);
  },
};
