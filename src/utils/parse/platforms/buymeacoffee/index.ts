import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['buymeacoffee.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

export const buymeacoffee: PlatformModule = {
    id: Platforms.BuyMeACoffee,
    name: 'BuyMeACoffee',
    color: '#FFDD00',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
        handle: usernamePattern,
        content: {
            post: new RegExp(`^https?://${DOMAIN_PATTERN}/p/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.post?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const m = this.patterns.content?.post?.exec(url)
        if (m) {
            result.ids.postSlug = m[1]
            result.metadata.contentType = 'post'
            return
        }
        const p = this.patterns.profile.exec(url)
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
        return `https://buymeacoffee.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'post') return `https://buymeacoffee.com/p/${id}`
        return `https://buymeacoffee.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 