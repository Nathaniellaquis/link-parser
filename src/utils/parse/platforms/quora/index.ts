import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const quora: PlatformModule = {
    id: Platforms.Quora,
    name: 'Quora',
    color: '#B92B27',

    domains: ['quora.com'],

    patterns: {
        profile: /^https?:\/\/(?:www\.)?quora\.com\/profile\/([A-Za-z0-9-]+)/i,
        handle: /^[A-Za-z0-9-]+$/,
        content: {
            question: /^https?:\/\/(?:www\.)?quora\.com\/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)/i,
            space: /^https?:\/\/(?:www\.)?quora\.com\/q\/([A-Za-z0-9-]+)/i
        }
    },

    detect(url: string): boolean {
        return url.includes('quora.com')
    },

    extract(url: string, result: ParsedUrl): void {
        // Profile
        const profileMatch = url.match(this.patterns.profile)
        if (profileMatch) {
            result.username = profileMatch[1]
            result.metadata.isProfile = true
            return
        }

        // Space
        if (this.patterns.content?.space) {
            const spaceMatch = url.match(this.patterns.content.space)
            if (spaceMatch) {
                result.ids.spaceId = spaceMatch[1]
                result.metadata.contentType = 'space'
                return
            }
        }

        // Question (catch-all for Quora URLs)
        if (this.patterns.content?.question) {
            const questionMatch = url.match(this.patterns.content.question)
            if (questionMatch) {
                result.ids.questionId = questionMatch[1]
                result.metadata.contentType = 'question'
            }
        }
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.quora.com/profile/${username}`
    },

    buildContentUrl(_type: string, id: string): string {
        return `https://www.quora.com/${id}`
    },

    normalizeUrl(url: string): string {
        return url.split('?')[0]
    },
} 