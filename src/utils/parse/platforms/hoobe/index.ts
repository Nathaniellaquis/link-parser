import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
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
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url);
  },

  extract(url: string, result: ParsedUrl): void {
    const m = this.patterns.profile.exec(url);
    if (m) {
      result.username = m[1];
      result.metadata.isProfile = true;
      result.metadata.contentType = 'profile';
    }
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
