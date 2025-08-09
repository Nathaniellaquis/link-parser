import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['github.com', 'gist.github.com', 'raw.githubusercontent.com'];

export const github: PlatformModule = {
  id: Platforms.GitHub,
  name: 'GitHub',
  domains: domains,
  patterns: {
    profile: new RegExp(`^https?://github\\.com/([A-Za-z0-9-]{2,39})/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9-]{1,39}$/,
    content: {
      repo: new RegExp(
        `^https?://github\\.com/([A-Za-z0-9-]{2,39})/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      gist: new RegExp(
        `^https?://gist\\.github\\.com/([A-Za-z0-9-]{2,39})/([a-fA-F0-9]{8,})/?${QUERY_HASH}$`,
        'i',
      ),
      raw: new RegExp(
        `^https?://raw\\.githubusercontent\\.com/([A-Za-z0-9-]{2,39})/([A-Za-z0-9._-]+)/(.+)${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle gist URLs
    const gistMatch = this.patterns.content?.gist?.exec(url);
    if (gistMatch) {
      return {
        username: gistMatch[1],
        ids: { gistId: gistMatch[2] },
        metadata: {
          contentType: 'gist',
        },
      };
    }

    // Handle raw URLs
    const rawMatch = this.patterns.content?.raw?.exec(url);
    if (rawMatch) {
      return {
        username: rawMatch[1],
        ids: { repoName: rawMatch[2] },
        metadata: {
          contentType: 'raw',
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
    return `https://github.com/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/^http:\/\//, 'https://'));
  },
};
