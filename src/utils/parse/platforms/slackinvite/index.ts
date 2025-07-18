import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['join.slack.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const slackinvite: PlatformModule = {
  id: Platforms.SlackInvite,
  name: 'SlackInvite',
  color: '#4A154B',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: /^$/,
    handle: /^$/,
    content: {
      invite: new RegExp(
        `^https?://${DOMAIN_PATTERN}/t/([A-Za-z0-9-]+)/shared_invite/[A-Za-z0-9~_-]+/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const m = this.patterns.content?.invite?.exec(url);
    if (m) {
      return {
        ids: { workspace: m[1] },
        metadata: {
          isInvite: true,
          contentType: 'invite',
        },
      };
    }
    return null;
  },

  validateHandle(): boolean {
    return false;
  },
  buildProfileUrl(): string {
    return 'https://slack.com';
  },
  buildContentUrl(_: string, id: string): string {
    return `https://join.slack.com/t/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
