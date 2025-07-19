import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['square.link', 'checkout.square.site'];
const subdomains: string[] = [];

// DOMAIN_PATTERN not used due to Square Checkout's specific domain requirements
// We keep domains and subdomains for architectural consistency

export const squarecheckout: PlatformModule = {
  id: Platforms.SquareCheckout,
  name: 'SquareCheckout',
  color: '#28C101',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Note: Square Checkout patterns need specific domain matching (square.link vs checkout.square.site)
    // and can't use DOMAIN_PATTERN due to different path structures on each domain
    profile: /^$/,
    handle: /^$/,
    content: {
      pay: new RegExp(
        `^https?://(?:square\\.link|checkout\\.square\\.site)/pay/([a-zA-Z0-9]{8,})/?${QUERY_HASH}$`,
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
    // Handle pay URLs
    const payMatch = this.patterns.content?.pay?.exec(url);
    if (payMatch) {
      return {
        ids: { code: payMatch[1] },
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
    return 'https://squareup.com';
  },
  buildContentUrl(_: string, id: string): string {
    return `https://square.link/pay/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
