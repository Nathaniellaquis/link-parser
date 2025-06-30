import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['flickr.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const handlePattern = /^[A-Za-z0-9@_-]{3,50}$/

export const flickr: PlatformModule = {
    id: Platforms.Flickr,
    name: 'Flickr',
    color: '#0063DC',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/photos/([A-Za-z0-9@_-]{3,50})/?${QUERY_HASH}$`, 'i'),
        handle: handlePattern,
        content: {
            photo: new RegExp(`^https?://${DOMAIN_PATTERN}/photos/([A-Za-z0-9@_-]{3,50})/(\\d{6,})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.photo?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const ph = this.patterns.content?.photo?.exec(url)
        if (ph) {
            result.username = ph[1]
            result.ids.photoId = ph[2]
            result.metadata.isPhoto = true
            result.metadata.contentType = 'photo'
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
        return normalize(url)
    },
} 