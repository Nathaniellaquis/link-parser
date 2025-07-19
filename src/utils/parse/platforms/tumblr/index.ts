import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['tumblr.com'];
const subdomains: string[] = [];

// Note: DOMAIN_PATTERN not used for Tumblr due to complex dual URL format requirements

export const tumblr: PlatformModule = {
  id: Platforms.Tumblr,
  name: 'Tumblr',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Subdomain format: https://username.tumblr.com
    profile: new RegExp(`^https?://([a-zA-Z0-9-]{3,})\\.tumblr\\.com/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9-]{3,}$/,
    content: {
      // Subdomain post format: https://username.tumblr.com/post/123456789/optional-title
      post: new RegExp(
        `^https?://([a-zA-Z0-9-]+)\\.tumblr\\.com/post/(\\d+)(?:/[^?#]*)?/?${QUERY_HASH}$`,
        'i',
      ),
      // Path format: https://tumblr.com/username
      profileBlog: new RegExp(
        `^https?://(?:www\\.)?tumblr\\.com/([a-zA-Z0-9-]{3,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle post URLs first
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        username: postMatch[1],
        ids: { postId: postMatch[2] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
    }

    // Handle subdomain profile URLs
    const subdomainMatch = this.patterns.profile.exec(url);
    if (subdomainMatch) {
      return {
        username: subdomainMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    // Handle path profile URLs: https://tumblr.com/username
    const pathMatch = this.patterns.content?.profileBlog?.exec(url);
    if (pathMatch) {
      return {
        username: pathMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    return null;
  },

  validateHandle(h: string): boolean {
    return /^[a-zA-Z0-9-]{3,}$/.test(h);
  },

  buildProfileUrl(u: string): string {
    return `https://${u}.tumblr.com`;
  },

  normalizeUrl(u: string): string {
    return normalize(u);
  },
};
