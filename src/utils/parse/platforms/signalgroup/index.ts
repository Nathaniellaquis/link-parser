import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['signal.group']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const signalgroup: PlatformModule = {
    id: Platforms.SignalGroup,
    name: 'SignalGroup',
    color: '#0080FF',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: /^$/,
        handle: /^$/,
        content: {
            group: new RegExp(`^https?://${DOMAIN_PATTERN}/#([A-Za-z0-9-_]{10,})/?${QUERY_HASH}$`, 'i')
        }
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return !!(this.patterns.content?.group?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const m = this.patterns.content?.group?.exec(url)
        if (m) {
            result.ids.groupCode = m[1]
            result.metadata.contentType = 'group'
        }
    },

    validateHandle(): boolean { return false },
    buildProfileUrl(): string { return 'https://signal.org' },
    buildContentUrl(_: string, id: string): string { return `https://signal.group/#${id}` },
    normalizeUrl(url: string): string { return normalize(url) },
} 