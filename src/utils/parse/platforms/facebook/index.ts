import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['facebook.com', 'fb.com'];
const subdomains = ['m', 'mobile'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const facebook: PlatformModule = {
  id: Platforms.Facebook,
  name: 'Facebook',
  color: '#1877F2',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9.]{5,})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9.]{5,}$/,
    content: {
      profileId: new RegExp(
        `^https?://${DOMAIN_PATTERN}/profile\\.php\\?id=(\\d+)(?:&.*)?${QUERY_HASH}$`,
        'i',
      ),
      page: new RegExp(`^https?://${DOMAIN_PATTERN}/pages/[^/]+/(\\d{2,})/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/[A-Za-z0-9.]+/posts/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      video: new RegExp(`^https?://${DOMAIN_PATTERN}/watch/\\?v=(\\d+)(?:&.*)?${QUERY_HASH}$`, 'i'),
      group: new RegExp(
        `^https?://${DOMAIN_PATTERN}/groups/([A-Za-z0-9._-]{3,})/?${QUERY_HASH}$`,
        'i',
      ),
      event: new RegExp(`^https?://${DOMAIN_PATTERN}/events/(\\d+)/?${QUERY_HASH}$`, 'i'),
      live: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9.]{5,})/live/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle profile ID URLs
    const profileIdMatch = this.patterns.content?.profileId?.exec(url);
    if (profileIdMatch) {
      return {
        ids: { profileId: profileIdMatch[1] },
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    // Handle page URLs
    const pageMatch = this.patterns.content?.page?.exec(url);
    if (pageMatch) {
      return {
        ids: { pageId: pageMatch[1] },
        metadata: {
          isPage: true,
          contentType: 'page',
        },
      };
    }

    // Handle video URLs (watch format)
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

    // Handle group URLs
    const groupMatch = this.patterns.content?.group?.exec(url);
    if (groupMatch) {
      return {
        ids: { groupName: groupMatch[1] },
        metadata: {
          isGroup: true,
          contentType: 'group',
        },
      };
    }

    // Handle event URLs
    const eventMatch = this.patterns.content?.event?.exec(url);
    if (eventMatch) {
      return {
        ids: { eventId: eventMatch[1] },
        metadata: {
          isEvent: true,
          contentType: 'event',
        },
      };
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        ids: { postId: postMatch[1] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
    }

    // Handle live
    const liveMatch = this.patterns.content?.live?.exec(url);
    if (liveMatch) {
      return {
        username: liveMatch[1],
        metadata: {
          isLive: true,
          contentType: 'live',
        },
      };
    }

    // Handle profile URLs
    const reserved = [
      '/posts/',
      '/videos/',
      '/watch/',
      '/groups/',
      '/pages/',
      '/events/',
      '/profile.php',
    ];
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch && !reserved.some((r) => url.includes(r))) {
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
    return `https://facebook.com/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'video') {
      return `https://facebook.com/watch/?v=${id}`;
    }
    return `https://facebook.com/story.php?story_fbid=${id}`;
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](mibextid|ref|refsrc|_rdc|_rdr|sfnsn|hc_ref)=[^&]+/g, '');
    return normalize(url);
  },
};
