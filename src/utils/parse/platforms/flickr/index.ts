import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const handlePattern = /^[A-Za-z0-9@_-]{3,50}$/

const profileRegex = /^https?:\/\/(?:www\.)?flickr\.com\/photos\/([A-Za-z0-9@_-]{3,50})\/?$/i
const photoRegex = /^https?:\/\/(?:www\.)?flickr\.com\/photos\/([A-Za-z0-9@_-]{3,50})\/(\d{6,})\/?$/i

export const flickr: PlatformModule = {
    id: Platforms.Flickr,
    name: 'Flickr',
    color: '#0063DC',

    domains: ['flickr.com'],

    patterns: {
        profile: profileRegex,
        handle: handlePattern,
        content: {
            photo: photoRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('flickr.com/photos')) return false
        return profileRegex.test(url) || photoRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const ph = photoRegex.exec(url)
        if (ph) {
            result.username = ph[1]
            result.ids.photoId = ph[2]
            result.metadata.isPhoto = true
            result.metadata.contentType = 'photo'
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
        return handlePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.flickr.com/photos/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'photo') return `https://www.flickr.com/photos/me/${id}`
        return `https://www.flickr.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 