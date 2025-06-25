import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

const profileRegex = /^https?:\/\/(?:www\.)?dribbble\.com\/([A-Za-z0-9_-]{3,32})\/?$/i
const shotRegex = /^https?:\/\/(?:www\.)?dribbble\.com\/shots\/(\d{5,})(?:-[A-Za-z0-9-]*)?\/?$/i

export const dribbble: PlatformModule = {
    id: Platforms.Dribbble,
    name: 'Dribbble',
    color: '#EA4C89',

    domains: ['dribbble.com'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            shot: shotRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('dribbble.com')) return false
        return profileRegex.test(url) || shotRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const s = shotRegex.exec(url)
        if (s) {
            result.ids.shotId = s[1]
            result.metadata.isPost = true
            result.metadata.contentType = 'shot'
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
        return `https://dribbble.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'shot') return `https://dribbble.com/shots/${id}`
        return `https://dribbble.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 