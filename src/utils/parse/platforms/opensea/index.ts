import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['opensea.io'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const opensea: PlatformModule = {
  id: Platforms.OpenSea,
  name: 'OpenSea',
  color: '#2081E2',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,40})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_.-]{3,40}$/,
    content: {
      collection: new RegExp(
        `^https?://${DOMAIN_PATTERN}/collection/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      asset: new RegExp(
        `^https?://${DOMAIN_PATTERN}/assets/([^/]+)/([^/]+)/([^/]+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const asset = this.patterns.content?.asset?.exec(url);
    if (asset) {
      return {
        ids: {
          chain: asset[1],
          contract: asset[2],
          tokenId: asset[3],
        },
        metadata: {
          isAsset: true,
          contentType: 'asset',
          isProduct: true,
        },
      };
    }
    const col = this.patterns.content?.collection?.exec(url);
    if (col) {
      return {
        ids: {
          collectionName: col[1],
        },
        metadata: {
          isCollection: true,
          contentType: 'collection',
        },
      };
    }
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      const username = prof[1];
      // Reject reserved/invalid paths
      const reserved = [
        'invalid',
        'assets',
        'collection',
        'collections',
        'explore',
        'rankings',
        'activity',
        'blog',
        'learn',
        'stats',
      ];
      if (reserved.includes(username.toLowerCase())) {
        return null;
      }
      return {
        username: username,
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://opensea.io/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'collection') return `https://opensea.io/collection/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
