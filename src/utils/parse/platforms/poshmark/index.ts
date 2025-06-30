import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['poshmark.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const poshmark: PlatformModule = {
    id: Platforms.Poshmark,
    name: 'Poshmark',
    color: '#C03838',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/closet/([A-Za-z0-9_.-]{3,40})/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9_.-]{3,40}$/,
        content: {
            listing: new RegExp(`^https?://${DOMAIN_PATTERN}/listing/([A-Za-z0-9_-]+)-(\\d+)/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.listing?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const lst = this.patterns.content?.listing?.exec(url)
        if (lst) {
            res.ids.listingSlug = lst[1]
            res.ids.listingId = lst[2]
            res.metadata.isListing = true
            res.metadata.contentType = 'listing'
            return
        }
        const prof = this.patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isCloset = true
            res.metadata.contentType = 'closet'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://poshmark.com/closet/${username}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'listing') return `https://poshmark.com/listing/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 