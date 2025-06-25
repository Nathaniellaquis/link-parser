import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const vimeo: PlatformModule = {
    id: Platforms.Vimeo,
    name: 'Vimeo',
    color: '#1AB7EA',

    domains: ['vimeo.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?vimeo\.com\/(?:user\d+|[A-Za-z0-9_]{3,32})\/?$/i,
        handle: /^(?:user\d+|[A-Za-z0-9_]{3,32})$/,
        content: {
            video: /^https?:\/\/(?:www\.)?vimeo\.com\/(\d{6,12})\/?$/i,
            channel: /^https?:\/\/(?:www\.)?vimeo\.com\/channels\/([A-Za-z0-9_-]{3,32})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('vimeo.com')) return false
        const { patterns } = this
        return (
            patterns.profile.test(url) ||
            !!patterns.content?.video?.test(url) ||
            !!patterns.content?.channel?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this

        const videoMatch = patterns.content?.video?.exec(url)
        if (videoMatch) {
            res.ids.videoId = videoMatch[1]
            res.metadata.isVideo = true
            res.metadata.contentType = 'video'
            return
        }
        const channelMatch = patterns.content?.channel?.exec(url)
        if (channelMatch) {
            res.username = channelMatch[1]
            res.metadata.isChannel = true
            res.metadata.contentType = 'channel'
            return
        }
        const profMatch = patterns.profile.exec(url)
        if (profMatch) {
            // capture username or userID depending
            const path = url.split('/').pop() || ''
            res.username = path
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://vimeo.com/${username}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 