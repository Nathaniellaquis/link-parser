import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const opensea: PlatformModule = {
    id: Platforms.OpenSea,
    name: 'OpenSea',
    color: '#2081E2',

    domains: ['opensea.io'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?opensea\.io\/([A-Za-z0-9_.-]{3,40})\/?$/i,
        handle: /^[A-Za-z0-9_.-]{3,40}$/,
        content: {
            collection: /^https?:\/\/(?:www\.)?opensea\.io\/collection\/([A-Za-z0-9_-]+)\/?$/i,
            asset: /^https?:\/\/(?:www\.)?opensea\.io\/assets\/([^/]+)\/([^/]+)\/([^/]+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('opensea.io')) return false
        const { patterns } = this
        return (
            patterns.profile.test(url) ||
            !!patterns.content?.collection?.test(url) ||
            !!patterns.content?.asset?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const asset = this.patterns.content?.asset?.exec(url)
        if (asset) {
            res.ids.chain = asset[1]
            res.ids.contract = asset[2]
            res.ids.tokenId = asset[3]
            res.metadata.isAsset = true
            res.metadata.contentType = 'asset'
            return
        }
        const col = this.patterns.content?.collection?.exec(url)
        if (col) {
            res.ids.collectionName = col[1]
            res.metadata.isCollection = true
            res.metadata.contentType = 'collection'
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
        return `https://opensea.io/${username}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'collection') return `https://opensea.io/collection/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 