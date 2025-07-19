import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['gitlab.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const gitlab: PlatformModule = {
  id: Platforms.GitLab,
  name: 'GitLab',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]{2,255})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9-]{1,255}$/,
    content: {
      project: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]{2,255})/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      snippet: new RegExp(
        `^https?://${DOMAIN_PATTERN}/[A-Za-z0-9-]+/[A-Za-z0-9._-]+/-/snippets/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle snippet URLs
    const snippetMatch = this.patterns.content?.snippet?.exec(url);
    if (snippetMatch) {
      return {
        ids: { snippetId: snippetMatch[1] },
        metadata: {
          contentType: 'snippet',
        },
      };
    }

    // Handle project URLs
    const projectMatch = this.patterns.content?.project?.exec(url);
    if (projectMatch) {
      return {
        username: projectMatch[1],
        ids: { projectName: projectMatch[2] },
        metadata: {
          isProject: true,
          contentType: 'project',
        },
      };
    }

    // Handle profile URLs
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        username: profileMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://gitlab.com/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
