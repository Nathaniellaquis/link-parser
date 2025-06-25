import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Quora patterns
// Profile: https://www.quora.com/profile/First-Last
const profileRegex = /^https?:\/\/(?:www\.)?quora\.com\/profile\/([A-Za-z0-9._-]{2,60})\/?$/i

// Question: https://www.quora.com/Why-is-the-sky-blue or with share params
const questionRegex = /^https?:\/\/(?:www\.)?quora\.com\/([A-Za-z0-9._-]{5,})(?:\?.*)?$/i

// Answer: https://www.quora.com/Why-is-the-sky-blue/answer/First-Last
const answerRegex = /^https?:\/\/(?:www\.)?quora\.com\/([A-Za-z0-9._-]{5,})\/answer\/([A-Za-z0-9._-]{2,60})\/?$/i

export const quora: PlatformModule = {
    id: Platforms.Quora,
    name: 'Quora',
    color: '#B92B27',

    domains: ['quora.com'],

    patterns: {
        profile: profileRegex,
        handle: /^[A-Za-z0-9._-]{2,60}$/,
        content: {
            question: questionRegex,
            answer: answerRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('quora.com')) return false
        return profileRegex.test(url) || answerRegex.test(url) || questionRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const ans = answerRegex.exec(url)
        if (ans) {
            result.ids.questionSlug = ans[1]
            result.username = ans[2]
            result.metadata.isAnswer = true
            result.metadata.contentType = 'answer'
            return
        }

        const prof = profileRegex.exec(url)
        if (prof) {
            result.username = prof[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
            return
        }

        const q = questionRegex.exec(url)
        if (q) {
            result.ids.questionSlug = q[1]
            result.metadata.isQuestion = true
            result.metadata.contentType = 'question'
            return
        }
    },

    validateHandle(handle: string): boolean {
        return /^[A-Za-z0-9._-]{2,60}$/.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.quora.com/profile/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        // For Quora, id represents the path after domain. Caller constructs accordingly.
        return `https://www.quora.com/${id}`
    },

    normalizeUrl(url: string): string {
        // remove tracking params and anchors
        return normalize(url.replace(/\?.*$/, '').replace(/#.*$/, ''))
    },
} 