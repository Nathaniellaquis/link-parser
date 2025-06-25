import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const imdb: PlatformModule = {
    id: Platforms.IMDb,
    name: 'IMDb',
    color: '#F5C518',

    domains: ['imdb.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?imdb\.com\/name\/(nm\d{7,8})\/?$/i,
        handle: /^nm\d{7,8}$/,
        content: {
            title: /^https?:\/\/(?:www\.)?imdb\.com\/title\/(tt\d{7,8})\/?$/i,
            company: /^https?:\/\/(?:www\.)?imdb\.com\/company\/(co\d{7,8})\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('imdb.com')) return false
        const { patterns } = this
        return (
            patterns.profile.test(url) ||
            !!patterns.content?.title?.test(url) ||
            !!patterns.content?.company?.test(url)
        )
    },

    extract(url: string, res: ParsedUrl): void {
        const title = this.patterns.content?.title?.exec(url)
        if (title) {
            res.ids.titleId = title[1]
            res.metadata.isTitle = true
            res.metadata.contentType = 'title'
            return
        }
        const company = this.patterns.content?.company?.exec(url)
        if (company) {
            res.ids.companyId = company[1]
            res.metadata.isCompany = true
            res.metadata.contentType = 'company'
            return
        }
        const prof = this.patterns.profile.exec(url)
        if (prof) {
            res.userId = prof[1]
            res.metadata.isPerson = true
            res.metadata.contentType = 'person'
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(id: string): string {
        return `https://imdb.com/name/${id}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'title') return `https://imdb.com/title/${id}`
        if (contentType === 'company') return `https://imdb.com/company/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 