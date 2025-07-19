import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['venmo.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const venmo: PlatformModule = {
  id: Platforms.Venmo,
  name: 'Venmo',
  color: '#3D95CE',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_\\-]{3,})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,}$/,
    content: {
      qr: new RegExp(`^https?://${DOMAIN_PATTERN}/code\\?user_id=(\\d+)${QUERY_HASH}`, 'i'),
      payment: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,})/?\\?txn=pay${QUERY_HASH}`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // QR Code URL
    const qrMatch = this.patterns.content?.qr?.exec(url);
    if (qrMatch) {
      return {
        ids: { qrUserId: qrMatch[1] },
        metadata: {
          isQr: true,
          contentType: 'qr',
        },
      };
    }

    // Payment URL (same as profile but with txn param)
    const payMatch = this.patterns.content?.payment?.exec(url);
    if (payMatch) {
      return {
        username: payMatch[1],
        metadata: {
          isPayment: true,
          contentType: 'payment',
        },
      };
    }

    // Profile URL
    const profMatch = this.patterns.profile.exec(url);
    if (profMatch) {
      return {
        username: profMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle.replace('@', ''));
  },

  buildProfileUrl(username: string): string {
    return `https://venmo.com/${username.replace('@', '')}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
