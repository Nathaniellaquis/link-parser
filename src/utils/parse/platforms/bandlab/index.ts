import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

const profileRegex = /^https?:\/\/(?:www\.)?bandlab\.com\/([A-Za-z0-9_-]{3,32})\/?$/i
const songRegex = /^https?:\/\/(?:www\.)?bandlab\.com\/([A-Za-z0-9_-]{3,32})\/([A-Za-z0-9_-]+)\/?$/i

export const bandlab: PlatformModule = {
    id: Platforms.BandLab,
    name: 'BandLab',
    color: '#DC2027',

    domains: ['bandlab.com'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            song: songRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('bandlab.com')) return false
        return profileRegex.test(url) || songRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const s = songRegex.exec(url)
        if (s) {
            result.username = s[1]
            result.ids.songSlug = s[2]
            result.metadata.isAudio = true
            result.metadata.contentType = 'song'
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
        return `https://www.bandlab.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'song') return `https://www.bandlab.com/${id}`
        return `https://www.bandlab.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 