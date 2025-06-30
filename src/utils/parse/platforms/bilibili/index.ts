import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Define the config values first
const domains = ['bilibili.com']
const subdomains = ['m', 'space']

// Create the domain pattern using the config values
// @ts-ignore - DOMAIN_PATTERN kept for architectural consistency
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains)

export const bilibili: PlatformModule = {
    id: Platforms.BiliBili,
    name: 'BiliBili',
    color: '#00A1D6',

    domains: domains,
    subdomains: subdomains,

    patterns: {
        profile: new RegExp(`^https?://space\\.bilibili\\.com/(\\d{1,10})(?:/.*)?${QUERY_HASH}$`, 'i'),
        handle: /^\d{1,10}$/,
        content: {
            videoBV: new RegExp(`^https?://(?:www\\.|m\\.)?bilibili\\.com/video/(BV[0-9A-Za-z]{10})(?:/.*)?${QUERY_HASH}$`, 'i'),
            videoAv: new RegExp(`^https?://(?:www\\.|m\\.)?bilibili\\.com/video/av(\\d+)(?:/.*)?${QUERY_HASH}$`, 'i'),
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(domain => url.includes(domain))) return false
        return this.patterns.profile.test(url) ||
            !!(this.patterns.content?.videoBV?.test(url)) ||
            !!(this.patterns.content?.videoAv?.test(url))
    },

    extract(url: string, result: ParsedUrl): void {
        const bv = this.patterns.content?.videoBV?.exec(url)
        if (bv) {
            result.ids.videoId = bv[1]
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }
        const av = this.patterns.content?.videoAv?.exec(url)
        if (av) {
            result.ids.videoId = `av${av[1]}`
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }
        const prof = this.patterns.profile.exec(url)
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