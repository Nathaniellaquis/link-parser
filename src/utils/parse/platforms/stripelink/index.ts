import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['buy.stripe.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const stripelink: PlatformModule = {
  id: Platforms.StripeLink,
  name: 'StripeLink',
  color: '#635BFF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: /^$/,
    handle: /^$/,
    content: {
      pay: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9]{8,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const m = this.patterns.content?.pay?.exec(url);
    if (m) {
      return {
        ids: { code: m[1] },
        metadata: {
          isPayment: true,
          contentType: 'payment',
        },
      };
    }
    return null;
  },

  validateHandle(): boolean {
    return false;
  },
  buildProfileUrl(): string {
    return 'https://stripe.com';
  },
  buildContentUrl(_: string, id: string): string {
    return `https://buy.stripe.com/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
