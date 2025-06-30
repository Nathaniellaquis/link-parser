import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['clubhouse.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const clubhouse: PlatformModule = {
    id: Platforms.Clubhouse,
    name: 'Clubhouse',
    color: '#F5DF4D',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/@([A-Za-z0-9_.]{3,30})/?${QUERY_HASH}$`, 'i'),
        handle: /^@?[A-Za-z0-9_.]{3,30}$/,
        content: {
            club: new RegExp(`^https?://${DOMAIN_PATTERN}/club/([A-Za-z0-9_.-]{3,50})/?${QUERY_HASH}$`, 'i'),
            event: new RegExp(`^https?://${DOMAIN_PATTERN}/event/([A-Za-z0-9]{6,})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) ||
            !!(this.patterns.content?.club?.test(url)) ||
            !!(this.patterns.content?.event?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const clubMatch = this.patterns.content?.club?.exec(url)
        if (clubMatch) {
            res.ids.clubName = clubMatch[1]
            res.metadata.isClub = true
            res.metadata.contentType = 'club'
            return
        }
        const eventMatch = this.patterns.content?.event?.exec(url)
        if (eventMatch) {
            res.ids.eventId = eventMatch[1]
            res.metadata.isEvent = true
            res.metadata.contentType = 'event'
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
        return `https://clubhouse.com/@${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'club') return `https://clubhouse.com/club/${id}`
        if (contentType === 'event') return `https://clubhouse.com/event/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 