import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const triller: PlatformModule = {
    id: Platforms.Triller,
    name: 'Triller',
    color: '#FF006E',

    domains: ['triller.co'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?triller\.co\/@([A-Za-z0-9_.]{3,30})\/?$/i,
        handle: /^@?[A-Za-z0-9_.]{3,30}$/,
        content: {
            video: /^https?:\/\/(?:www\.)?triller\.co\/watch\?v=([A-Za-z0-9_-]{8,})/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('triller.co')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.video?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const video = this.patterns.content?.video?.exec(url)
        if (video) {
            res.ids.videoId = video[1]
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

    buildProfileUrl(username: string): string {
        return `https://triller.co/@${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'video') {
            return `https://triller.co/watch?v=${id}`
        }
        return ''
    },

    normalizeUrl(url: string): string {
        url = url.replace(/^http:\/\//, 'https://')
        url = url.replace(/www\./, '')
        return url.replace(/\/$/, '')
    },
} 