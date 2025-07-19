import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['triller.co'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const triller: PlatformModule = {
  id: Platforms.Triller,
  name: 'Triller',
  color: '#FF006E',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9_.]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^@?[A-Za-z0-9_.]{3,30}$/,
    content: {
      video: new RegExp(
        `^https?://${DOMAIN_PATTERN}/watch\\?v=([A-Za-z0-9_-]{8,})${QUERY_HASH}`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.video?.test(url);
  },

  extract(url: string): ExtractedData | null {
    const video = this.patterns.content?.video?.exec(url);
    if (video) {
      return {
        ids: { videoId: video[1] },
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
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://triller.co/@${username.replace(/^@/, '')}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'video') {
      return `https://triller.co/watch?v=${id}`;
    }
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
