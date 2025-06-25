import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Profile: space.bilibili.com/<uid>
const profileRegex = /^https?:\/\/(?:www\.)?space\.bilibili\.com\/(\d{1,10})(?:\/.*)?$/i

// Videos
const videoBV = /^https?:\/\/(?:www\.|m\.)?bilibili\.com\/video\/(BV[0-9A-Za-z]{10})(?:\/.*)?$/i
const videoAv = /^https?:\/\/(?:www\.|m\.)?bilibili\.com\/video\/av(\d+)(?:\/.*)?$/i

export const bilibili: PlatformModule = {
    id: Platforms.BiliBili,
    name: 'BiliBili',
    color: '#00A1D6',

    domains: ['bilibili.com', 'space.bilibili.com'],

    patterns: {
        profile: profileRegex,
        handle: /^\d{1,10}$/,
        content: {
            videoBV,
            videoAv,
        },
    },

    detect(url: string): boolean {
        if (!(url.includes('bilibili.com'))) return false
        return profileRegex.test(url) || videoBV.test(url) || videoAv.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        const bv = videoBV.exec(url)
        if (bv) {
            result.ids.videoId = bv[1]
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }
        const av = videoAv.exec(url)
        if (av) {
            result.ids.videoId = `av${av[1]}`
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }
        const prof = profileRegex.exec(url)
        if (prof) {
            result.userId = prof[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return /^\d{1,10}$/.test(handle)
    },

    buildProfileUrl(uid: string): string {
        return `https://space.bilibili.com/${uid}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'video') {
            return id.startsWith('BV')
                ? `https://www.bilibili.com/video/${id}`
                : `https://www.bilibili.com/video/${id}` // id may already have av prefix
        }
        return `https://www.bilibili.com/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url.replace(/#.*$/, '').replace(/\?.*$/, ''))
    },
} 