import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const audiomack: PlatformModule = {
    id: Platforms.Audiomack,
    name: 'Audiomack',
    color: '#ff8800',

    domains: ['audiomack.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?audiomack\.com\/([a-z0-9_-]{3,30})\/?$/i,
        handle: /^[a-z0-9_-]{3,30}$/i,
        content: {
            song: /^https?:\/\/(?:www\.)?audiomack\.com\/([a-z0-9_-]{3,30})\/song\/([a-z0-9_-]{3,120})\/?$/i,
            album: /^https?:\/\/(?:www\.)?audiomack\.com\/([a-z0-9_-]{3,30})\/album\/([a-z0-9_-]{3,120})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('audiomack.com')) return false
        const p = this.patterns
        return (
            p.profile.test(url) ||
            !!p.content?.song?.test(url) ||
            !!p.content?.album?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this

        const prof = patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'artist'
            return
        }

        const song = patterns.content?.song?.exec(url)
        if (song) {
            res.username = song[1]
            res.ids.trackSlug = song[2]
            res.metadata.isSingle = true
            res.metadata.contentType = 'track'
            return
        }

        const album = patterns.content?.album?.exec(url)
        if (album) {
            res.username = album[1]
            res.ids.albumSlug = album[2]
            res.metadata.isAlbum = true
            res.metadata.contentType = 'album'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(handle: string): string {
        return `https://audiomack.com/${handle}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 