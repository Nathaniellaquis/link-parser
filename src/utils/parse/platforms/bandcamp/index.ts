import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bandcamp: PlatformModule = {
    id: Platforms.Bandcamp,
    name: 'Bandcamp',
    color: '#629aa9',

    // bandcamp uses subdomains per artist
    domains: ['bandcamp.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?([a-z0-9-]{2,60})\.bandcamp\.com\/?$/i,
        handle: /^[a-z0-9-]{2,60}$/i,
        content: {
            album: /^https?:\/\/(?:www\.)?([a-z0-9-]{2,60})\.bandcamp\.com\/album\/([a-z0-9-]+)\/?$/i,
            track: /^https?:\/\/(?:www\.)?([a-z0-9-]{2,60})\.bandcamp\.com\/track\/([a-z0-9-]+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('.bandcamp.com')) return false
        const p = this.patterns
        return (
            p.profile.test(url) ||
            !!p.content?.album?.test(url) ||
            !!p.content?.track?.test(url)
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

        const alb = patterns.content?.album?.exec(url)
        if (alb) {
            const artist = alb[1]
            const slug = alb[2]
            res.username = artist
            res.ids.albumSlug = slug
            res.metadata.isAlbum = true
            res.metadata.contentType = 'album'
            return
        }

        const tr = patterns.content?.track?.exec(url)
        if (tr) {
            res.username = tr[1]
            res.ids.trackSlug = tr[2]
            res.metadata.isSingle = true
            res.metadata.contentType = 'track'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(handle: string): string {
        return `https://${handle}.bandcamp.com`
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/\/$/, '')
    },
} 