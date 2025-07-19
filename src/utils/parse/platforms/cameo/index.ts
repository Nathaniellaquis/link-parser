import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['cameo.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const cameo: PlatformModule = {
  id: Platforms.Cameo,
  name: 'Cameo',
  color: '#EB1C2D',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.]{3,40})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_.]{3,40}$/,
    content: {
      category: new RegExp(
        `^https?://${DOMAIN_PATTERN}/c/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`,
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
    // Handle category URLs
    const categoryMatch = this.patterns.content?.category?.exec(url);
    if (categoryMatch) {
      return {
        username: categoryMatch[1],
        metadata: {
          isCategory: true,
          contentType: 'category',
        },
      };
    }

    // Handle profile URLs
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        username: profileMatch[1],
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
    return `https://cameo.com/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
