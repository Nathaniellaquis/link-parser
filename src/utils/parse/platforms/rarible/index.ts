import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['rarible.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const rarible: PlatformModule = {
  id: Platforms.Rarible,
  name: 'Rarible',
  color: '#FADA5E',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/user/([0-9a-fA-Fx]{4,})/?${QUERY_HASH}$`, 'i'),
    handle: /^[0-9a-fA-Fx]{4,}$/,
    content: {
      token: new RegExp(
        `^https?://${DOMAIN_PATTERN}/token/[A-Z]+:([0-9a-fA-Fx]+):([0-9]+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const t = this.patterns.content?.token?.exec(url);
    if (t) {
      return {
        ids: {
          contract: t[1],
          tokenId: t[2],
        },
        metadata: {
          contentType: 'token',
          isProduct: true,
        },
      };
    }
    const u = this.patterns.profile.exec(url);
    if (u) {
      return {
        userId: u[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(h: string): boolean {
    return /^[0-9a-fA-Fx]{4,}$/.test(h);
  },
  buildProfileUrl(addr: string): string {
    return `https://rarible.com/user/${addr}`;
  },
  buildContentUrl(_: string, id: string): string {
    return `https://rarible.com/token/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
