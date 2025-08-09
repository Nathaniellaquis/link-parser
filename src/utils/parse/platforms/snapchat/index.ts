import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['snapchat.com'];
const subdomains = ['story']; // story.snapchat.com

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const snapchat: PlatformModule = {
  id: Platforms.Snapchat,
  name: 'Snapchat',
  color: '#FFFC00',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/add/([A-Za-z0-9._-]{3,15})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9._-]{3,15}$/,
    content: {
      story: new RegExp(`^https?://${DOMAIN_PATTERN}/s/([A-Za-z0-9._-]+)/?${QUERY_HASH}$`, 'i'),
      spotlight: new RegExp(
        `^https?://${DOMAIN_PATTERN}/spotlight/([A-Za-z0-9]{2,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle story URLs
    const storyMatch = this.patterns.content?.story?.exec(url);
    if (storyMatch) {
      return {
        ids: { storyId: storyMatch[1] },
        metadata: {
          isStory: true,
          contentType: 'story',
        },
      };
    }

    // Handle spotlight URLs
    const spotlightMatch = this.patterns.content?.spotlight?.exec(url);
    if (spotlightMatch) {
      return {
        ids: { spotlightId: spotlightMatch[1] },
        metadata: {
          isSpotlight: true,
          contentType: 'spotlight',
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
    return this.patterns.handle.test(handle.replace('@', ''));
  },

  buildProfileUrl(username: string): string {
    return `https://snapchat.com/add/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
