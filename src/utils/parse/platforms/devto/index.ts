import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['dev.to']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const usernamePattern = /^[A-Za-z0-9_-]{2,32}$/

export const devto: PlatformModule = {
    id: Platforms.DevTo,
    name: 'Dev.to',
    color: '#0A0A0A',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,32})/?${QUERY_HASH}$`, 'i'),
        handle: usernamePattern,
        content: {
            post: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{2,32})/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.post?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const post = this.patterns.content?.post?.exec(url)
        if (post) {
            result.username = post[1]
            result.ids.postSlug = post[2]
            result.metadata.isPost = true
            result.metadata.contentType = 'post'
            return
        }
        const prof = this.patterns.profile.exec(url)
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