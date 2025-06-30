import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['dispo.fun']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const dispo: PlatformModule = {
    id: Platforms.Dispo,
    name: 'Dispo',
    color: '#FFCC00',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9_.]{3,30})/?${QUERY_HASH}$`, 'i'),
        handle: /^@?[A-Za-z0-9_.]{3,30}$/,
        content: {
            roll: new RegExp(`^https?://${DOMAIN_PATTERN}/r/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.roll?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const roll = this.patterns.content?.roll?.exec(url)
        if (roll) {
            res.ids.rollId = roll[1]
            res.metadata.isRoll = true
            res.metadata.contentType = 'roll'
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
        return `https://dispo.fun/@${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'roll') {
            return `https://dispo.fun/r/${id}`
        }
        return ''
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 