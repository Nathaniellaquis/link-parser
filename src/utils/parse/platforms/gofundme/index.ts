import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['gofundme.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const gofundme: PlatformModule = {
  id: Platforms.GoFundMe,
  name: 'GoFundMe',
  color: '#02A95C',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/u/([A-Za-z0-9_.-]{3,30})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^@?[A-Za-z0-9_.-]{3,30}$/,
    content: {
      campaign: new RegExp(
        `^https?://${DOMAIN_PATTERN}/f/([A-Za-z0-9_-]{3,100})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const camp = this.patterns.content?.campaign?.exec(url);
    if (camp) {
      return {
        ids: { campaignSlug: camp[1] },
        metadata: {
          contentType: 'campaign',
        },
      };
    }
    const user = this.patterns.profile.exec(url);
    if (user) {
      return {
        username: user[1],
        metadata: {
          isProfile: true,
          contentType: 'user',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://gofundme.com/u/${username.replace(/^@/, '')}`;
  },

  buildContentUrl(contentType: string, slug: string): string {
    if (contentType === 'campaign') return `https://gofundme.com/f/${slug}`;
    return '';
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
