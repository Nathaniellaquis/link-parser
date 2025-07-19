import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['bandsintown.com'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains);

export const bandsintown: PlatformModule = {
  id: Platforms.BandsInTown,
  name: 'BandsInTown',
  color: '#00B4B3',

  domains: domains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/a/(\\d+)/?${QUERY_HASH}$`, 'i'),
    handle: /^\d+$/,
    content: {
      event: new RegExp(`^https?://${DOMAIN_PATTERN}/e/(\\d+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.event?.test(url);
  },

  extract(url: string): ExtractedData | null {
    const ev = this.patterns.content?.event?.exec(url);
    if (ev) {
      return {
        ids: { eventId: ev[1] },
        metadata: {
          isEvent: true,
          contentType: 'event',
        },
      };
    }
    const art = this.patterns.profile.exec(url);
    if (art) {
      return {
        ids: { artistId: art[1] },
        metadata: {
          isArtist: true,
          contentType: 'artist',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(id: string): string {
    return `https://bandsintown.com/a/${id}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'event') return `https://bandsintown.com/e/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
