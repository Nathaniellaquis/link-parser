import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['flickr.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const handlePattern = /^[A-Za-z0-9@_-]{3,50}$/;

export const flickr: PlatformModule = {
  id: Platforms.Flickr,
  name: 'Flickr',
  color: '#0063DC',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/photos/([A-Za-z0-9@_-]{3,50})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: handlePattern,
    content: {
      photo: new RegExp(
        `^https?://${DOMAIN_PATTERN}/photos/([A-Za-z0-9@_-]{3,50})/(\\d{6,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const ph = this.patterns.content?.photo?.exec(url);
    if (ph) {
      return {
        username: ph[1],
        ids: { photoId: ph[2] },
        metadata: {
          isPhoto: true,
          contentType: 'photo',
        },
      };
    }
    const p = this.patterns.profile.exec(url);
    if (p) {
      return {
        username: p[1],
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
    return `https://www.flickr.com/photos/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'photo') return `https://www.flickr.com/photos/me/${id}`;
    return `https://www.flickr.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
