import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const stereo: PlatformModule = {
    id: Platforms.Stereo,
    name: 'Stereo',
    color: '#FF6F61',

    domains: ['stereo.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?stereo\.com\/([A-Za-z0-9_.-]{3,30})\/?$/i,
        handle: /^[A-Za-z0-9_.-]{3,30}$/,
        content: {
            show: /^https?:\/\/(?:www\.)?stereo\.com\/s\/([A-Za-z0-9]+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('stereo.com')) return false
        return this.patterns.profile.test(url) || !!this.patterns.content?.show?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const show = this.patterns.content?.show?.exec(url)
        if (show) {
            res.ids.showId = show[1]
            res.metadata.isShow = true
            res.metadata.contentType = 'show'
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

    buildProfileUrl(username: string): string {
        return `https://stereo.com/${username}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'show') return `https://stereo.com/s/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 