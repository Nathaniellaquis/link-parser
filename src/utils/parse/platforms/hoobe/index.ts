import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['hoo.be'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

// Constants for validation
const MIN = 3,
  MAX = 70;

export const hoobe: PlatformModule = {
  id: Platforms.HooBe,
  name: 'Hoo.be',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9][A-Za-z0-9.-]{1,68}[A-Za-z0-9-])/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9][A-Za-z0-9.-]{1,68}[A-Za-z0-9-]$/,
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

  validateHandle(handle: string): boolean {
    if (!handle || typeof handle !== 'string') return false;
    if (handle.length < MIN || handle.length > MAX) return false;
    if (!/^[A-Za-z0-9]/.test(handle)) return false;
    if (handle.endsWith('.')) return false;
    if (!/^[A-Za-z0-9.-]+$/.test(handle)) return false;
    return true;
  },

  buildProfileUrl(username: string): string {
    return `https://hoo.be/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
