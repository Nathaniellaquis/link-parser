import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['stereo.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const stereo: PlatformModule = {
  id: Platforms.Stereo,
  name: 'Stereo',
  color: '#FF6F61',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.-]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_.-]{3,30}$/,
    content: {
      show: new RegExp(`^https?://${DOMAIN_PATTERN}/s/([A-Za-z0-9]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return this.patterns.profile.test(url) || !!this.patterns.content?.show?.test(url);
  },

  extract(url: string, res: ParsedUrl): void {
    const show = this.patterns.content?.show?.exec(url);
    if (show) {
      res.ids.showId = show[1];
      res.metadata.isShow = true;
      res.metadata.contentType = 'show';
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
    return `https://stereo.com/${username}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'show') return `https://stereo.com/s/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
