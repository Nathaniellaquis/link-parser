import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['etherscan.io'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const etherscan: PlatformModule = {
  id: Platforms.Etherscan,
  name: 'Etherscan',
  color: '#21325B',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/address/(0x[0-9a-fA-F]{40})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^0x[0-9a-fA-F]{40}$/,
    content: {
      tx: new RegExp(`^https?://${DOMAIN_PATTERN}/tx/(0x[0-9a-fA-F]{64})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const t = this.patterns.content?.tx?.exec(url);
    if (t) {
      return {
        ids: { transactionHash: t[1] },
        metadata: {
          contentType: 'transaction',
        },
      };
    }
    const a = this.patterns.profile.exec(url);
    if (a) {
      return {
        userId: a[1],
        metadata: {
          contentType: 'address',
        },
      };
    }
    return null;
  },

  validateHandle(h: string): boolean {
    return /^0x[0-9a-fA-F]{40}$/.test(h);
  },
  buildProfileUrl(addr: string): string {
    return `https://etherscan.io/address/${addr}`;
  },
  buildContentUrl(type: string, id: string): string {
    if (type === 'transaction' || type === 'tx') return `https://etherscan.io/tx/${id}`;
    return `https://etherscan.io/address/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
