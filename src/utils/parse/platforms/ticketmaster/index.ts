import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['ticketmaster.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const ticketmaster: PlatformModule = {
  id: Platforms.Ticketmaster,
  name: 'Ticketmaster',
  color: '#003087',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/artist/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9]+$/,
    content: {
      event: new RegExp(`^https?://${DOMAIN_PATTERN}/event/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
      venue: new RegExp(`^https?://${DOMAIN_PATTERN}/venue/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.event?.test(url) ||
      !!this.patterns.content?.venue?.test(url)
    );
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
    const venue = this.patterns.content?.venue?.exec(url);
    if (venue) {
      return {
        ids: { venueId: venue[1] },
        metadata: {
          isVenue: true,
          contentType: 'venue',
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
    return `https://ticketmaster.com/artist/${id}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'event') return `https://ticketmaster.com/event/${id}`;
    if (contentType === 'venue') return `https://ticketmaster.com/venue/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
