import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['grailed.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/
const listingId = '\\d{5,8}'

export const grailed: PlatformModule = {
    id: Platforms.Grailed,
    name: 'Grailed',
    color: '#000000',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
        handle: usernamePattern,
        content: {
            listing: new RegExp(`^https?://${DOMAIN_PATTERN}/listings/(${listingId})(?:-[A-Za-z0-9-]+)?/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.listing?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const l = this.patterns.content?.listing?.exec(url)
        if (l) {
            result.ids.listingId = l[1]
            result.metadata.contentType = 'listing'
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
        return `https://www.grailed.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'listing') return `https://www.grailed.com/listings/${id}`
        return `https://www.grailed.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 