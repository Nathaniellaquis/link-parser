import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_]{3,25}$/

const profileRegex = /^https?:\/\/(?:www\.)?kick\.com\/([A-Za-z0-9_]{3,25})\/?$/i
const videoRegex = /^https?:\/\/(?:www\.)?kick\.com\/video\/(\d{5,})\/?$/i

export const kick: PlatformModule = {
    id: Platforms.Kick,
    name: 'Kick',
    color: '#52FF00',

    domains: ['kick.com'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            video: videoRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('kick.com')) return false
        return profileRegex.test(url) || videoRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const vid = videoRegex.exec(url)
        if (vid) {
            result.ids.videoId = vid[1]
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }

        const prof = profileRegex.exec(url)
        if (prof) {
            result.username = prof[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
            return
        }
    },

    validateHandle(handle: string): boolean {
        return usernamePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://kick.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'video') return `https://kick.com/video/${id}`
        return `https://kick.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*$/, ''))
    },
} 