import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['substack.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const substack: PlatformModule = {
  id: Platforms.Substack,
  name: 'Substack',
  color: '#FF6719',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://([a-z0-9-]{2,})\\.substack\\.com/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-z0-9-]{2,}$/i,
    content: {
      post: new RegExp(
        `^https?://([a-z0-9-]{2,})\\.substack\\.com/p/([a-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      profileNew: new RegExp(`^https?://${DOMAIN_PATTERN}/@([a-z0-9-]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return urlLower.includes('substack.com');
  },

  extract(url: string): ExtractedData | null {
    // Check for new profile format
    const profileNewMatch = this.patterns.content?.profileNew?.exec(url);
    if (profileNewMatch) {
      return {
        username: profileNewMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'newsletter',
        },
      };
    }

    // Check for post
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        username: postMatch[1],
        ids: { postSlug: postMatch[2] },
        metadata: {
          isArticle: true,
          contentType: 'post',
        },
      };
    }

    // Check for old profile format
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        username: profileMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'newsletter',
        },
      };
    }

    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://${username}.substack.com`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') {
      return `https://substack.com/p/${id}`;
    }
    return `https://substack.com/${contentType}/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
