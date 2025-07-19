import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['pandora.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const pandora: PlatformModule = {
  id: Platforms.Pandora,
  name: 'Pandora',
  color: '#005483',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Artist or podcast pages
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(artist|podcast)/([A-Za-z0-9_-]{3,100})(?:/.*)?${QUERY_HASH}$`,
      'i',
    ),
    // Not commonly used publicly, but keep simple rules
    handle: /^[A-Za-z0-9_-]{3,100}$/,
    content: {
      // Station play URLs: /station/play/12345
      station: new RegExp(`^https?://${DOMAIN_PATTERN}/station/play/(\\d+)${QUERY_HASH}`, 'i'),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const station = this.patterns.content?.station?.exec(url);
    if (station) {
      return {
        ids: { stationId: station[1] },
        metadata: {
          isStation: true,
          contentType: 'station',
        },
      };
    }

    const prof = this.patterns.profile.exec(url);
    if (prof) {
      // prof[1] = 'artist' or 'podcast', prof[2] = slug
      const metadata: any = {};
      if (prof[1] === 'artist') {
        metadata.isArtist = true;
        metadata.isProfile = true;
        metadata.contentType = 'artist';
      } else if (prof[1] === 'podcast') {
        metadata.isPodcast = true;
        metadata.contentType = 'podcast';
      }
      return {
        username: prof[2],
        metadata,
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    // Default to artist profile
    return `https://pandora.com/artist/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
