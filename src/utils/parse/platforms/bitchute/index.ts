import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['bitchute.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const channelSlug = /^[A-Za-z0-9_-]{3,40}$/;

export const bitchute: PlatformModule = {
  id: Platforms.BitChute,
  name: 'BitChute',
  color: '#D90207',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/channel/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: channelSlug,
    content: {
      video: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:video|embed)/([A-Za-z0-9]+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const v = this.patterns.content?.video?.exec(url);
    if (v) {
      return {
        ids: { videoId: v[1] },
        metadata: {
          isVideo: true,
          contentType: 'video',
        },
      };
    }
    const c = this.patterns.profile.exec(url);
    if (c) {
      return {
        username: c[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return channelSlug.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.bitchute.com/channel/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'video') return `https://www.bitchute.com/video/${id}`;
    return `https://www.bitchute.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
