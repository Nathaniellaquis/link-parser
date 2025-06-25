import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_]{3,30}$/
const slugPattern = '[a-z0-9-]+'

const profileRegex = /^https?:\/\/(?:www\.)?audius\.co\/([A-Za-z0-9_]{3,30})\/?$/i
const trackRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?audius\\.co\\/([A-Za-z0-9_]{3,30})\\/(${slugPattern})\\/?$`, 'i')

export const audius: PlatformModule = {
    id: Platforms.Audius,
    name: 'Audius',
    color: '#CC0BFF',

    domains: ['audius.co'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            track: trackRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('audius.co')) return false
        return profileRegex.test(url) || trackRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const t = trackRegex.exec(url)
        if (t) {
            result.username = t[1]
            result.ids.trackSlug = t[2]
            result.metadata.isAudio = true
            result.metadata.contentType = 'track'
            return
        }
        const p = profileRegex.exec(url)
        if (p) {
            result.username = p[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return usernamePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://audius.co/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'track') return `https://audius.co/${id}`
        return `https://audius.co/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 