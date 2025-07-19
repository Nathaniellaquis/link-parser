import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['commerce.coinbase.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const coinbasecommerce: PlatformModule = {
  id: Platforms.CoinbaseCommerce,
  name: 'CoinbaseCommerce',
  color: '#1652F0',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: /^$/,
    handle: /^$/,
    content: {
      checkout: new RegExp(
        `^https?://${DOMAIN_PATTERN}/checkout/([a-f0-9]{64})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle checkout URLs
    const checkoutMatch = this.patterns.content?.checkout?.exec(url);
    if (checkoutMatch) {
      return {
        ids: { checkoutId: checkoutMatch[1] },
        metadata: {
          isCheckout: true,
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
    return 'https://commerce.coinbase.com';
  },
  buildContentUrl(_: string, id: string): string {
    return `https://commerce.coinbase.com/checkout/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
