import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
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
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const sp = this.patterns.content?.space?.exec(url);
    if (sp) {
      return {
        ids: { modelId: sp[1] },
        metadata: {
          isSpace: true,
          contentType: 'space',
        },
      };
    }
    const usr = this.patterns.profile.exec(url);
    if (usr) {
      return {
        ids: { userId: usr[1] },
        metadata: {
          isProfile: true,
          isUser: true,
          contentType: 'user',
        },
      };
    }
    return null;
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
