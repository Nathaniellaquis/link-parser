import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['beatport.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const slug = '[A-Za-z0-9-]+';

export const beatport: PlatformModule = {
  id: Platforms.Beatport,
  name: 'Beatport',
  color: '#A6CE38',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/artist/(${slug})/(\\d{1,7})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9-]{3,50}$/,
    content: {
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/track/(${slug})/(\\d{1,7})/?${QUERY_HASH}$`,
        'i',
      ),
      release: new RegExp(
        `^https?://${DOMAIN_PATTERN}/release/(${slug})/(\\d{1,7})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.track?.test(url) ||
      !!this.patterns.content?.release?.test(url)
    );
  },

  extract(url: string, result: ParsedUrl): void {
    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      result.ids.trackId = tr[2];
      result.metadata.isAudio = true;
      result.metadata.contentType = 'track';
      return;
    }
    const rel = this.patterns.content?.release?.exec(url);
    if (rel) {
      result.ids.releaseId = rel[2];
      result.metadata.contentType = 'release';
      return;
    }
    const ar = this.patterns.profile.exec(url);
    if (ar) {
      result.username = ar[1];
      result.userId = ar[2];
      result.metadata.isProfile = true;
      result.metadata.contentType = 'profile';
    }
  },

  validateHandle(handle: string): boolean {
    return /^[A-Za-z0-9-]{3,50}$/.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.beatport.com/artist/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'track') return `https://www.beatport.com/track/slug/${id}`;
    if (type === 'release') return `https://www.beatport.com/release/slug/${id}`;
    return `https://www.beatport.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
