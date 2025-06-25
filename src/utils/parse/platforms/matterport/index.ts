import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const matterport: PlatformModule = {
    id: Platforms.Matterport,
    name: 'Matterport',
    color: '#000000',

    domains: ['matterport.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?matterport\.com\/users\/([A-Za-z0-9]+)\/?$/i,
        handle: /^[A-Za-z0-9]+$/,
        content: {
            space: /^https?:\/\/(?:www\.)?matterport\.com\/show\/\?m=([A-Za-z0-9]+)\/?$/i,
        }
    },

    detect(url: string): boolean {
        if (!url.includes('matterport.com')) return false
        return this.patterns.profile.test(url) || !!this.patterns.content?.space?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const sp = this.patterns.content?.space?.exec(url)
        if (sp) {
            res.ids.modelId = sp[1]
            res.metadata.isSpace = true
            res.metadata.contentType = 'space'
            return
        }
        const usr = this.patterns.profile.exec(url)
        if (usr) {
            res.ids.userId = usr[1]
            res.metadata.isUser = true
            res.metadata.contentType = 'user'
        }
    },

    validateHandle(handle: string): boolean { return this.patterns.handle.test(handle) },

    buildProfileUrl(id: string): string { return `https://matterport.com/users/${id}` },

    buildContentUrl(contentType: string, id: string): string { if (contentType === 'space') return `https://matterport.com/show/?m=${id}`; return '' },

    normalizeUrl(url: string): string { return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '') },
} 