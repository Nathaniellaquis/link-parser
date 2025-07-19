import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['vimeo.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const vimeo: PlatformModule = {
  id: Platforms.Vimeo,
  name: 'Vimeo',
  color: '#1AB7EA',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:user\\d+|[A-Za-z0-9_]{3,32})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^(?:user\d+|[A-Za-z0-9_]{3,32})$/,
    content: {
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/(\\d{6,12})/?${QUERY_HASH}$`, 'i'),
      channel: new RegExp(
        `^https?://${DOMAIN_PATTERN}/channels/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.video?.test(url) ||
      !!this.patterns.content?.channel?.test(url)
    );
  },

  extract(url: string): ExtractedData | null {
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
    const channelMatch = this.patterns.content?.channel?.exec(url);
    if (channelMatch) {
      return {
        username: channelMatch[1],
        metadata: {
          isChannel: true,
          contentType: 'channel',
        },
      };
    }
    const profMatch = this.patterns.profile.exec(url);
    if (profMatch) {
      // capture username or userID depending
      const path = url.split('/').pop()?.split('?')[0] || '';
      return {
        username: path,
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
    return `https://vimeo.com/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
