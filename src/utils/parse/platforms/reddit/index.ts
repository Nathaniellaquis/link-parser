import { PlatformModule, Platforms, ParsedUrl, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['reddit.com', 'redd.it'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains);

export const reddit: PlatformModule = {
  id: Platforms.Reddit,
  name: 'Reddit',
  color: '#FF4500',

  domains: domains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:user|u)/([A-Za-z0-9_-]{3,20})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_-]{3,20}$/,
    content: {
      subreddit: new RegExp(
        `^https?://${DOMAIN_PATTERN}/r/([A-Za-z0-9_]{3,21})/?${QUERY_HASH}$`,
        'i',
      ),
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/r/[A-Za-z0-9_]+/comments/([a-z0-9]{2,})(?:/[^?#]+)?/?${QUERY_HASH}$`,
        'i',
      ),
      shortPost: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-z0-9]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle subreddit URLs
    const subredditMatch = this.patterns.content?.subreddit?.exec(url);
    if (subredditMatch) {
      return {
        ids: { subreddit: subredditMatch[1] },
        metadata: {
          isSubreddit: true,
          contentType: 'subreddit',
        },
      };
    }

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

    // Handle short post URLs
    const shortPostMatch = this.patterns.content?.shortPost?.exec(url);
    if (shortPostMatch) {
      return {
        ids: { postId: shortPostMatch[1] },
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
    const cleaned = handle.replace(/^u\//, '');
    return /^[A-Za-z0-9_-]{3,20}$/.test(cleaned);
  },

  buildProfileUrl(username: string): string {
    return `https://reddit.com/user/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]utm_[^&]+/g, ''));
  },
};
