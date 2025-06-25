import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

const BASE = 'https?:\\/\\/(?:www\\.)?tidal\\.com'

export const tidal: PlatformModule = {
    id: Platforms.Tidal,
    name: 'Tidal',
    color: '#000000',

    domains: ['tidal.com'],

    patterns: {
        profile: new RegExp(`${BASE}\\/browse\\/artist\\/(\\d+)\\/?$`, 'i'),
        handle: /^\\d+$/,
        content: {
            album: new RegExp(`${BASE}\\/browse\\/album\\/(\\d+)\\/?$`, 'i'),
            track: new RegExp(`${BASE}\\/browse\\/track\\/(\\d+)\\/?$`, 'i'),
            playlist: new RegExp(`${BASE}\\/browse\\/playlist\\/([A-Za-z0-9-]{36})\\/?$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!url.includes('tidal.com')) return false
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

        const art = patterns.profile.exec(url)
        if (art) {
            res.ids.artistId = art[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'artist'
            return
        }
        const alb = patterns.content?.album?.exec(url)
        if (alb) {
            res.ids.albumId = alb[1]
            res.metadata.isAlbum = true
            res.metadata.contentType = 'album'
            return
        }
        const tr = patterns.content?.track?.exec(url)
        if (tr) {
            res.ids.trackId = tr[1]
            res.metadata.isSingle = true
            res.metadata.contentType = 'track'
            return
        }
        const pl = patterns.content?.playlist?.exec(url)
        if (pl) {
            res.ids.playlistId = pl[1]
            res.metadata.isPlaylist = true
            res.metadata.contentType = 'playlist'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(artistId: string): string {
        return `https://tidal.com/browse/artist/${artistId}`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 