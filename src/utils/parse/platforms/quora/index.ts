import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { QUERY_HASH } from '../../utils/constants'

export const quora: PlatformModule = {
    id: Platforms.Quora,
    name: 'Quora',
    color: '#B92B27',

    domains: ['quora.com'],

    patterns: {
        profile: new RegExp(`^https?:\\/\\/(?:www\\.)?quora\\.com\\/profile\\/([A-Za-z0-9-]+)\\/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9-]+$/,
        content: {
            question: new RegExp(`^https?:\\/\\/(?:www\\.)?quora\\.com\\/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)\\/?${QUERY_HASH}$`, 'i'),
            answer: new RegExp(`^https?:\\/\\/(?:www\\.)?quora\\.com\\/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)\\/answer\\/([A-Za-z0-9-]+)\\/?${QUERY_HASH}$`, 'i'),
            space: new RegExp(`^https?:\\/\\/(?:www\\.)?quora\\.com\\/q\\/([A-Za-z0-9-]+)\\/?${QUERY_HASH}$`, 'i')
        }
    },

    detect(url: string): boolean {
        if (!url.includes('quora.com')) return false
        if (this.patterns.profile.test(url)) return true
        if (this.patterns.content) {
            for (const pattern of Object.values(this.patterns.content)) {
                if (pattern && pattern.test(url)) return true
            }
        }
        return false
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
        const spaceMatch = this.patterns.content?.space?.exec(url)
        if (spaceMatch) {
            result.ids.spaceId = spaceMatch[1]
            result.metadata.contentType = 'space'
            return
        }

        // Answer URL
        const answerMatch = this.patterns.content?.answer?.exec(url)
        if (answerMatch) {
            result.ids.questionSlug = answerMatch[1]
            result.username = answerMatch[2]
            result.metadata.isAnswer = true
            result.metadata.contentType = 'answer'
            return
        }

        // Question
        const questionMatch = this.patterns.content?.question?.exec(url)
        if (questionMatch) {
            result.ids.questionSlug = questionMatch[1]
            result.metadata.isQuestion = true
            result.metadata.contentType = 'question'
            return
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