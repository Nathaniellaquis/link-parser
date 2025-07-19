import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['medium.com'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains);

const hexId = '[a-f0-9]{12}';

export const medium: PlatformModule = {
  id: Platforms.Medium,
  name: 'Medium',
  color: '#000000',

  domains: domains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9_-]{2,25})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{2,25}$/,
    content: {
      profileUid: new RegExp(`^https?://${DOMAIN_PATTERN}/u/(${hexId})/?${QUERY_HASH}$`, 'i'),
      profileSubdomain: new RegExp(`^https?://([A-Za-z0-9-]+)\\.medium\\.com/?${QUERY_HASH}$`, 'i'),
      postUser: new RegExp(
        `^https?://${DOMAIN_PATTERN}/@[A-Za-z0-9_-]+/([a-z0-9-]+-${hexId})/?${QUERY_HASH}$`,
        'i',
      ),
      postP: new RegExp(`^https?://${DOMAIN_PATTERN}/p/(${hexId})/?${QUERY_HASH}$`, 'i'),
      postSubdomain: new RegExp(
        `^https?://([A-Za-z0-9-]+)\\.medium\\.com/([a-z0-9-]+-${hexId})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return urlLower.includes('medium.com');
  },

  extract(url: string): ExtractedData | null {
    // posts first
    const postUserMatch = this.patterns.content?.postUser?.exec(url);
    if (postUserMatch) {
      return {
        ids: { postSlug: postUserMatch[1] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
    }

    const postPMatch = this.patterns.content?.postP?.exec(url);
    if (postPMatch) {
      return {
        ids: { postSlug: postPMatch[1] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
    }

    const postSubdomainMatch = this.patterns.content?.postSubdomain?.exec(url);
    if (postSubdomainMatch) {
      return {
        ids: { postSlug: postSubdomainMatch[2] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
    }

    // profiles
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

    const profileUidMatch = this.patterns.content?.profileUid?.exec(url);
    if (profileUidMatch) {
      return {
        userId: profileUidMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    const profileSubdomainMatch = this.patterns.content?.profileSubdomain?.exec(url);
    if (profileSubdomainMatch) {
      return {
        username: profileSubdomainMatch[1],
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
    return `https://medium.com/@${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') {
      return `https://medium.com/p/${id}`;
    }
    return `https://medium.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](source|utm_[^&]+)=[^&]+/g, ''));
  },
};
