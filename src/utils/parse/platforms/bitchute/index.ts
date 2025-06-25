import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const channelSlug = /^[A-Za-z0-9_-]{3,40}$/

const channelRegex = /^https?:\/\/(?:www\.)?bitchute\.com\/channel\/([A-Za-z0-9_-]{3,40})\/?$/i
const videoRegex = /^https?:\/\/(?:www\.)?bitchute\.com\/(?:video|embed)\/([A-Za-z0-9]+)\/?$/i

export const bitchute: PlatformModule = {
    id: Platforms.BitChute,
    name: 'BitChute',
    color: '#D90207',

    domains: ['bitchute.com'],

    patterns: {
        profile: channelRegex,
        handle: channelSlug,
        content: {
            video: videoRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('bitchute.com')) return false
        return channelRegex.test(url) || videoRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const v = videoRegex.exec(url)
        if (v) {
            result.ids.videoId = v[1]
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }
        const c = channelRegex.exec(url)
        if (c) {
            result.username = c[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return channelSlug.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.bitchute.com/channel/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'video') return `https://www.bitchute.com/video/${id}`
        return `https://www.bitchute.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*$/, ''))
    },
} 