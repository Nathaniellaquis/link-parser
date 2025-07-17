import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
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
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.post?.test(url);
  },

  extract(url: string, res: ParsedUrl): void {
    const post = this.patterns.content?.post?.exec(url);
    if (post) {
      res.ids.postId = post[1];
      res.metadata.isPost = true;
      res.metadata.contentType = 'post';
      return;
    }
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      res.username = prof[1];
      res.metadata.isProfile = true;
      res.metadata.contentType = 'profile';
    }
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
