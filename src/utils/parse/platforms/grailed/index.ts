import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/
const listingId = '\\d{5,8}'

const profileRegex = /^https?:\/\/(?:www\.)?grailed\.com\/([A-Za-z0-9_-]{3,32})\/?$/i
const listingRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?grailed\\.com\\/listings\\/(${listingId})(?:-[A-Za-z0-9-]+)?\\/?$`, 'i')

export const grailed: PlatformModule = {
    id: Platforms.Grailed,
    name: 'Grailed',
    color: '#000000',

    domains: ['grailed.com'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            listing: listingRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('grailed.com')) return false
        return profileRegex.test(url) || listingRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const l = listingRegex.exec(url)
        if (l) {
            result.ids.listingId = l[1]
            result.metadata.contentType = 'listing'
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
        return `https://www.grailed.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'listing') return `https://www.grailed.com/listings/${id}`
        return `https://www.grailed.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 