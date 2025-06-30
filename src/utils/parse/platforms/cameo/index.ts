import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['cameo.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const cameo: PlatformModule = {
    id: Platforms.Cameo,
    name: 'Cameo',
    color: '#EB1C2D',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_.]{3,40})/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9_.]{3,40}$/,
        content: {
            category: new RegExp(`^https?://${DOMAIN_PATTERN}/c/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.category?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const cat = this.patterns.content?.category?.exec(url)
        if (cat) {
            res.username = cat[1]
            res.metadata.isCategory = true
            res.metadata.contentType = 'category'
            return
        }
        const prof = this.patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://cameo.com/${username}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 