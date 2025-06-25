import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const userRegex = /^https?:\/\/(?:www\.)?stackoverflow\.com\/users\/(\d+)(?:\/([A-Za-z0-9_-]+))?\/?$/i
const questionRegex = /^https?:\/\/(?:www\.)?stackoverflow\.com\/(?:questions|q)\/(\d+)(?:\/([A-Za-z0-9_-]+))?\/?$/i

export const stackoverflow: PlatformModule = {
    id: Platforms.StackOverflow,
    name: 'Stack Overflow',
    color: '#F48024',

    domains: ['stackoverflow.com'],

    patterns: {
        profile: userRegex,
        handle: /^\d+$/, // userId only (StackOverflow has numeric IDs)
        content: {
            question: questionRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('stackoverflow.com')) return false
        return userRegex.test(url) || questionRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const q = questionRegex.exec(url)
        if (q) {
            result.ids.questionId = q[1]
            result.metadata.isQuestion = true
            result.metadata.contentType = 'question'
            return
        }
        const u = userRegex.exec(url)
        if (u) {
            result.userId = u[1]
            result.username = u[2]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return /^\d+$/.test(handle)
    },

    buildProfileUrl(userId: string): string {
        return `https://stackoverflow.com/users/${userId}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'question') return `https://stackoverflow.com/questions/${id}`
        return `https://stackoverflow.com/${id}`
    },

    normalizeUrl(url: string): string {
        // remove tracking params and anchors
        return normalize(url.replace(/#.*$/, '').replace(/[?&](utm_[^&]+|ref)=[^&]+/g, ''))
    },
} 