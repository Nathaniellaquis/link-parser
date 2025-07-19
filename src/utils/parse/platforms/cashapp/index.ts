import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['cash.app'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const cashapp: PlatformModule = {
  id: Platforms.CashApp,
  name: 'Cash App',
  color: '#00C244',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/\\$([A-Za-z][A-Za-z0-9_]{1,20})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^\$?[A-Za-z][A-Za-z0-9_]{1,20}$/,
    content: {
      payment: new RegExp(
        `^https?://${DOMAIN_PATTERN}/\\$([A-Za-z][A-Za-z0-9_]{1,20})/\\d+(?:\\.\\d{2})?/?${QUERY_HASH}$`,
        'i',
      ),
      amountQuery: new RegExp(
        `^https?://${DOMAIN_PATTERN}/\\$([A-Za-z][A-Za-z0-9_]{1,20})/?\\?amount=(\\d+(?:\\.\\d{2})?)${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true;
    if (this.patterns.content) {
      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true;
      }
    }

    return false;
  },

  extract(url: string): ExtractedData | null {
    // Payment path - no amount capture
    const payPath = this.patterns.content?.payment?.exec(url);
    if (payPath) {
      return {
        username: payPath[1],
        // No amount capture for path pattern
        metadata: {
          isPayment: true,
          contentType: 'payment',
        },
      };
    }

    // Amount query - captures amount
    const payQuery = this.patterns.content?.amountQuery?.exec(url);
    if (payQuery) {
      return {
        username: payQuery[1],
        ids: { amount: payQuery[2] },
        metadata: {
          isPayment: true,
          contentType: 'payment',
        },
      };
    }

    // Profile
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      return {
        username: prof[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://cash.app/$${username.replace(/^\$/, '')}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
