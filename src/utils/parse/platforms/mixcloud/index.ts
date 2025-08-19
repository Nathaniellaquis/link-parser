import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['mixcloud.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const mixcloud: PlatformModule = {
  id: Platforms.Mixcloud,
  name: 'Mixcloud',
  color: '#52BAD5',

  domains: domains,
  subdomains: subdomains,
  domainsRegexp: new RegExp(`^(?:https?://)?${DOMAIN_PATTERN}(/|$)`, 'i'),

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{3,30}$/,
    content: {
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,30})/([A-Za-z0-9_-]{3,120})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    // const urlLower = url.toLowerCase();
    // return this.domains.some((domain) => urlLower.includes(domain));
    return this.domainsRegexp!.test(url);
  },

  extract(url: string): ExtractedData | null {
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
    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      return {
        username: tr[1],
        ids: { trackSlug: tr[2] },
        metadata: {
          isTrack: true,
          isSingle: true,
          contentType: 'track',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(handle: string): string {
    return `https://www.mixcloud.com/${handle}/`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
