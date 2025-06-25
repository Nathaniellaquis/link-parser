import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

export const discord: PlatformModule = {
  id: Platforms.Discord,
  name: 'Discord',
  color: '#5865F2',

  domains: ['discord.gg', 'discord.com', 'discordapp.com'],

  patterns: {
    profile: /^https?:\/\/(www\.)?(discord\.com|discordapp\.com)\/users\/(\d+)$/i,
    handle: /^\d+$/,
    content: {
      invite: /^https?:\/\/(www\.)?discord\.gg\/([A-Za-z0-9]{2,10})$/i,
      inviteFull: /^https?:\/\/(www\.)?(discord\.com|discordapp\.com)\/invite\/([A-Za-z0-9]{2,10})$/i,
      channel: /^https?:\/\/(www\.)?(discord\.com|discordapp\.com)\/channels\/(\d+)\/(\d+)$/i,
      server: /^https?:\/\/(www\.)?(discord\.com|discordapp\.com)\/servers\/([A-Za-z0-9-]+)$/i,
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some(d => url.includes(d))) return false

    // Check if it matches any valid pattern
    if (this.patterns.content?.invite?.test(url)) return true
    if (this.patterns.content?.inviteFull?.test(url)) return true
    if (this.patterns.content?.channel?.test(url)) return true
    if (this.patterns.content?.server?.test(url)) return true
    if (this.patterns.profile.test(url)) return true

    return false
  },

  extract(url: string, result: ParsedUrl): void {
    // Check for invite link (discord.gg)
    const inviteMatch = this.patterns.content?.invite?.exec(url)
    if (inviteMatch) {
      result.ids.inviteCode = inviteMatch[2]
      result.metadata.contentType = 'invite'
      return
    }

    // Check for invite link (discord.com/invite)
    const inviteFullMatch = this.patterns.content?.inviteFull?.exec(url)
    if (inviteFullMatch) {
      result.ids.inviteCode = inviteFullMatch[3]
      result.metadata.contentType = 'invite'
      return
    }

    // Check for channel link
    const channelMatch = this.patterns.content?.channel?.exec(url)
    if (channelMatch) {
      result.ids.serverId = channelMatch[3]
      result.ids.channelId = channelMatch[4]
      result.metadata.contentType = 'channel'
      return
    }

    // Check for server link
    const serverMatch = this.patterns.content?.server?.exec(url)
    if (serverMatch) {
      result.ids.serverName = serverMatch[3]
      result.metadata.contentType = 'server'
      return
    }

    // Check for user profile
    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.ids.userId = profileMatch[3]
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