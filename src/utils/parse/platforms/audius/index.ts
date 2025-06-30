import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['audius.co']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const usernamePattern = /^[A-Za-z0-9_]{3,30}$/
const slugPattern = '[a-z0-9-]+'

export const audius: PlatformModule = {
    id: Platforms.Audius,
    name: 'Audius',
    color: '#CC0BFF',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{3,30})/?${QUERY_HASH}$`, 'i'),
        handle: usernamePattern,
        content: {
            track: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_]{3,30})/(${slugPattern})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.track?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const t = this.patterns.content?.track?.exec(url)
        if (t) {
            result.username = t[1]
            result.ids.trackSlug = t[2]
            result.metadata.isAudio = true
            result.metadata.contentType = 'track'
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
        return `https://audius.co/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'track') return `https://audius.co/${id}`
        return `https://audius.co/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 