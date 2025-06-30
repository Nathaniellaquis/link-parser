import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['tidal.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const tidal: PlatformModule = {
    id: Platforms.Tidal,
    name: 'Tidal',
    color: '#000000',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/artist/(\\d+)/?${QUERY_HASH}$`, 'i'),
        handle: /^\d+$/,
        content: {
            album: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/album/(\\d+)/?${QUERY_HASH}$`, 'i'),
            track: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/track/(\\d+)/?${QUERY_HASH}$`, 'i'),
            playlist: new RegExp(`^https?://${DOMAIN_PATTERN}/browse/playlist/([A-Za-z0-9-]{36})/?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) ||
            !!(this.patterns.content?.album?.test(url)) ||
            !!(this.patterns.content?.track?.test(url)) ||
            !!(this.patterns.content?.playlist?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const art = this.patterns.profile.exec(url)
        if (art) {
            res.ids.artistId = art[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'artist'
            return
        }
        const alb = this.patterns.content?.album?.exec(url)
        if (alb) {
            res.ids.albumId = alb[1]
            res.metadata.isAlbum = true
            res.metadata.contentType = 'album'
            return
        }
        const tr = this.patterns.content?.track?.exec(url)
        if (tr) {
            res.ids.trackId = tr[1]
            res.metadata.isSingle = true
            res.metadata.contentType = 'track'
            return
        }
        const pl = this.patterns.content?.playlist?.exec(url)
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
        return normalize(url)
    },
} 