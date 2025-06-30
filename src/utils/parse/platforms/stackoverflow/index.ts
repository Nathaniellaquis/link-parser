import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['stackoverflow.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const stackoverflow: PlatformModule = {
    id: Platforms.StackOverflow,
    name: 'Stack Overflow',
    color: '#F48024',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/users/(\\d+)(?:/([A-Za-z0-9_-]+))?/?${QUERY_HASH}$`, 'i'),
        handle: /^\d+$/, // userId only (StackOverflow has numeric IDs)
        content: {
            question: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:questions|q)/(\\d+)(?:/([A-Za-z0-9_-]+))?/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.question?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const q = this.patterns.content?.question?.exec(url)
        if (q) {
            result.ids.questionId = q[1]
            result.metadata.isQuestion = true
            result.metadata.contentType = 'question'
            return
        }
        const u = this.patterns.profile.exec(url)
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
        return normalize(url)
    },
} 