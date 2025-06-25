import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

const profileRegex = /^https?:\/\/(?:www\.)?artstation\.com\/([A-Za-z0-9_-]{3,32})\/?$/i
const artworkRegex = /^https?:\/\/(?:www\.)?artstation\.com\/artwork\/([A-Za-z0-9]{5,})\/?$/i
const projectRegex = /^https?:\/\/(?:www\.)?artstation\.com\/projects\/([A-Za-z0-9]{5,})\/?$/i

export const artstation: PlatformModule = {
    id: Platforms.ArtStation,
    name: 'ArtStation',
    color: '#13AFF0',

    domains: ['artstation.com'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            artwork: artworkRegex,
            project: projectRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('artstation.com')) return false
        return profileRegex.test(url) || artworkRegex.test(url) || projectRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const aw = artworkRegex.exec(url) || projectRegex.exec(url)
        if (aw) {
            result.ids.artId = aw[1]
            result.metadata.isPost = true
            result.metadata.contentType = 'artwork'
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
        return `https://www.artstation.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'artwork' || type === 'project') return `https://www.artstation.com/artwork/${id}`
        return `https://www.artstation.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 