import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['t.me', 'telegram.me'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const telegram: PlatformModule = {
  id: Platforms.Telegram,
  name: 'Telegram',
  color: '#0088CC',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{5,32})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_]{5,32}$/,
    content: {
      channel: new RegExp(
        `^https?://${DOMAIN_PATTERN}/s/([A-Za-z0-9_]{5,32})/?${QUERY_HASH}$`,
        'i',
      ),
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{5,32})/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      join: new RegExp(
        `^https?://${DOMAIN_PATTERN}/joinchat/([A-Za-z0-9_-]{10,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle join links
    const joinMatch = this.patterns.content?.join?.exec(url);
    if (joinMatch) {
      return {
        ids: { joinCode: joinMatch[1] },
        metadata: {
          isJoin: true,
          contentType: 'join',
        },
      };
    }

    // Handle channel URLs
    const channelMatch = this.patterns.content?.channel?.exec(url);
    if (channelMatch) {
      return {
        ids: { channelName: channelMatch[1] },
        metadata: {
          isChannel: true,
          contentType: 'channel',
        },
      };
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        ids: {
          channelName: postMatch[1],
          postId: postMatch[2],
        },
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
    return this.patterns.handle.test(handle.replace('@', ''));
  },

  buildProfileUrl(username: string): string {
    return `https://t.me/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
