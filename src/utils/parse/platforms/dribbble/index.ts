import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['dribbble.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

export const dribbble: PlatformModule = {
    id: Platforms.Dribbble,
    name: 'Dribbble',
    color: '#EA4C89',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9_-]{3,32})/?${QUERY_HASH}$`, 'i'),
        handle: usernamePattern,
        content: {
            shot: new RegExp(`^https?://${DOMAIN_PATTERN}/shots/(\\d{5,})(?:-[A-Za-z0-9-]*)?/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.shot?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const s = this.patterns.content?.shot?.exec(url)
        if (s) {
            result.ids.shotId = s[1]
            result.metadata.isPost = true
            result.metadata.contentType = 'shot'
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
        return `https://dribbble.com/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'shot') return `https://dribbble.com/shots/${id}`
        return `https://dribbble.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 