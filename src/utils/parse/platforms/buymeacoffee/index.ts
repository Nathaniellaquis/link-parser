import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

const profileRegex = /^https?:\/\/(?:www\.)?buymeacoffee\.com\/([A-Za-z0-9_-]{3,32})\/?$/i
const postRegex = /^https?:\/\/(?:www\.)?buymeacoffee\.com\/p\/([A-Za-z0-9_-]+)\/?$/i

export const buymeacoffee: PlatformModule = {
    id: Platforms.BuyMeACoffee,
    name: 'BuyMeACoffee',
    color: '#FFDD00',

    domains: ['buymeacoffee.com'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            post: postRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('buymeacoffee.com')) return false
        return profileRegex.test(url) || postRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const m = postRegex.exec(url)
        if (m) {
            result.ids.postSlug = m[1]
            result.metadata.contentType = 'post'
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
        return `https://buymeacoffee.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'post') return `https://buymeacoffee.com/p/${id}`
        return `https://buymeacoffee.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 