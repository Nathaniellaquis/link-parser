import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['onlyfans.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const onlyfans: PlatformModule = {
  id: Platforms.OnlyFans,
  name: 'OnlyFans',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,60})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,60}$/,
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
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

  validateHandle(h: string): boolean {
    return this.patterns.handle.test(h);
  },
  buildProfileUrl(u: string): string {
    return `https://onlyfans.com/${u}`;
  },
  normalizeUrl(u: string): string {
    return normalize(u);
  },
};
