import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['cash.app']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const cashapp: PlatformModule = {
    id: Platforms.CashApp,
    name: 'Cash App',
    color: '#00C244',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/\\$([A-Za-z][A-Za-z0-9_]{1,20})/?${QUERY_HASH}$`, 'i'),
        handle: /^\$?[A-Za-z][A-Za-z0-9_]{1,20}$/,
        content: {
            payment: new RegExp(`^https?://${DOMAIN_PATTERN}/\\$([A-Za-z][A-Za-z0-9_]{1,20})/\\d+(?:\\.\\d{2})?/?${QUERY_HASH}$`, 'i'),
            amountQuery: new RegExp(`^https?://${DOMAIN_PATTERN}/\\$([A-Za-z][A-Za-z0-9_]{1,20})/?\\?amount=(\\d+(?:\\.\\d{2})?)${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false

        // Check if it matches any valid pattern
        if (this.patterns.profile.test(url)) return true
        if (this.patterns.content) {
            for (const pattern of Object.values(this.patterns.content)) {
                if (pattern && pattern.test(url)) return true
            }
        }

        return false
    },

    extract(url: string, res: ParsedUrl): void {
        // Payment path - no amount capture
        const payPath = this.patterns.content?.payment?.exec(url)
        if (payPath) {
            res.username = payPath[1]
            // No amount capture for path pattern
            res.metadata.isPayment = true
            res.metadata.contentType = 'payment'
            return
        }

        // Amount query - captures amount
        const payQuery = this.patterns.content?.amountQuery?.exec(url)
        if (payQuery) {
            res.username = payQuery[1]
            res.ids.amount = payQuery[2]
            res.metadata.isPayment = true
            res.metadata.contentType = 'payment'
            return
        }

        // Profile
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
        return `https://cash.app/$${username.replace(/^\$/, '')}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 