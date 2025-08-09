import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['wa.me', 'whatsapp.com'];
const subdomains = ['api', 'web', 'chat'];

// Create the domain pattern using the config values
// const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const whatsapp: PlatformModule = {
  id: Platforms.WhatsApp,
  name: 'WhatsApp',
  color: '#25D366',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://wa\\.me/(\\d{6,15})/?${QUERY_HASH}$`, 'i'),
    handle: /^\d{6,15}$/,
    content: {
      group: new RegExp(
        `^https?://(?:chat|whatsapp)\\.whatsapp\\.com/(?:invite/)?([A-Za-z0-9]{20,})/?${QUERY_HASH}$`,
        'i',
      ),
      send: new RegExp(`^https?://api\\.whatsapp\\.com/send\\?phone=(\\d{6,15})${QUERY_HASH}`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const phoneMatch = this.patterns.profile.exec(url) || this.patterns.content?.send?.exec(url);
    if (phoneMatch) {
      return {
        userId: phoneMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    const groupMatch = this.patterns.content?.group?.exec(url);
    if (groupMatch) {
      return {
        ids: { groupInviteCode: groupMatch[1] },
        metadata: {
          isGroupInvite: true,
          contentType: 'group',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return /^\d{6,15}$/.test(handle);
  },

  buildProfileUrl(phone: string): string {
    return `https://wa.me/${phone.replace(/\D/g, '')}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'group') return `https://chat.whatsapp.com/${id}`;
    return `https://wa.me/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
