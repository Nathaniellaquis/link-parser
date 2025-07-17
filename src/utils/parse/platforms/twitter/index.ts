import { PlatformModule, Platforms, ParsedUrl, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['twitter.com', 'x.com', 'platform.twitter.com'];
const subdomains = ['m', 'mobile'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const twitter: PlatformModule = {
  id: Platforms.Twitter,
  name: 'Twitter',
  color: '#1DA1F2',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{2,15})/?${QUERY_HASH}$`, 'i'),
    handle: /^@?[A-Za-z0-9_]{1,15}$/,
    content: {
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{2,15})/status/(\\d{10,20})/?${QUERY_HASH}$`,
        'i',
      ),
      embed: new RegExp(
        `^https?://${DOMAIN_PATTERN}/embed/Tweet\\.html\\?id=(\\d{10,20})(?:&.*)?${QUERY_HASH}$`,
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
    // Handle embed URLs
    const embedMatch = this.patterns.content?.embed?.exec(url);
    if (embedMatch) {
      return {
        ids: { tweetId: embedMatch[1] },
        metadata: {
          isEmbed: true,
          contentType: 'embed',
        },
      };
    }

    // Handle post/status URLs
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        username: postMatch[1],
        ids: { tweetId: postMatch[2] },
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
    const cleaned = handle.replace('@', '');
    return /^[A-Za-z0-9_]{1,15}$/.test(cleaned);
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '');
    return `https://x.com/${clean}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') {
      return `https://x.com/i/status/${id}`;
    }
    return `https://x.com/${id}`;
  },

  normalizeUrl(url: string): string {
    url = url.replace('twitter.com', 'x.com');
    url = url.replace(/[?&](s|t|ref_src)=[^&]+/g, '');
    return normalize(url);
  },

  getEmbedInfo(url: string, parsed) {
    if (url.includes('twitframe.com')) {
      return { embedUrl: url, isEmbedAlready: true };
    }
    if (parsed.ids.tweetId) {
      const tweetUrl = this.buildContentUrl
        ? this.buildContentUrl('post', parsed.ids.tweetId)
        : `https://x.com/i/status/${parsed.ids.tweetId}`;
      const embedUrl = `https://twitframe.com/show?url=${encodeURIComponent(tweetUrl)}`;
      return { embedUrl, type: 'iframe' };
    }
    return null;
  },
};
