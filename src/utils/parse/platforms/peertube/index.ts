import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Handle pattern: channel/account slug 3-40 chars
const handlePattern = /^[A-Za-z0-9_-]{3,40}$/

// Profile URLs – two common forms
// https://<instance>/a/<username>
const profileA = new RegExp(`^https?://([A-Za-z0-9.-]+)/a/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`, 'i')
// https://<instance>/video-channels/<channel>
const profileChannel = new RegExp(`^https?://([A-Za-z0-9.-]+)/video-channels/([A-Za-z0-9_-]{3,40})/?${QUERY_HASH}$`, 'i')

// Video URLs
// Standard watch
const videoWatch = new RegExp(`^https?://([A-Za-z0-9.-]+)/videos/watch/([A-Za-z0-9_-]{8,})/?${QUERY_HASH}$`, 'i')
// Embedded player
const videoEmbed = new RegExp(`^https?://([A-Za-z0-9.-]+)/videos/embed/([A-Za-z0-9_-]{8,})/?${QUERY_HASH}$`, 'i')

export const peertube: PlatformModule = {
    id: Platforms.PeerTube,
    name: 'PeerTube',
    color: '#F1680D',

    // Domains – decentralized, so we keep empty to allow any.
    domains: [],

    patterns: {
        profile: profileA, // representative
        handle: handlePattern,
        content: {
            videoWatch,
            videoEmbed,
        },
    },

    detect(url: string): boolean {
        // Quick check to avoid mis-detection: must include '/videos/' or '/a/' or '/video-channels/'
        if (!/\/videos\//i.test(url) && !/\/a\//i.test(url) && !/\/video-channels\//i.test(url)) return false
        return profileA.test(url) || profileChannel.test(url) || videoWatch.test(url) || videoEmbed.test(url)
    },

    extract(url: string, result: ParsedUrl): void {
        // video first
        const v = videoWatch.exec(url) || videoEmbed.exec(url)
        if (v) {
            result.ids.videoId = v[2]
            result.metadata.isVideo = true
            result.metadata.contentType = 'video'
            return
        }

        // profiles
        const pA = profileA.exec(url)
        if (pA) {
            result.username = pA[2]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
            return
        }
        const pC = profileChannel.exec(url)
        if (pC) {
            result.username = pC[2]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
        }
    },

    validateHandle(handle: string): boolean {
        return handlePattern.test(handle)
    },

    buildProfileUrl(username: string): string {
        // Default to popular instance if none supplied
        return `https://peertube.social/a/${username}`
    },

    buildContentUrl(type: string, id: string): string {
        if (type === 'video') return `https://peertube.social/videos/watch/${id}`
        return `https://peertube.social/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 