import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['dailymotion.com', 'dai.ly'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
// const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const dailymotion: PlatformModule = {
  id: Platforms.Dailymotion,
  name: 'Dailymotion',
  color: '#0066DC',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Note: Dailymotion patterns need specific domain matching for different URL types
    // dailymotion.com for profiles/videos vs dai.ly for video shortcuts
    profile: new RegExp(
      `^https?://(?:www\\.)?dailymotion\\.com/(?!video(?:/|$))([A-Za-z0-9_-]{3,30})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_-]{3,30}$/,
    content: {
      video: new RegExp(
        `^https?://(?:(?:www\\.)?dailymotion\\.com/video|dai\\.ly)/([A-Za-z0-9]{6,10})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.video?.test(url);
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
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(handle: string): string {
    return `https://www.dailymotion.com/${handle}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
