import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['tiktok.com'];
const subdomains = ['m', 'vm']; // vm.tiktok.com is just a subdomain, not separate domain

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const tiktok: PlatformModule = {
  id: Platforms.TikTok,
  name: 'TikTok',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9._]{2,24})/?${QUERY_HASH}$`, 'i'),
    handle: /^@?[A-Za-z0-9._]{2,24}$/,
    content: {
      video: new RegExp(
        `^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9._]{2,24})/video/(\\d{10,20})/?${QUERY_HASH}$`,
        'i',
      ),
      live: new RegExp(
        `^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9._]{2,24})/live/?${QUERY_HASH}$`,
        'i',
      ),
      short: new RegExp(`^https?://vm\\.tiktok\\.com/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
      embed: new RegExp(`^https?://${DOMAIN_PATTERN}/embed/v2/(\\d{10,20})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
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

    // Handle video URLs
    const videoMatch = this.patterns.content?.video?.exec(url);
    if (videoMatch) {
      return {
        username: videoMatch[1],
        ids: { videoId: videoMatch[2] },
        metadata: {
          isVideo: true,
          contentType: 'video',
        },
      };
    }

    // Handle live URLs
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

    // Handle short URLs
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
    return /^[A-Za-z0-9._]{2,24}$/.test(cleaned);
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '');
    return `https://tiktok.com/@${clean}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'video') {
      return `https://tiktok.com/@placeholder/video/${id}`;
    }
    return `https://tiktok.com/v/${id}`;
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](lang|_d|utm_[^&]+)=[^&]+/g, '');
    return normalize(url);
  },

  async resolveShortUrl(shortUrl: string): Promise<string> {
    return shortUrl;
  },

  getEmbedInfo(url: string) {
    if (/tiktok\.com\/embed\//.test(url)) {
      return { embedUrl: url, isEmbedAlready: true };
    }

    // Extract data to get video ID
    const extractedData = this.extract(url);
    if (!extractedData || !extractedData.ids || !extractedData.ids.videoId) {
      return null;
    }

    const id = extractedData.ids.videoId;
    const embedUrl = `https://www.tiktok.com/embed/v2/${id}`;
    return { embedUrl, type: 'iframe' };
  },
};
