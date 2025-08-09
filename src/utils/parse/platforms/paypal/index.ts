import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['paypal.me', 'paypal.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values - this automatically handles www
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const paypal: PlatformModule = {
  id: Platforms.PayPal,
  name: 'PayPal',
  color: '#003087',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Use DOMAIN_PATTERN which automatically handles www.paypal.com and paypal.me
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:paypalme/)?([A-Za-z0-9]{1,20})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9]{1,20}$/,
    content: {
      payment: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:paypalme/)?([A-Za-z0-9]{1,20})/(\\d+(?:\\.?\\d{1,2})?)([A-Za-z]{3})?/?${QUERY_HASH}$`,
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
    const pay = this.patterns.content?.payment?.exec(url);
    if (pay) {
      const ids: any = { amount: pay[2] };
      if (pay[3]) ids.currency = pay[3];
      return {
        username: pay[1],
        ids,
        metadata: {
          isPayment: true,
          contentType: 'payment',
        },
      };
    }

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
    return `https://paypal.me/${username}`;
  },

  normalizeUrl(url: string): string {
    let normalized = normalize(url);
    if (normalized.includes('paypal.com/paypalme/')) {
      normalized = normalized.replace('paypal.com/paypalme/', 'paypal.me/');
    }
    return normalized;
  },
};
