import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const vsco: PlatformModule = {
    id: Platforms.VSCO,
    name: 'VSCO',
    color: '#000000',

    domains: ['vsco.co'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?vsco\.co\/([A-Za-z0-9_.-]{3,40})\/?$/i,
        handle: /^@?[A-Za-z0-9_.-]{3,40}$/,
        content: {
            image: /^https?:\/\/(?:www\.)?vsco\.co\/([A-Za-z0-9_.-]{3,40})\/media\/(\d+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('vsco.co')) return false
        const { patterns } = this
        return patterns.profile.test(url) || !!patterns.content?.image?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const img = this.patterns.content?.image?.exec(url)
        if (img) {
            res.username = img[1]
            res.ids.imageId = img[2]
            res.metadata.isImage = true
            res.metadata.contentType = 'image'
            return
        }
        const prof = this.patterns.profile.exec(url)
        if (prof) {
            res.username = prof[1]
            res.metadata.isProfile = true
            res.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://vsco.co/${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'image') {
            return `https://vsco.co/undefined/media/${id}` // not possible without username; leave blank.
        }
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 