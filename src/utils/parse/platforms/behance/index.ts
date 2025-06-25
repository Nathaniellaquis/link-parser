import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const usernamePattern = /^[A-Za-z0-9_-]{3,32}$/

const profileRegex = /^https?:\/\/(?:www\.)?behance\.net\/([A-Za-z0-9_-]{3,32})\/?$/i
const projectRegex = /^https?:\/\/(?:www\.)?behance\.net\/gallery\/(\d{6,})\/[A-Za-z0-9-]+\/?$/i

export const behance: PlatformModule = {
    id: Platforms.Behance,
    name: 'Behance',
    color: '#1769FF',

    domains: ['behance.net'],

    patterns: {
        profile: profileRegex,
        handle: usernamePattern,
        content: {
            project: projectRegex,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('behance.net')) return false
        return profileRegex.test(url) || projectRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const pr = projectRegex.exec(url)
        if (pr) {
            result.ids.projectId = pr[1]
            result.metadata.isProject = true
            result.metadata.contentType = 'project'
            return
        }
        const p = profileRegex.exec(url)
        if (p) {
            result.username = p[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return usernamePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://www.behance.net/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'project') return `https://www.behance.net/gallery/${id}`
        return `https://www.behance.net/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/\?.*$/, '').replace(/#.*/, ''))
    },
} 