import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['music.apple.com']

// Create the domain pattern using the config values
// const DOMAIN_PATTERN = createDomainPattern(domains)

const LOCALE = '[a-z]{2}(?:-[a-z]{2})?'

export const applemusic: PlatformModule = {
    id: Platforms.AppleMusic,
    name: 'Apple Music',
    color: '#fa243c',

    domains: domains,

    patterns: {
        // Note: Apple Music patterns need locale capturing and can't use DOMAIN_PATTERN due to complex path structure
        profile: new RegExp(`^https?://music\\.apple\\.com/${LOCALE}/artist/[^/]+/(\\d+)/?${QUERY_HASH}$`, 'i'),
        handle: /^\d+$/, // artist id
        content: {
            album: new RegExp(`^https?://music\\.apple\\.com/${LOCALE}/album/[^/]+/(\\d+)/?${QUERY_HASH}$`, 'i'),
            playlist: new RegExp(`^https?://music\\.apple\\.com/${LOCALE}/playlist/[^/]+/(pl\\..+)${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) ||
            !!(this.patterns.content?.album?.test(url)) ||
            !!(this.patterns.content?.playlist?.test(url))
    },

    extract(url: string, res: ParsedUrl): void {
        const art = this.patterns.profile.exec(url)
        if (art) {
            res.ids.artistId = art[1]
            res.metadata.contentType = 'artist'
            res.metadata.isProfile = true
            return
        }
        const alb = this.patterns.content?.album?.exec(url)
        if (alb) {
            res.ids.albumId = alb[1]
            res.metadata.contentType = 'album'
            res.metadata.isAlbum = true
            return
        }
        const pl = this.patterns.content?.playlist?.exec(url)
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
        return normalize(url)
    },
} 