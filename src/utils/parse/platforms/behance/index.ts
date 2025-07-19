import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['behance.net'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/;

export const behance: PlatformModule = {
  id: Platforms.Behance,
  name: 'Behance',
  color: '#1769FF',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
    handle: usernamePattern,
    content: {
      project: new RegExp(
        `^https?://${DOMAIN_PATTERN}/gallery/(\\d{6,})/[A-Za-z0-9-]+/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const pr = this.patterns.content?.project?.exec(url);
    if (pr) {
      return {
        ids: { projectId: pr[1] },
        metadata: {
          isProject: true,
          contentType: 'project',
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
    return usernamePattern.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.behance.net/${username}`;
  },

  buildContentUrl(type: string, id: string): string {
    if (type === 'project') return `https://www.behance.net/gallery/${id}`;
    return `https://www.behance.net/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
