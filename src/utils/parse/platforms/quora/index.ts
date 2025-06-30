import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['quora.com']
const subdomains: string[] = []

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const quora: PlatformModule = {
    id: Platforms.Quora,
    name: 'Quora',
    color: '#B92B27',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://${DOMAIN_PATTERN}/profile/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
        handle: /^[A-Za-z0-9-]+$/,
        content: {
            question: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)/?${QUERY_HASH}$`, 'i'),
            answer: new RegExp(`^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)/answer/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
            space: new RegExp(`^https?://${DOMAIN_PATTERN}/q/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i')
        }
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
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
        const profileMatch = this.patterns.profile.exec(url)
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
        return normalize(url)
    },
} 