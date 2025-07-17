import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
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
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.station?.test(url);
  },

  extract(url: string, res: ParsedUrl): void {
    const station = this.patterns.content?.station?.exec(url);
    if (station) {
      res.ids.stationId = station[1];
      res.metadata.isStation = true;
      res.metadata.contentType = 'station';
      return;
    }

    const prof = this.patterns.profile.exec(url);
    if (prof) {
      // prof[1] = 'artist' or 'podcast', prof[2] = slug
      res.username = prof[2];
      if (prof[1] === 'artist') {
        res.metadata.isArtist = true;
        res.metadata.contentType = 'artist';
      } else if (prof[1] === 'podcast') {
        res.metadata.isPodcast = true;
        res.metadata.contentType = 'podcast';
      }
    }
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
