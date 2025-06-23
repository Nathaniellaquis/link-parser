import { PlatformModule, Platforms, ParsedUrl } from '../core/types'
import { normalize } from '../utils/url'

export const discord: PlatformModule = {
  id: Platforms.Discord,
  name: 'Discord',
  color: '#5865F2',

  domains: ['discord.gg', 'discord.com'],

  patterns: {
    profile: /discord\.com\/users\/(\d+)/i,
    handle: /^.{2,32}#\d{4}$/,
    content: {
      invite: /discord\.gg\/([A-Za-z0-9]+)/i,
    },
  },

  detect(url: string): boolean {
    return this.domains.some(d => url.includes(d))
  },

  extract(url: string, result: ParsedUrl): void {
    const inviteMatch = this.patterns.content?.invite?.exec(url)
    if (inviteMatch) {
      result.ids.inviteId = inviteMatch[1]
      result.metadata.contentType = 'invite'
    }

    const profileMatch = this.patterns.profile.exec(url)
    if (profileMatch) {
      result.userId = profileMatch[1]
      result.metadata.isProfile = true
      result.metadata.contentType = 'profile'
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle)
  },

  buildProfileUrl(username: string): string {
    return `https://discord.com/users/${username}`
  },

  normalizeUrl(url: string): string {
    return normalize(url)
  },
}