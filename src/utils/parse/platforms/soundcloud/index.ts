import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['soundcloud.com'];
const subdomains = ['w'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const soundcloud: PlatformModule = {
  id: Platforms.SoundCloud,
  name: 'SoundCloud',
  color: '#FF5500',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://(?:(?:www\\.)?soundcloud\\.com)/([A-Za-z0-9_-]{2,25})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9_-]{2,25}$/,
    content: {
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,25})/(?!sets/)([A-Za-z0-9_-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      set: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,25})/sets/([A-Za-z0-9_-]{1,})/?${QUERY_HASH}$`,
        'i',
      ),
      embed: new RegExp(`^https?://w\\.soundcloud\\.com/player/\\?url=.+`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Check for embed URL first
    if (this.patterns.content?.embed?.test(url)) {
      return {
        metadata: {
          contentType: 'embed',
          isEmbed: true,
        },
      };
    }

    // Check for set/playlist
    const setMatch = this.patterns.content?.set?.exec(url);
    if (setMatch) {
      return {
        username: setMatch[1],
        ids: { setId: setMatch[2] },
        metadata: {
          contentType: 'set',
          isSet: true,
        },
      };
    }

    // Check for track
    const trackMatch = this.patterns.content?.track?.exec(url);
    if (trackMatch) {
      return {
        username: trackMatch[1],
        ids: { trackId: trackMatch[2] },
        metadata: {
          contentType: 'track',
          isTrack: true,
        },
      };
    }

    // Check for profile
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
    return `https://soundcloud.com/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'track') {
      return `https://soundcloud.com/track/${id}`;
    }
    return `https://soundcloud.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]utm_[^&]+/g, ''));
  },

  generateEmbedUrl(contentId: string): string {
    return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${contentId}`;
  },

  getEmbedInfo(url: string) {
    if (url.includes('w.soundcloud.com/player')) {
      return { embedUrl: url, isEmbedAlready: true };
    }

    // Extract data to get track ID
    const extractedData = this.extract(url);
    if (!extractedData || !extractedData.ids || !extractedData.ids.trackId) {
      return null;
    }

    const id = extractedData.ids.trackId;
    const embedUrl = this.generateEmbedUrl
      ? this.generateEmbedUrl(id)
      : `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}`;
    return { embedUrl, type: 'iframe' };
  },
};
