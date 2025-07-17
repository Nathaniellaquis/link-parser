import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['vsco.co'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const vsco: PlatformModule = {
  id: Platforms.VSCO,
  name: 'VSCO',
  color: '#000000',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,40})/?${QUERY_HASH}$`, 'i'),
    handle: /^@?[A-Za-z0-9_.-]{3,40}$/,
    content: {
      image: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,40})/media/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.image?.test(url);
  },

  extract(url: string, res: ParsedUrl): void {
    const img = this.patterns.content?.image?.exec(url);
    if (img) {
      res.username = img[1];
      res.ids.imageId = img[2];
      res.metadata.isImage = true;
      res.metadata.contentType = 'image';
      return;
    }
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      res.username = prof[1];
      res.metadata.isProfile = true;
      res.metadata.contentType = 'profile';
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://vsco.co/${username.replace(/^@/, '')}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'image') {
      return `https://vsco.co/undefined/media/${id}`; // not possible without username; leave blank.
    }
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
