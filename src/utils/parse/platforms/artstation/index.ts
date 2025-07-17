import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['artstation.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/;

export const artstation: PlatformModule = {
  id: Platforms.ArtStation,
  name: 'ArtStation',
  color: '#13AFF0',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
    handle: usernamePattern,
    content: {
      artwork: new RegExp(
        `^https?://${DOMAIN_PATTERN}/artwork/([A-Za-z0-9]{5,})/?${QUERY_HASH}$`,
        'i',
      ),
      project: new RegExp(
        `^https?://${DOMAIN_PATTERN}/projects/([A-Za-z0-9]{5,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.artwork?.test(url) ||
      !!this.patterns.content?.project?.test(url)
    );
  },

  extract(url: string, result: ParsedUrl): void {
    const aw =
      this.patterns.content?.artwork?.exec(url) || this.patterns.content?.project?.exec(url);
    if (aw) {
      result.ids.artId = aw[1];
      result.metadata.isPost = true;
      result.metadata.contentType = 'artwork';
      return;
    }
    const p = this.patterns.profile.exec(url);
    if (p) {
      result.username = p[1];
      result.metadata.isProfile = true;
      result.metadata.contentType = 'profile';
    }
  },

  validateHandle(handle: string): boolean {
    return usernamePattern.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.artstation.com/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'artwork' || type === 'project') return `https://www.artstation.com/artwork/${id}`;
    return `https://www.artstation.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
