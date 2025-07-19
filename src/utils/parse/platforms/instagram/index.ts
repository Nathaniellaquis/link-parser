import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['instagram.com', 'instagr.am'];
const subdomains = ['m', 'mobile'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const instagram: PlatformModule = {
  id: Platforms.Instagram,
  name: 'Instagram',
  color: '#E1306C',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-zA-Z0-9_.]{2,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-zA-Z0-9_](?:[a-zA-Z0-9_.]*[a-zA-Z0-9_])?$/i,
    content: {
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:[a-zA-Z0-9_.]{2,30}/)?p/([A-Za-z0-9_-]+)(?:/.*)?${QUERY_HASH}$`,
        'i',
      ),
      reel: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:[a-zA-Z0-9_.]{2,30}/)?reel[s]?/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      story: new RegExp(
        `^https?://${DOMAIN_PATTERN}/stories/([a-zA-Z0-9_.]+)(?:/(\\d+))?/?${QUERY_HASH}$`,
        'i',
      ),
      tv: new RegExp(`^https?://${DOMAIN_PATTERN}/tv/([A-Za-z0-9_-]{1,})/?${QUERY_HASH}$`, 'i'),
      live: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-zA-Z0-9_.]{2,30})/live/?${QUERY_HASH}$`,
        'i',
      ),
      embed: new RegExp(
        `^https?://${DOMAIN_PATTERN}/p/([A-Za-z0-9_-]+)/embed/?${QUERY_HASH}$`,
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
    // Handle embed URLs first
    const embedMatch = this.patterns.content?.embed?.exec(url);
    if (embedMatch) {
      return {
        ids: { postId: embedMatch[1] },
        metadata: {
          isEmbed: true,
          contentType: 'embed',
        },
      };
    }

    // Handle story URLs
    const storyMatch = this.patterns.content?.story?.exec(url);
    if (storyMatch) {
      return {
        ids: {
          storyId: storyMatch[1],
          storyItemId: storyMatch[2],
        },
        metadata: {
          isStory: true,
          contentType: 'story',
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

    // Handle other content types
    if (this.patterns.content) {
      for (const [type, patternValue] of Object.entries(this.patterns.content)) {
        if (type === 'story' || type === 'embed' || type === 'live') continue;
        const pattern = patternValue as RegExp | undefined;
        if (!pattern) continue;
        const match = pattern.exec(url);
        if (match) {
          return {
            ids: { [`${type}Id`]: match[1] },
            metadata: {
              [`is${type.charAt(0).toUpperCase() + type.slice(1)}`]: true,
              contentType: type,
            },
          };
        }
      }
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
    const cleaned = handle.replace('@', '');
    // Instagram usernames: 2-30 chars, alphanumeric, underscore, period
    // Can't start/end with period, no consecutive periods
    return /^[a-zA-Z0-9_](?:[a-zA-Z0-9_.]{0,28}[a-zA-Z0-9_])?$/.test(cleaned);
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '');
    return `https://instagram.com/${clean}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    const map: Record<string, string> = { post: 'p', reel: 'reel', tv: 'tv' };
    const path = map[contentType] || 'p';
    return `https://instagram.com/${path}/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](igshid|utm_[^&]+|ig_[^&]+)=[^&]+/g, ''));
  },

  getEmbedInfo(url: string) {
    if (/instagram\.com\/.*\/embed\//.test(url)) {
      return { embedUrl: url, isEmbedAlready: true };
    }

    // Extract data to get post/reel/tv ID
    const extractedData = this.extract(url);
    if (!extractedData || !extractedData.ids) {
      return null;
    }

    const id = extractedData.ids.postId || extractedData.ids.reelId || extractedData.ids.tvId;
    if (id) {
      const embedUrl = `https://www.instagram.com/p/${id}/embed/`;
      return { embedUrl, type: 'iframe' };
    }
    return null;
  },
};
