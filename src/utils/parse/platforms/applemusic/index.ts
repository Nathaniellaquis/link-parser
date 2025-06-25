import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

const LOCALE = '[a-z]{2}(?:-[a-z]{2})?'

export const applemusic: PlatformModule = {
    id: Platforms.AppleMusic,
    name: 'Apple Music',
    color: '#fa243c',

    domains: ['music.apple.com'],

    patterns: {
        profile: new RegExp(`^https?:\\/\\/music\\.apple\\.com\\/${LOCALE}\\/artist\\/[^/]+\\/(\\d+)\\/?$`, 'i'),
        handle: /^\d+$/, // artist id
        content: {
            album: new RegExp(`^https?:\\/\\/music\\.apple\\.com\\/${LOCALE}\\/album\\/[^/]+\\/(\\d+)\\/?$`, 'i'),
            playlist: new RegExp(`^https?:\\/\\/music\\.apple\\.com\\/${LOCALE}\\/playlist\\/[^/]+\\/(pl\\..+)$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!url.includes('music.apple.com')) return false
        const p = this.patterns
        return (
            p.profile.test(url) ||
            !!p.content?.album?.test(url) ||
            !!p.content?.playlist?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this
        const art = patterns.profile.exec(url)
        if (art) {
            res.ids.artistId = art[1]
            res.metadata.contentType = 'artist'
            res.metadata.isProfile = true
            return
        }
        const alb = patterns.content?.album?.exec(url)
        if (alb) {
            res.ids.albumId = alb[1]
            res.metadata.contentType = 'album'
            res.metadata.isAlbum = true
            return
        }
        const pl = patterns.content?.playlist?.exec(url)
        if (pl) {
            res.ids.playlistId = pl[1]
            res.metadata.contentType = 'playlist'
            res.metadata.isPlaylist = true
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(artistId: string): string {
        // cannot know locale and artist slug; basic form
        return `https://music.apple.com/us/artist/id${artistId}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 