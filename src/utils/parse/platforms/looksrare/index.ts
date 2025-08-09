import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['looksrare.org'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const looksrare: PlatformModule = {
  id: Platforms.LooksRare,
  name: 'LooksRare',
  color: '#00C5FF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: /^$/,
    handle: /^$/,
    content: {
      token: new RegExp(
        `^https?://${DOMAIN_PATTERN}/collections/(0x[0-9a-fA-F]{40})/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const m = this.patterns.content?.token?.exec(url);
    if (m) {
      return {
        ids: {
          contract: m[1],
          tokenId: m[2],
        },
        metadata: {
          contentType: 'token',
        },
      };
    }
    return null;
  },

  validateHandle(): boolean {
    return false;
  },
  buildProfileUrl(): string {
    return 'https://looksrare.org';
  },
  buildContentUrl(_: string, id: string): string {
    return `https://looksrare.org/collections/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
