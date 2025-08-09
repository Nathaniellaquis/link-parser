import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['fanfix.io'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const fanfix: PlatformModule = {
  id: Platforms.Fanfix,
  name: 'Fanfix',
  color: '#FF6F61',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9_.-]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^@?[A-Za-z0-9_.-]{3,30}$/,
    content: {
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/post/(\\d+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        ids: { postId: postMatch[1] },
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

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://fanfix.io/@${username.replace(/^@/, '')}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') return `https://fanfix.io/post/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
