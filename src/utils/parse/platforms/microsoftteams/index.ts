import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['teams.microsoft.com', 'teams.live.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
// const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const microsoftteams: PlatformModule = {
  id: Platforms.MicrosoftTeams,
  name: 'MicrosoftTeams',
  color: '#464EB8',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    // Note: Microsoft Teams patterns need specific domain matching (teams.microsoft.com vs teams.live.com)
    // and complex path structures that can't use DOMAIN_PATTERN directly
    profile: /^$/,
    handle: /^$/,
    content: {
      team: new RegExp(
        `^https?://teams\\.microsoft\\.com/l/team/(\\w+)/conversations\\?.*groupId=([0-9a-f-]{36})${QUERY_HASH}`,
        'i',
      ),
      meeting: new RegExp(`^https?://teams\\.live\\.com/meet/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return !!this.patterns.content?.team?.test(url) || !!this.patterns.content?.meeting?.test(url);
  },

  extract(url: string, result: ParsedUrl): void {
    const t = this.patterns.content?.team?.exec(url);
    if (t) {
      result.ids.teamId = t[1];
      result.ids.groupId = t[2];
      result.metadata.contentType = 'team';
      return;
    }
    const m = this.patterns.content?.meeting?.exec(url);
    if (m) {
      result.ids.meetingId = m[1];
      result.metadata.contentType = 'meeting';
    }
  },

  validateHandle(): boolean {
    return false;
  },
  buildProfileUrl(): string {
    return 'https://teams.microsoft.com';
  },
  buildContentUrl(_: string, id: string): string {
    return `https://teams.microsoft.com/l/team/${id}`;
  },
  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
