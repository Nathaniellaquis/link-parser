import { PlatformModule, Platforms, ParsedUrl, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Handle pattern: channel/account slug 3-40 chars
const handlePattern = /^[A-Za-z0-9_-]{3,40}$/;

// Profile URLs – two common forms
// https://<instance>/a/<username>
const profileA = new RegExp(
  `^https?://([A-Za-z0-9.-]+)/a/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`,
  'i',
);
// https://<instance>/video-channels/<channel>
const profileChannel = new RegExp(
  `^https?://([A-Za-z0-9.-]+)/video-channels/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`,
  'i',
);

// Video URLs
// Standard watch
const videoWatch = new RegExp(
  `^https?://([A-Za-z0-9.-]+)/videos/watch/([A-Za-z0-9_-]{8,})/?${QUERY_HASH}$`,
  'i',
);
// Embedded player
const videoEmbed = new RegExp(
  `^https?://([A-Za-z0-9.-]+)/videos/embed/([A-Za-z0-9_-]{8,})/?${QUERY_HASH}$`,
  'i',
);

export const peertube: PlatformModule = {
  id: Platforms.PeerTube,
  name: 'PeerTube',
  color: '#F1680D',

  // Domains – decentralized, so we keep empty to allow any.
  domains: [],

  patterns: {
    profile: profileA, // representative
    handle: handlePattern,
    content: {
      videoWatch,
      videoEmbed,
    },
  },

  detect(url: string): boolean {
    // Since PeerTube is decentralized, we check for specific path patterns
    // Must include '/videos/' or '/a/' or '/video-channels/'
    const urlLower = url.toLowerCase();
    return (
      urlLower.includes('/videos/') ||
      urlLower.includes('/a/') ||
      urlLower.includes('/video-channels/')
    );
  },

  extract(url: string): ExtractedData | null {
    // video first
    const v = videoWatch.exec(url) || videoEmbed.exec(url);
    if (v) {
      return {
        ids: { videoId: v[2] },
        metadata: {
          isVideo: true,
          contentType: 'video',
        },
      };
    }

    // profiles
    const pA = profileA.exec(url);
    if (pA) {
      return {
        username: pA[2],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    const pC = profileChannel.exec(url);
    if (pC) {
      return {
        username: pC[2],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    return null;
  },

  validateHandle(handle: string): boolean {
    return handlePattern.test(handle);
  },

  buildProfileUrl(username: string): string {
    // Default to popular instance if none supplied
    return `https://peertube.social/a/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'video') return `https://peertube.social/videos/watch/${id}`;
    return `https://peertube.social/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
