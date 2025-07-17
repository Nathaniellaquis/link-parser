import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
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
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.tx?.test(url);
  },

  extract(url: string, result: ParsedUrl): void {
    const t = this.patterns.content?.tx?.exec(url);
    if (t) {
      result.ids.txHash = t[1];
      result.metadata.contentType = 'transaction';
      return;
    }
    const a = this.patterns.profile.exec(url);
    if (a) {
      result.userId = a[1];
      result.metadata.contentType = 'address';
    }
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
