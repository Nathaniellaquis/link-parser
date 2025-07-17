import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['vk.com'];
const subdomains = ['m', 'new'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

// Username: letters, digits, dot, underscore, 5-32 chars (VK rules are looser, but this is safe)
const usernamePattern = /^[a-zA-Z0-9_.]{3,32}$/;
const numericIdPattern = /^id\d{1,15}$/;

export const vk: PlatformModule = {
  id: Platforms.VKontakte,
  name: 'VK',
  color: '#4C75A3',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:([a-zA-Z0-9_.]{3,32})|(id\\d{1,15}))(?:/)?/?${QUERY_HASH}$`,
      'i',
    ),
    handle: usernamePattern,
    content: {
      post: new RegExp(`^https?://${DOMAIN_PATTERN}/(wall-?\\d+_\\d+)/?${QUERY_HASH}$`, 'i'),
      postQuery: new RegExp(
        `^https?://${DOMAIN_PATTERN}/[^?]+\\?w=(wall-?\\d+_\\d+)${QUERY_HASH}`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.post?.test(url) ||
      !!this.patterns.content?.postQuery?.test(url)
    );
  },

  extract(url: string, result: ParsedUrl): void {
    // Posts first
    const pMatch =
      this.patterns.content?.post?.exec(url) || this.patterns.content?.postQuery?.exec(url);
    if (pMatch) {
      result.ids.postId = pMatch[1];
      result.metadata.isPost = true;
      result.metadata.contentType = 'post';
      return;
    }

    // Profiles
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      result.username = prof[1] || prof[2];
      result.metadata.isProfile = true;
      result.metadata.contentType = 'profile';
    }
  },

  validateHandle(handle: string): boolean {
    return usernamePattern.test(handle) || numericIdPattern.test(handle);
  },

  buildProfileUrl(handle: string): string {
    return `https://vk.com/${handle}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'post') return `https://vk.com/wall${id}`;
    return `https://vk.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
