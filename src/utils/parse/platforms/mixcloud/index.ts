import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['mixcloud.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const mixcloud: PlatformModule = {
    id: Platforms.Mixcloud,
    name: 'Mixcloud',
    color: '#52BAD5',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,30})/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9_-]{3,30}$/,
        content: {
            track: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,30})/([A-Za-z0-9_-]{3,120})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.track?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const prof = this.patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
            return
        }
        const tr = this.patterns.content?.track?.exec(url)
        if (tr) {
            res.username = tr[1]
            res.ids.trackSlug = tr[2]
            res.metadata.isSingle = true
            res.metadata.contentType = 'track'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(handle: string): string {
        return `https://www.mixcloud.com/${handle}/`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 