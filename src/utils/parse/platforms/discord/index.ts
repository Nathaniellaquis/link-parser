import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['discord.gg', 'discord.com', 'discordapp.com'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains);

export const discord: PlatformModule = {
  id: Platforms.Discord,
  name: 'Discord',
  color: '#5865F2',

  domains: domains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/users/(\\d+)/?${QUERY_HASH}$`, 'i'),
    handle: /^\d+$/,
    content: {
      invite: new RegExp(`^https?://discord\\.gg/([A-Za-z0-9]{2,10})/?${QUERY_HASH}$`, 'i'),
      inviteFull: new RegExp(
        `^https?://${DOMAIN_PATTERN}/invite/([A-Za-z0-9]{2,10})/?${QUERY_HASH}$`,
        'i',
      ),
      channel: new RegExp(
        `^https?://${DOMAIN_PATTERN}/channels/(\\d+)/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      server: new RegExp(
        `^https?://${DOMAIN_PATTERN}/servers/([A-Za-z0-9-]{2,})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Check for invite link (discord.gg)
    const inviteMatch = this.patterns.content?.invite?.exec(url);
    if (inviteMatch) {
      return {
        ids: { inviteCode: inviteMatch[1] },
        metadata: {
          contentType: 'invite',
        },
      };
    }

    // Check for invite link (discord.com/invite)
    const inviteFullMatch = this.patterns.content?.inviteFull?.exec(url);
    if (inviteFullMatch) {
      return {
        ids: { inviteCode: inviteFullMatch[1] },
        metadata: {
          contentType: 'invite',
        },
      };
    }

    // Check for channel link
    const channelMatch = this.patterns.content?.channel?.exec(url);
    if (channelMatch) {
      return {
        ids: {
          serverId: channelMatch[1],
          channelId: channelMatch[2],
        },
        metadata: {
          contentType: 'channel',
        },
      };
    }

    // Check for server link
    const serverMatch = this.patterns.content?.server?.exec(url);
    if (serverMatch) {
      return {
        ids: { serverName: serverMatch[1] },
        metadata: {
          contentType: 'server',
        },
      };
    }

    // Check for user profile
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        ids: { userId: profileMatch[1] },
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

  buildProfileUrl(userId: string): string {
    return `https://discord.com/users/${userId}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'invite') {
      return `https://discord.gg/${id}`;
    }
    return `https://discord.com/${contentType}/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
