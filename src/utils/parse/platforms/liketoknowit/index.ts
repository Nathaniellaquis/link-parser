import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const liketoknowit: PlatformModule = {
    id: Platforms.LikeToKnowIt,
    name: 'LikeToKnowIt',
    color: '#000000',

    domains: ['liketoknow.it'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?liketoknow\.it\/([A-Za-z0-9_.-]{3,40})\/?$/i,
        handle: /^[A-Za-z0-9_.-]{3,40}$/,
        content: {
            post: /^https?:\/\/(?:www\.)?liketoknow\.it\/p\/([A-Za-z0-9]+)\/?$/i,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('liketoknow.it')) return false
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
        return `https://liketoknow.it/${username}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'post') return `https://liketoknow.it/p/${id}`
        return ''
    },

    normalizeUrl(url: string): string {
        return url.replace(/^http:\/\//, 'https://').replace(/www\./, '').replace(/\/$/, '')
    },
} 