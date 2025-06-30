import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['rumble.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const rumble: PlatformModule = {
    id: Platforms.Rumble,
    name: 'Rumble',
    color: '#60d669',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/(?:c(?:/)?|user/)?([A-Za-z0-9_-]{3,30})/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9_-]{3,30}$/,
        content: {
            video: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-z0-9]{6,})-[a-z0-9-]+\\.html${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) || !!(this.patterns.content?.video?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const vid = this.patterns.content?.video?.exec(url)
        if (vid) {
            res.ids.videoId = vid[1]
            res.metadata.isVideo = true
            res.metadata.contentType = 'video'
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

    buildProfileUrl(handle: string): string {
        return `https://rumble.com/c/${handle}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 