import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';
import { createUrlPattern } from '../../utils/pattern';

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
    content: createUrlPattern({
      domainPattern: DOMAIN_PATTERN,
      urlsPatterns: {
        video: '/(?<videoId>\\d+)/?',
        channel: '/channels/(?<channelId>[A-Za-z0-9_-]+)/?',
        showcase: '/showcase/(?<showcaseId>\\d+)/?',
      },
    }),
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;

    // Check profile pattern
    if (this.patterns.profile.test(url)) return true;

    // Check content patterns
    const contentPatterns = this.patterns.content;
    if (contentPatterns) {
      for (const pattern of Object.values(contentPatterns)) {
        if (pattern?.test(url)) return true;
      }
    }

    return false;
  },

  extract(url: string): ExtractedData | null {
    // Try each content pattern until one matches
    const contentPatterns = this.patterns.content;
    if (contentPatterns) {
      for (const [contentType, pattern] of Object.entries(contentPatterns)) {
        if (!pattern) continue;
        const match = pattern.exec(url);
        if (match && match.groups) {
          const groups = match.groups;

          const extractedData: ExtractedData = {
            metadata: {
              contentType,
            },
          };

          // Set content ID based on which pattern matched
          switch (contentType) {
            case 'video':
              extractedData.ids = { videoId: groups.videoId };
              extractedData.metadata!.isVideo = true;
              break;
            case 'channel':
              extractedData.username = groups.channelId;
              extractedData.metadata!.isChannel = true;
              break;
            case 'showcase':
              extractedData.ids = { showcaseId: groups.showcaseId };
              extractedData.metadata!.isShowcase = true;
              break;
          }

          return extractedData;
        }
      }
    }

    // Handle profile URLs
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

  getEmbedInfo(url: string) {
    // Extract data to determine content type
    const extractedData = this.extract(url);
    if (!extractedData) {
      return null;
    }

    const { metadata, ids } = extractedData;
    const contentType = metadata?.contentType;

    // Handle different content types
    if (contentType === 'video' && ids?.videoId) {
      // Vimeo videos use player.vimeo.com embed format
      const embedUrl = `https://player.vimeo.com/video/${ids.videoId}`;
      return { embedUrl, type: 'iframe', contentType: 'video' };
    }

    if (contentType === 'showcase' && ids?.showcaseId) {
      // Vimeo showcases use embed2 format as shown in example
      const embedUrl = `https://vimeo.com/showcase/${ids.showcaseId}/embed2`;
      return { embedUrl, type: 'iframe', contentType: 'showcase' };
    }

    // Profiles and channels are NOT embeddable
    return null;
  },
};
