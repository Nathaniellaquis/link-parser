import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['threads.net'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const threads: PlatformModule = {
  id: Platforms.Threads,
  name: 'Threads',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9._]{2,30})/?(?!post/)${QUERY_HASH}$`,
      'i',
    ),
    handle: /^@?[a-zA-Z0-9._]{2,30}$/,
    content: {
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9._]{2,30})/post/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`,
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

  validateHandle(h: string): boolean {
    return /^@?[a-zA-Z0-9._]{2,30}$/i.test(h);
  },

  buildProfileUrl(u: string): string {
    return `https://threads.net/@${u.replace('@', '')}`;
  },

  normalizeUrl(u: string): string {
    return normalize(u);
  },
};
