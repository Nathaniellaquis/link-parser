import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{2,32}$/

const profileRegex = /^https?:\/\/(?:www\.)?dev\.to\/([A-Za-z0-9_-]{2,32})\/?$/i
// Article: https://dev.to/username/slug or https://dev.to/username/slug-article-id
const postRegex = /^https?:\/\/(?:www\.)?dev\.to\/([A-Za-z0-9_-]{2,32})\/([A-Za-z0-9-]+)\/?$/i

export const devto: PlatformModule = {
    id: Platforms.DevTo,
    name: 'Dev.to',
    color: '#0A0A0A',

    domains: ['dev.to'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            post: postRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('dev.to')) return false
        return profileRegex.test(url) || postRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const post = postRegex.exec(url)
        if (post) {
            result.username = post[1]
            result.ids.postSlug = post[2]
            result.metadata.isPost = true
            result.metadata.contentType = 'post'
            return
        }
        const prof = profileRegex.exec(url)
        if (prof) {
            result.username = prof[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return usernamePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://dev.to/${username}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'post') return `https://dev.to/${id}`
        return `https://dev.to/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 