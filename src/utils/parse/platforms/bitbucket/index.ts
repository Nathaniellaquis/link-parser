import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['bitbucket.org'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const bitbucket: PlatformModule = {
  id: Platforms.Bitbucket,
  name: 'Bitbucket',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9_-]{2,30}$/,
    content: {
      repo: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,30})/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      snippet: new RegExp(
        `^https?://${DOMAIN_PATTERN}/snippets/([A-Za-z0-9_-]{2,30})/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`,
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
        username: snippetMatch[1],
        ids: { snippetId: snippetMatch[2] },
        metadata: {
          contentType: 'snippet',
        },
      };
    }

    // Handle repo URLs
    const repoMatch = this.patterns.content?.repo?.exec(url);
    if (repoMatch) {
      return {
        username: repoMatch[1],
        ids: { repoName: repoMatch[2] },
        metadata: {
          isRepository: true,
          contentType: 'repo',
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
    return `https://bitbucket.org/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
