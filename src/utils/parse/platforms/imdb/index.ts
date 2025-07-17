import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['imdb.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const imdb: PlatformModule = {
  id: Platforms.IMDb,
  name: 'IMDb',
  color: '#F5C518',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/name/(nm\\d{7,8})/?${QUERY_HASH}$`, 'i'),
    handle: /^nm\d{7,8}$/,
    content: {
      title: new RegExp(`^https?://${DOMAIN_PATTERN}/title/(tt\\d{7,8})/?${QUERY_HASH}$`, 'i'),
      company: new RegExp(`^https?://${DOMAIN_PATTERN}/company/(co\\d{7,8})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.title?.test(url) ||
      !!this.patterns.content?.company?.test(url)
    );
  },

  extract(url: string, res: ParsedUrl): void {
    const title = this.patterns.content?.title?.exec(url);
    if (title) {
      res.ids.titleId = title[1];
      res.metadata.isTitle = true;
      res.metadata.contentType = 'title';
      return;
    }
    const company = this.patterns.content?.company?.exec(url);
    if (company) {
      res.ids.companyId = company[1];
      res.metadata.isCompany = true;
      res.metadata.contentType = 'company';
      return;
    }
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      res.userId = prof[1];
      res.metadata.isPerson = true;
      res.metadata.contentType = 'person';
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(id: string): string {
    return `https://imdb.com/name/${id}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'title') return `https://imdb.com/title/${id}`;
    if (contentType === 'company') return `https://imdb.com/company/${id}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
