import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
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
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const artworkMatch = this.patterns.content?.artwork?.exec(url);
    if (artworkMatch) {
      return {
        ids: { artId: artworkMatch[1] },
        metadata: {
          isPost: true,
          isProject: true,
          contentType: 'artwork',
        },
      };
    }

    const projectMatch = this.patterns.content?.project?.exec(url);
    if (projectMatch) {
      return {
        ids: { projectId: projectMatch[1] },
        metadata: {
          isPost: true,
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
