import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['youtube.com', 'youtu.be', 'youtube-nocookie.com'];
const subdomains = ['m', 'mobile'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const youtube: PlatformModule = {
  id: Platforms.YouTube,
  name: 'YouTube',
  color: '#FF0000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:c/|user/|@)([a-zA-Z0-9_-]{2,30})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
    content: {
      channel: new RegExp(
        `^https?://${DOMAIN_PATTERN}/channel/(UC[a-zA-Z0-9_-]{17,22})/?${QUERY_HASH}$`,
        'i',
      ),
      video: new RegExp(
        `^https?://${DOMAIN_PATTERN}/watch\\?v=([a-zA-Z0-9_-]{11})(?:&.*)?${QUERY_HASH}$`,
        'i',
      ),
      videoShort: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`,
        'i',
      ),
      short: new RegExp(
        `^https?://${DOMAIN_PATTERN}/shorts/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`,
        'i',
      ),
      playlist: new RegExp(
        `^https?://${DOMAIN_PATTERN}/playlist\\?list=([a-zA-Z0-9_-]+)(?:&.*)?${QUERY_HASH}$`,
        'i',
      ),
      live: new RegExp(`^https?://${DOMAIN_PATTERN}/live/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`, 'i'),
      liveWatch: new RegExp(
        `^https?://${DOMAIN_PATTERN}/watch\\?v=([a-zA-Z0-9_-]{11})&.*\\blive=1(?:&.*)?${QUERY_HASH}$`,
        'i',
      ),
      channelLive: new RegExp(
        `^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9_-]+)/live/?${QUERY_HASH}$`,
        'i',
      ),
      embed: new RegExp(
        `^https?://${DOMAIN_PATTERN}/embed/([a-zA-Z0-9_-]{11})/?${QUERY_HASH}$`,
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
    // Handle channel URLs
    const channelMatch = this.patterns.content?.channel?.exec(url);
    if (channelMatch) {
      return {
        ids: { channelId: channelMatch[1] },
        metadata: {
          isProfile: true,
          contentType: 'channel',
        },
      };
    }

    // Handle embed URLs
    const embedMatch = this.patterns.content?.embed?.exec(url);
    if (embedMatch) {
      return {
        ids: { videoId: embedMatch[1] },
        metadata: {
          isEmbed: true,
          contentType: 'embed',
        },
      };
    }

    // Handle live videos first to avoid matching the generic video pattern
    const liveMatch =
      this.patterns.content?.live?.exec(url) ||
      this.patterns.content?.liveWatch?.exec(url) ||
      this.patterns.content?.channelLive?.exec(url);
    if (liveMatch) {
      // For /@user/live the capturing group is username not videoId, treat accordingly
      if (url.includes('/@') && url.endsWith('/live')) {
        return {
          username: liveMatch[1],
          metadata: {
            isLive: true,
            contentType: 'live',
          },
        };
      } else {
        return {
          ids: { liveId: liveMatch[1] },
          metadata: {
            isLive: true,
            contentType: 'live',
          },
        };
      }
    }

    // Handle video URLs (both regular and short)
    const videoMatch = this.patterns.content?.video?.exec(url);
    const videoShortMatch = this.patterns.content?.videoShort?.exec(url);
    if (videoMatch || videoShortMatch) {
      const match = videoMatch || videoShortMatch;
      const data: ExtractedData = {
        ids: { videoId: match![1] },
        metadata: {
          isVideo: true,
          contentType: 'video',
        },
      };

      // Extract timestamp if present
      const tMatch = url.match(/[?&]t=(\d+)/);
      if (tMatch) data.metadata!.timestamp = parseInt(tMatch[1]);
      return data;
    }

    // Handle shorts
    const shortMatch = this.patterns.content?.short?.exec(url);
    if (shortMatch) {
      return {
        ids: { shortId: shortMatch[1] },
        metadata: {
          isShort: true,
          contentType: 'short',
        },
      };
    }

    // Handle playlists
    const playlistMatch = this.patterns.content?.playlist?.exec(url);
    if (playlistMatch) {
      return {
        ids: { playlistId: playlistMatch[1] },
        metadata: {
          isPlaylist: true,
          contentType: 'playlist',
        },
      };
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
    return this.patterns.handle.test(handle.replace('@', ''));
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '');
    if (clean.startsWith('UC') && clean.length === 24) {
      return `https://youtube.com/channel/${clean}`;
    }
    return `https://youtube.com/@${clean}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (['video', 'short', 'live'].includes(contentType))
      return `https://youtube.com/watch?v=${id}`;
    if (contentType === 'playlist') return `https://youtube.com/playlist?list=${id}`;
    return `https://youtube.com/watch?v=${id}`;
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](feature|si|pp|ab_channel)=[^&]+/g, '');
    return normalize(url);
  },

  extractTimestamp(url: string): number | null {
    const match = url.match(/[?&]t=(\d+)/);
    return match ? parseInt(match[1]) : null;
  },

  generateEmbedUrl(
    contentId: string,
    options?: { startTime?: number; autoplay?: boolean },
  ): string {
    const params = new URLSearchParams();
    if (options?.startTime) params.set('start', options.startTime.toString());
    if (options?.autoplay) params.set('autoplay', '1');
    const qs = params.toString();
    return `https://www.youtube.com/embed/${contentId}${qs ? `?${qs}` : ''}`;
  },

  async resolveShortUrl(shortUrl: string): Promise<string> {
    const match = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(shortUrl);
    if (match) return `https://youtube.com/watch?v=${match[1]}`;
    return shortUrl;
  },

  getEmbedInfo(url: string) {
    // If already an embed src
    const embedMatch = /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/.exec(url);
    if (embedMatch) {
      return { embedUrl: url, isEmbedAlready: true };
    }

    // Extract data to get video ID
    const extractedData = this.extract(url);
    if (!extractedData || !extractedData.ids) {
      return null;
    }

    const id = extractedData.ids.videoId || extractedData.ids.shortId || extractedData.ids.liveId;
    if (id) {
      const embedUrl = this.generateEmbedUrl
        ? this.generateEmbedUrl(id)
        : `https://www.youtube.com/embed/${id}`;
      return { embedUrl, type: 'iframe' };
    }
    return null;
  },
};
