import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const venmo: PlatformModule = {
    id: Platforms.Venmo,
    name: 'Venmo',
    color: '#3D95CE',

    domains: ['venmo.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?venmo\.com\/([A-Za-z0-9_\-]{3,})\/?$/i,
        handle: /^[A-Za-z0-9_\-]{3,}$/,
        content: {
            qr: /^https?:\/\/(?:www\.)?venmo\.com\/code\?user_id=(\d+)/i,
            payment: /^https?:\/\/(?:www\.)?venmo\.com\/([A-Za-z0-9_\-]{3,})\/?\?txn=pay/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('venmo.com')) return false
        // Must match at least one known pattern
        if (this.patterns.profile.test(url)) return true
        if (this.patterns.content?.qr?.test(url)) return true
        if (this.patterns.content?.payment?.test(url)) return true
        return false
    },

    extract(url: string, res: ParsedUrl): void {
        // QR Code URL
        const qrMatch = this.patterns.content?.qr?.exec(url)
        if (qrMatch) {
            res.ids.qrUserId = qrMatch[1]
            res.metadata.isQr = true
            res.metadata.contentType = 'qr'
            return
        }

        // Payment URL (same as profile but with txn param)
        const payMatch = this.patterns.content?.payment?.exec(url)
        if (payMatch) {
            res.username = payMatch[1]
            res.metadata.isPayment = true
            res.metadata.contentType = 'payment'
            return
        }

        // Profile URL
        const profMatch = this.patterns.profile.exec(url)
        if (profMatch) {
            res.username = profMatch[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle.replace('@', ''))
    },

    buildProfileUrl(username: string): string {
        return `https://venmo.com/${username.replace('@', '')}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 