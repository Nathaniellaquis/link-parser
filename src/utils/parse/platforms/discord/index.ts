import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['discord.gg', 'discord.com', 'discordapp.com']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains)

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
      inviteFull: new RegExp(`^https?://${DOMAIN_PATTERN}/invite/([A-Za-z0-9]{2,10})/?${QUERY_HASH}$`, 'i'),
      channel: new RegExp(`^https?://${DOMAIN_PATTERN}/channels/(\\d+)/(\\d+)/?${QUERY_HASH}$`, 'i'),
      server: new RegExp(`^https?://${DOMAIN_PATTERN}/servers/([A-Za-z0-9-]{2,})/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(domain => url.includes(domain))) return false

    // Check if it matches any valid pattern
    if (this.patterns.profile.test(url)) return true
    if (this.patterns.content) {
      for (const pattern of Object.values(this.patterns.content)) {
        if (pattern && pattern.test(url)) return true
      }
    }

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for invite link (discord.gg)
    const inviteMatch = this.patterns.content?.invite?.exec(url)
    if (inviteMatch) {
      result.ids.inviteCode = inviteMatch[1]
      result.metadata.contentType = 'invite'
      return
    }

    // Check for invite link (discord.com/invite)
    const inviteFullMatch = this.patterns.content?.inviteFull?.exec(url)
    if (inviteFullMatch) {
      result.ids.inviteCode = inviteFullMatch[1]
      result.metadata.contentType = 'invite'
      return
    }

    // Check for channel link
    const channelMatch = this.patterns.content?.channel?.exec(url)
    if (channelMatch) {
      result.ids.serverId = channelMatch[1]
      result.ids.channelId = channelMatch[2]
      result.metadata.contentType = 'channel'
      return
    }

    // Check for server link
    const serverMatch = this.patterns.content?.server?.exec(url)
    if (serverMatch) {
      result.ids.serverName = serverMatch[1]
      result.metadata.contentType = 'server'
      return
    }

    // Check for user profile
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.ids.userId = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
      return
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(userId: string): string {
    return `https://discord.com/users/${userId}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (contentType === 'invite') {
      return `https://discord.gg/${id}`
    }
    return `https://discord.com/${contentType}/${id}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}