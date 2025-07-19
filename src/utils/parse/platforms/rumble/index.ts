import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['rumble.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const rumble: PlatformModule = {
  id: Platforms.Rumble,
  name: 'Rumble',
  color: '#60d669',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:c(?:/)?|user/)?([A-Za-z0-9_-]{3,30})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_-]{3,30}$/,
    content: {
      video: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-z0-9]{6,})-[a-z0-9-]+\\.html${QUERY_HASH}$`,
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
    // Handle video URLs
    const videoMatch = this.patterns.content?.video?.exec(url);
    if (videoMatch) {
      return {
        ids: { videoId: videoMatch[1] },
        metadata: {
          isVideo: true,
          contentType: 'video',
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

  buildProfileUrl(handle: string): string {
    return `https://rumble.com/c/${handle}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
