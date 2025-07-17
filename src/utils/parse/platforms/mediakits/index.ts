import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['mediakits.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const mediakits: PlatformModule = {
  id: Platforms.MediaKits,
  name: 'MediaKits',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,40})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_.-]{3,40}$/,
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url);
  },

  extract(url: string, res: ParsedUrl): void {
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      res.username = prof[1];
      res.metadata.isProfile = true;
      res.metadata.contentType = 'profile';
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://mediakits.com/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
