import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Validation constants
const MIN = 3
const MAX = 70
// regex pieces per validation rules
const startPattern = '[A-Za-z0-9]'
const middlePattern = '[A-Za-z0-9.-]'
const handleRegex = new RegExp(`^${startPattern}${middlePattern}{${MIN - 1},${MAX - 1}}$`)

const profileRegex = /^https?:\/\/(?:www\.)?hoo\.be\/([A-Za-z0-9][A-Za-z0-9.-]{1,68}[A-Za-z0-9-])\/?$/i

export const hoobe: PlatformModule = {
    id: Platforms.HooBe,
    name: 'Hoo.be',
    color: '#000000',

    domains: ['hoo.be'],

    patterns: {
        profile: profileRegex,
        handle: handleRegex,
    },

    detect(url: string) {
        return url.includes('hoo.be/') && profileRegex.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const m = profileRegex.exec(url)
        if (m) {
            result.username = m[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        if (!handle || typeof handle !== 'string') return false
        if (handle.length < MIN || handle.length > MAX) return false
        if (!/^[A-Za-z0-9]/.test(handle)) return false
        if (handle.endsWith('.')) return false
        if (!/^[A-Za-z0-9.-]+$/.test(handle)) return false
        return true
    },

    buildProfileUrl(username: string): string {
        return `https://hoo.be/${username}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 