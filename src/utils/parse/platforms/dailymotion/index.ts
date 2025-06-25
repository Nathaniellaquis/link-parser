import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const dailymotion: PlatformModule = {
    id: Platforms.Dailymotion,
    name: 'Dailymotion',
    color: '#0066DC',

    domains: ['dailymotion.com', 'dai.ly'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?dailymotion\.com\/(?!video(?:\/|$))([A-Za-z0-9_-]{3,30})\/?$/i,
        handle: /^[A-Za-z0-9_-]{3,30}$/,
        content: {
            video: /^https?:\/\/(?:www\.)?(?:dailymotion\.com\/video|dai\.ly)\/([A-Za-z0-9]{6,10})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!(url.includes('dailymotion.com') || url.includes('dai.ly'))) return false
        const p = this.patterns
        return p.profile.test(url) || !!p.content?.video?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this
        const vid = patterns.content?.video?.exec(url)
        if (vid) {
            res.ids.videoId = vid[1]
            res.metadata.isVideo = true
            res.metadata.contentType = 'video'
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

    buildProfileUrl(handle: string): string {
        return `https://www.dailymotion.com/${handle}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 