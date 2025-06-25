import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

const LOCALE = '(?:[a-z]{2}(?:-[a-z]{2})?)'
const BASE = `https?:\\/\\/(?:www\\.)?deezer\\.com\\/`

export const deezer: PlatformModule = {
    id: Platforms.Deezer,
    name: 'Deezer',
    color: '#EF5466',

    domains: ['deezer.com'],

    patterns: {
        profile: new RegExp(`^${BASE}(?:${LOCALE}\\/)?artist\\/(\\d+)\\/?$`, 'i'),
        handle: /^\d+$/, // artist id numeric
        content: {
            album: new RegExp(`^${BASE}(?:${LOCALE}\\/)?album\\/(\\d+)\\/?$`, 'i'),
            track: new RegExp(`^${BASE}(?:${LOCALE}\\/)?track\\/(\\d+)\\/?$`, 'i'),
            playlist: new RegExp(`^${BASE}(?:${LOCALE}\\/)?playlist\\/(\\d+)\\/?$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!url.includes('deezer.com')) return false
        const p = this.patterns
        return (
            p.profile.test(url) ||
            !!p.content?.album?.test(url) ||
            !!p.content?.track?.test(url) ||
            !!p.content?.playlist?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const { patterns } = this
        const artist = patterns.profile.exec(url)
        if (artist) {
            res.ids.artistId = artist[1]
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
        const tr = patterns.content?.track?.exec(url)
        if (tr) {
            res.ids.trackId = tr[1]
            res.metadata.contentType = 'track'
            res.metadata.isSingle = true
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
        return `https://deezer.com/artist/${artistId}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 