import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['twitch.tv'];
const subdomains = ['clips']; // clips.twitch.tv

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const twitch: PlatformModule = {
  id: Platforms.Twitch,
  name: 'Twitch',
  color: '#9146FF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{4,25})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_]{4,25}$/,
    content: {
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/videos/(\\d+)/?${QUERY_HASH}$`, 'i'),
      clip: new RegExp(
        `^https?://(?:www\\.)?clips\\.twitch\\.tv/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      collection: new RegExp(
        `^https?://${DOMAIN_PATTERN}/collections/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle clip URLs (most specific - clips.twitch.tv only)
    const clipMatch = this.patterns.content?.clip?.exec(url);
    if (clipMatch) {
      return {
        ids: { clipName: clipMatch[1] },
        metadata: {
          isClip: true,
          contentType: 'clip',
        },
      };
    }

    // Handle video URLs (specific path)
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

    // Handle collection URLs (specific path)
    const collectionMatch = this.patterns.content?.collection?.exec(url);
    if (collectionMatch) {
      return {
        ids: { collectionId: collectionMatch[1] },
        metadata: {
          isCollection: true,
          contentType: 'collection',
        },
      };
    }

    // Handle profile URLs (general pattern)
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

  buildProfileUrl(username: string): string {
    return `https://twitch.tv/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
