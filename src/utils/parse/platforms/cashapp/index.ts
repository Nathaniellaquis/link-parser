import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const cashapp: PlatformModule = {
    id: Platforms.CashApp,
    name: 'Cash App',
    color: '#00C244',

    domains: ['cash.app'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?cash\.app\/\$([A-Za-z][A-Za-z0-9_]{1,20})\/?$/i,
        handle: /^\$?[A-Za-z][A-Za-z0-9_]{1,20}$/,
        content: {
            payment: /^https?:\/\/(?:www\.)?cash\.app\/\$([A-Za-z][A-Za-z0-9_]{1,20})\/(?:\d+(?:\.\d{2})?)$/i, // amount in cents or dollars
            amountQuery: /^https?:\/\/(?:www\.)?cash\.app\/\$([A-Za-z][A-Za-z0-9_]{1,20})\/?\?amount=(\d+(?:\.\d{2})?)$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('cash.app')) return false
        if (this.patterns.profile.test(url)) return true
        if (this.patterns.content?.payment?.test(url)) return true
        if (this.patterns.content?.amountQuery?.test(url)) return true
        return false
    },

    extract(url: string, res: ParsedUrl): void {
        // amount in path
        const payPath = this.patterns.content?.payment?.exec(url)
        if (payPath) {
            res.username = payPath[1]
            res.ids.amount = payPath[2]
            res.metadata.isPayment = true
            res.metadata.contentType = 'payment'
            return
        }
        // amount query
        const payQuery = this.patterns.content?.amountQuery?.exec(url)
        if (payQuery) {
            res.username = payQuery[1]
            res.ids.amount = payQuery[2]
            res.metadata.isPayment = true
            res.metadata.contentType = 'payment'
            return
        }
        // profile
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
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 