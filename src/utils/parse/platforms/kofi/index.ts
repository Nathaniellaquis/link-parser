import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['ko-fi.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const kofi: PlatformModule = {
  id: Platforms.KoFi,
  name: 'Ko-fi',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Profile pattern should NOT allow trailing slash - use negative lookahead
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,})(?!/)${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{2,}$/,
    content: {
      shop: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]+)/shop/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/post/([A-Za-z0-9-]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle post URLs first
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        ids: { postId: postMatch[1] },
        metadata: {
          contentType: 'post',
        },
      };
    }

    // Handle shop URLs
    const shopMatch = this.patterns.content?.shop?.exec(url);
    if (shopMatch) {
      return {
        username: shopMatch[1],
        ids: { shop: 'shop' },
        metadata: {
          contentType: 'shop',
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
          contentType: 'profile',
        },
      };
    }

    return null;
  },

  validateHandle: (h: string): boolean => /^[A-Za-z0-9_-]{2,}$/.test(h),
  buildProfileUrl: (u: string): string => `https://ko-fi.com/${u}`,
  normalizeUrl: (u: string): string => normalize(u),
};
