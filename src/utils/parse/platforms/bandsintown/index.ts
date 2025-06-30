import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['bandsintown.com']

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains)

export const bandsintown: PlatformModule = {
    id: Platforms.BandsInTown,
    name: 'BandsInTown',
    color: '#00B4B3',

    domains: domains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/a/(\\d+)/?${QUERY_HASH}$`, 'i'),
        handle: /^\d+$/,
        content: {
            event: new RegExp(`^https?://${DOMAIN_PATTERN}/e/(\\d+)/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.event?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const ev = this.patterns.content?.event?.exec(url)
        if (ev) {
            res.ids.eventId = ev[1]
            res.metadata.isEvent = true
            res.metadata.contentType = 'event'
            return
        }
        const art = this.patterns.profile.exec(url)
        if (art) {
            res.ids.artistId = art[1]
            res.metadata.isArtist = true
            res.metadata.contentType = 'artist'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(id: string): string {
        return `https://bandsintown.com/a/${id}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'event') return `https://bandsintown.com/e/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 