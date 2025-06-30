import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['bandlab.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

export const bandlab: PlatformModule = {
    id: Platforms.BandLab,
    name: 'BandLab',
    color: '#DC2027',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
        handle: usernamePattern,
        content: {
            song: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.song?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const s = this.patterns.content?.song?.exec(url)
        if (s) {
            result.username = s[1]
            result.ids.songSlug = s[2]
            result.metadata.isAudio = true
            result.metadata.contentType = 'song'
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
        return `https://www.bandlab.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'song') return `https://www.bandlab.com/${id}`
        return `https://www.bandlab.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 