import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['calendly.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const calendly: PlatformModule = {
  id: Platforms.Calendly,
  name: 'Calendly',
  color: '#006BFF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_.-]{3,30}$/,
    content: {
      event: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,30})/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const match = this.patterns.content?.event?.exec(url);
    if (match) {
      return {
        username: match[1],
        ids: { eventType: match[2] },
        metadata: {
          contentType: 'event',
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
    return `https://calendly.com/${username}`;
  },

  buildContentUrl(contentType: string, type: string): string {
    if (contentType === 'event') return `https://calendly.com/undefined/${type}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
