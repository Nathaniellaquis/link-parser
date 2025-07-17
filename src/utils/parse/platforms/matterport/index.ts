import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['matterport.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const matterport: PlatformModule = {
  id: Platforms.Matterport,
  name: 'Matterport',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/users/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9]+$/,
    content: {
      space: new RegExp(`^https?://${DOMAIN_PATTERN}/show/\\?m=([A-Za-z0-9]+)${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.space?.test(url);
  },

  extract(url: string, res: ParsedUrl): void {
    const sp = this.patterns.content?.space?.exec(url);
    if (sp) {
      res.ids.modelId = sp[1];
      res.metadata.isSpace = true;
      res.metadata.contentType = 'space';
      return;
    }
    const usr = this.patterns.profile.exec(url);
    if (usr) {
      res.ids.userId = usr[1];
      res.metadata.isUser = true;
      res.metadata.contentType = 'user';
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(id: string): string {
    return `https://matterport.com/users/${id}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'space') return `https://matterport.com/show/?m=${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
