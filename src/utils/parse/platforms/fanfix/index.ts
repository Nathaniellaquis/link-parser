import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const fanfix: PlatformModule = {
    id: Platforms.Fanfix,
    name: 'Fanfix',
    color: '#FF6F61',

    domains: ['fanfix.io'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?fanfix\.io\/@([A-Za-z0-9_.-]{3,30})\/?$/i,
        handle: /^@?[A-Za-z0-9_.-]{3,30}$/,
        content: {
            post: /^https?:\/\/(?:www\.)?fanfix\.io\/post\/(\d+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('fanfix.io')) return false
        return this.patterns.profile.test(url) || !!this.patterns.content?.post?.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const post = this.patterns.content?.post?.exec(url)
        if (post) {
            res.ids.postId = post[1]
            res.metadata.isPost = true
            res.metadata.contentType = 'post'
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
        return `https://fanfix.io/@${username.replace(/^@/, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'post') return `https://fanfix.io/post/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 