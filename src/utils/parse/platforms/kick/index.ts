import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['kick.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const usernamePattern = /^[A-Za-z0-9_]{3,25}$/;

export const kick: PlatformModule = {
  id: Platforms.Kick,
  name: 'Kick',
  color: '#52FF00',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{3,25})/?${QUERY_HASH}$`, 'i'),
    handle: usernamePattern,
    content: {
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/video/(\\d{5,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const vid = this.patterns.content?.video?.exec(url);
    if (vid) {
      return {
        ids: { videoId: vid[1] },
        metadata: {
          isVideo: true,
          contentType: 'video',
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
    return usernamePattern.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://kick.com/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'video') return `https://kick.com/video/${id}`;
    return `https://kick.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
