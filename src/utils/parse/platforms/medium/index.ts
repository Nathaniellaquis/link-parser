import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const handlePattern = /^[A-Za-z0-9_-]{2,25}$/
const hexId = '[a-f0-9]{12}'

const profileMain = /^https?:\/\/(?:www\.)?medium\.com\/@([A-Za-z0-9_-]{2,25})\/?$/i
const profileUid = new RegExp(`^https?:\\/\\/(?:www\\.)?medium\\.com\\/u\\/(${hexId})\\/?$`, 'i')
const profileSubdomain = /^https?:\/\/([A-Za-z0-9-]+)\.medium\.com\/?$/i

const postUser = new RegExp(`^https?:\\/\\/(?:www\\.)?medium\\.com\\/@[A-Za-z0-9_-]+\\/([a-z0-9-]+-${hexId})\\/?$`, 'i')
const postP = new RegExp(`^https?:\\/\\/(?:www\\.)?medium\\.com\\/p\\/(${hexId})\\/?$`, 'i')
const postSubdomain = new RegExp(`^https?:\\/\\/([A-Za-z0-9-]+)\\.medium\\.com\\/([a-z0-9-]+-${hexId})\\/?$`, 'i')

export const medium: PlatformModule = {
    id: Platforms.Medium,
    name: 'Medium',
    color: '#000000',

    domains: ['medium.com'],

    patterns: {
        profile: profileMain,
        handle: handlePattern,
        content: {
            postUser,
            postP,
            postSubdomain,
        },
    },

    detect(url: string): boolean {
        if (!url.includes('medium.com')) return false
        if (profileMain.test(url) || profileUid.test(url) || profileSubdomain.test(url)) return true
        if (postUser.test(url) || postP.test(url) || postSubdomain.test(url)) return true
        return false
    },

    extract(url: string, result: ParsedUrl): void {
        // posts first
        const m = postUser.exec(url) || postP.exec(url) || postSubdomain.exec(url)
        if (m) {
            const slug = m[m.length - 1]
            result.ids.postSlug = slug
            result.metadata.isPost = true
            result.metadata.contentType = 'post'
            return
        }

        // profiles
        const p = profileMain.exec(url)
        if (p) {
            result.username = p[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
            return
        }
        const uid = profileUid.exec(url)
        if (uid) {
            result.userId = uid[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
            return
        }
        const sub = profileSubdomain.exec(url)
        if (sub) {
            result.username = sub[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return handlePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        return `https://medium.com/@${username}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'post') {
            return `https://medium.com/p/${id}`
        }
        return `https://medium.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/[?&](source|utm_[^&]+)=[^&]+/g, ''))
    },
} 