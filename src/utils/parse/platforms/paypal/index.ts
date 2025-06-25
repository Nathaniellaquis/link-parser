import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const paypal: PlatformModule = {
    id: Platforms.PayPal,
    name: 'PayPal',
    color: '#003087',

    domains: ['paypal.me', 'paypal.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?(?:paypal\.me|paypal\.com\/paypalme)\/([A-Za-z0-9]{1,20})\/?$/i,
        handle: /^[A-Za-z0-9]{1,20}$/,
        content: {
            payment: /^https?:\/\/(?:www\.)?(?:paypal\.me|paypal\.com\/paypalme)\/([A-Za-z0-9]{1,20})\/(\d+(?:\.?\d{1,2})?)([A-Za-z]{3})?\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('paypal.')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.payment?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this
        const pay = patterns.content?.payment?.exec(url)
        if (pay) {
            res.username = pay[1]
            res.ids.amount = pay[2]
            if (pay[3]) res.ids.currency = pay[3]
            res.metadata.isPayment = true
            res.metadata.contentType = 'payment'
            return
        }

        const prof = patterns.profile.exec(url)
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
        return `https://paypal.me/${username}`
    },

    normalizeUrl(url: string): string {
        url = url.replace(/^http:\/\//, 'https://')
        url = url.replace(/www\./, '')
        if (url.includes('paypal.com/paypalme/')) {
            url = url.replace('paypal.com/paypalme/', 'paypal.me/')
        }
        return url.replace(/\/$/, '')
    },
} 