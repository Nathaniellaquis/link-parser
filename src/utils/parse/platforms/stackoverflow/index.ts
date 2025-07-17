import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['stackoverflow.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const stackoverflow: PlatformModule = {
  id: Platforms.StackOverflow,
  name: 'Stack Overflow',
  color: '#F48024',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/users/(\\d+)(?:/([A-Za-z0-9_-]+))?/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^\d+$/, // userId only (StackOverflow has numeric IDs)
    content: {
      question: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:questions|q)/(\\d+)(?:/([A-Za-z0-9_-]+))?/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const q = this.patterns.content?.question?.exec(url);
    if (q) {
      return {
        ids: { questionId: q[1] },
        metadata: {
          isQuestion: true,
          contentType: 'question',
        },
      };
    }
    const u = this.patterns.profile.exec(url);
    if (u) {
      return {
        userId: u[1],
        username: u[2],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return /^\d+$/.test(handle);
  },

  buildProfileUrl(userId: string): string {
    return `https://stackoverflow.com/users/${userId}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'question') return `https://stackoverflow.com/questions/${id}`;
    return `https://stackoverflow.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
