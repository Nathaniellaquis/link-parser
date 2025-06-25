import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const gofundme: PlatformModule = {
    id: Platforms.GoFundMe,
    name: 'GoFundMe',
    color: '#02A95C',

    domains: ['gofundme.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?gofundme\.com\/u\/([A-Za-z0-9_.-]{3,30})\/?$/i,
        handle: /^@?[A-Za-z0-9_.-]{3,30}$/,
        content: {
            campaign: /^https?:\/\/(?:www\.)?gofundme\.com\/f\/([A-Za-z0-9_-]{3,100})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('gofundme.com')) return false
        return this.patterns.profile.test(url) || !!this.patterns.content?.campaign?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const camp = this.patterns.content?.campaign?.exec(url)
        if (camp) {
            res.ids.campaignSlug = camp[1]
            res.metadata.isCampaign = true
            res.metadata.contentType = 'campaign'
            return
        }
        const user = this.patterns.profile.exec(url)
        if (user) {
            res.username = user[1]
            res.metadata.isUser = true
            res.metadata.contentType = 'user'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://gofundme.com/u/${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, slug: string): string {
        if (contentType === 'campaign') return `https://gofundme.com/f/${slug}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 