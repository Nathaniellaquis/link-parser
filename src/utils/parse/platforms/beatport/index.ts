import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const slug = '[A-Za-z0-9-]+'

const artistRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?beatport\\.com\\/artist\\/(${slug})\\/(\\d{1,7})\\/?$`, 'i')
const trackRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?beatport\\.com\\/track\\/(${slug})\\/(\\d{1,7})\\/?$`, 'i')
const releaseRegex = new RegExp(`^https?:\\/\\/(?:www\\.)?beatport\\.com\\/release\\/(${slug})\\/(\\d{1,7})\\/?$`, 'i')

export const beatport: PlatformModule = {
    id: Platforms.Beatport,
    name: 'Beatport',
    color: '#A6CE38',

    domains: ['beatport.com'],

    patterns: {
        profile: artistRegex,
        handle: /^[A-Za-z0-9-]{3,50}$/,
        content: {
            track: trackRegex,
            release: releaseRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('beatport.com')) return false
        return artistRegex.test(url) || trackRegex.test(url) || releaseRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const tr = trackRegex.exec(url)
        if (tr) {
            result.ids.trackId = tr[2]
            result.metadata.isAudio = true
            result.metadata.contentType = 'track'
            return
        }
        const rel = releaseRegex.exec(url)
        if (rel) {
            result.ids.releaseId = rel[2]
            result.metadata.contentType = 'release'
            return
        }
        const ar = artistRegex.exec(url)
        if (ar) {
            result.username = ar[1]
            result.userId = ar[2]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return /^[A-Za-z0-9-]{3,50}$/.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.beatport.com/artist/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'track') return `https://www.beatport.com/track/slug/${id}`
        if (type === 'release') return `https://www.beatport.com/release/slug/${id}`
        return `https://www.beatport.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 