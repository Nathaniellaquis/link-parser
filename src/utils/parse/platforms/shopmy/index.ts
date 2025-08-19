import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';
import { createUrlPattern } from '../../utils/pattern';

// Define ShopMy specific content types
export type ShopMyContentType = 'collection' | 'product' | 'storefront';

// Define the config values first
const domains = ['shopmy.us'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const shopmy: PlatformModule = {
  id: Platforms.ShopMy,
  name: 'ShopMy',
  color: '#FF6B6B',

  domains: domains,
  subdomains: subdomains,

  domainsRegexp: new RegExp(`^(?:https?://)?${DOMAIN_PATTERN}(/|$)`, 'i'),

  patterns: {
    profile: new RegExp(
      `^(?:https?://)?${DOMAIN_PATTERN}/(?!collections/)(?!shop/)(?!p/)([A-Za-z0-9_-]{2,})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_-]{2,}$/,
    content: createUrlPattern({
      domainPattern: DOMAIN_PATTERN,
      urlsPatterns: {
        collection: '/collections/(?<collectionId>\\d+)/?',
        collectionPublic: '/collections/public/(?<collectionId>\\d+)/?',
        collectionShop: '/shop/collections/(?<collectionId>\\d+)/?',
        product: '/p/(?<productId>[A-Za-z0-9]{2,})/?',
      },
    }),
  },

  detect(url: string): boolean {
    // Use domainsRegexp to properly handle subdomains
    return this.domainsRegexp!.test(url);
  },

  extract(url: string): ExtractedData | null {
    // Try each content pattern until one matches
    const contentPatterns = this.patterns.content;
    if (!contentPatterns) return null;

    let matchResult: { contentType: string; match: RegExpMatchArray } | null = null;

    // Try each pattern
    for (const [contentType, pattern] of Object.entries(contentPatterns)) {
      if (!pattern) continue;
      const match = pattern.exec(url);
      if (match && match.groups) {
        matchResult = { contentType, match };
        break;
      }
    }

    if (matchResult) {
      const { contentType, match } = matchResult;
      const groups = match.groups!;

      const extractedData: ExtractedData = {
        metadata: {
          contentType,
        },
      };

      // Set content ID and metadata based on content type
      switch (contentType) {
        case 'collection':
        case 'collectionPublic':
        case 'collectionShop':
          extractedData.ids = { collectionId: groups.collectionId };
          extractedData.metadata!.isCollection = true;
          extractedData.metadata!.contentType = 'collection';
          break;
        case 'product':
          extractedData.ids = { productId: groups.productId };
          extractedData.metadata!.isProduct = true;
          break;
      }

      return extractedData;
    }

    // Handle profile URLs (not in content patterns)
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
    return `https://shopmy.us/${username}`;
  },

  buildContentUrl(contentType: ShopMyContentType, id: string): string {
    if (contentType === 'collection') return `https://shopmy.us/collections/${id}`;
    if (contentType === 'product') return `https://shopmy.us/p/${id}`;
    return `https://shopmy.us/collections/${id}`;
  },

  normalizeUrl(url: string): string {
    // Normalize collection URLs by removing /public/ and /shop/ prefixes
    url = url.replace(/\/collections\/public\/(\d+)/g, '/collections/$1');
    url = url.replace(/\/shop\/collections\/(\d+)/g, '/collections/$1');
    return normalize(url);
  },

  getEmbedInfo(url: string) {
    // Extract data to determine content type
    const extractedData = this.extract(url);
    if (!extractedData) {
      return null;
    }

    const { metadata, ids } = extractedData;
    const contentType = metadata?.contentType;

    // Only collections are embeddable on ShopMy
    if (contentType === 'collection' && ids?.collectionId) {
      // ShopMy collections support iframe embedding with specific URL format
      const embedUrl = `https://shopmy.us/collections/embed/${ids.collectionId}`;
      return { embedUrl, type: 'iframe', contentType };
    }

    // Products and storefronts are NOT embeddable
    return null;
  },
};
