import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Username: letters, digits, dot, underscore, 5-32 chars (VK rules are looser, but this is safe)
const usernamePattern = /^[a-zA-Z0-9_.]{3,32}$/
const numericIdPattern = /^id\d{1,15}$/

const profileRegex = /^https?:\/\/(?:www\.|m\.|new\.)?vk\.com\/(?:([a-zA-Z0-9_.]{3,32})|(id\d{1,15}))(?:\/)?$/i
// Post links: https://vk.com/wall-12345_678 or wall12345_678 or <user>?w=wall-12345_678
const postRegex = /^https?:\/\/(?:www\.|m\.)?vk\.com\/(wall-?\d+_\d+)(?:\?.*)?$/i
const postQueryRegex = /^https?:\/\/(?:www\.|m\.)?vk\.com\/[^?]+\?w=(wall-?\d+_\d+)/i

export const vk: PlatformModule = {
    id: Platforms.VKontakte,
    name: 'VK',
    color: '#4C75A3',

    domains: ['vk.com'],
    mobileSubdomains: ['m', 'new'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            post: postRegex,
            postQuery: postQueryRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('vk.com')) return false
        if (profileRegex.test(url)) return true
        if (postRegex.test(url) || postQueryRegex.test(url)) return true
        return false
    },

    extract(url: string, result: ParsedUrl): void {
        // Posts first
        const pMatch = postRegex.exec(url) || postQueryRegex.exec(url)
        if (pMatch) {
            result.ids.postId = pMatch[1]
            result.metadata.isPost = true
            result.metadata.contentType = 'post'
            return
        }

        // Profiles
        const prof = profileRegex.exec(url)
        if (prof) {
            result.username = prof[1] || prof[2]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return usernamePattern.test(handle) || numericIdPattern.test(handle)
    },

    buildProfileUrl(handle: string): string {
        return `https://vk.com/${handle}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'post') return `https://vk.com/wall${id}`
        return `https://vk.com/${id}`
    },

    normalizeUrl(url: string): string {
        // Remove common query params like &from=copy etc.
        return normalize(url.replace(/[?&](utm_[^&]+|ref=[^&]+|from=[^&]+)/g, ''))
    },
} 