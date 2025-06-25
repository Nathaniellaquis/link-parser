import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const phonePattern = /^https?:\/\/wa\.me\/(\d{6,15})(?:\?.*)?$/i
const apiSendPattern = /^https?:\/\/api\.whatsapp\.com\/send\?phone=(\d{6,15})(?:&.*)?$/i
const groupPattern = /^https?:\/\/(?:chat|whatsapp)\.whatsapp\.com\/(?:invite\/)?([A-Za-z0-9]{20,})$/i

export const whatsapp: PlatformModule = {
    id: Platforms.WhatsApp,
    name: 'WhatsApp',
    color: '#25D366',

    domains: ['wa.me', 'whatsapp.com', 'api.whatsapp.com'],

    patterns: {
        profile: phonePattern, // treat a phone number as profile
        handle: /^\d{6,15}$/,
        content: {
            group: groupPattern,
            send: apiSendPattern,
        },
    },

    detect(url: string): boolean {
        if (!this.domains.some(d => url.includes(d))) return false
        if (phonePattern.test(url)) return true
        if (apiSendPattern.test(url)) return true
        if (groupPattern.test(url)) return true
        return false
    },

    extract(url: string, result: ParsedUrl): void {
        const phoneMatch = phonePattern.exec(url) || apiSendPattern.exec(url)
        if (phoneMatch) {
            result.userId = phoneMatch[1]
            result.metadata.isProfile = true
            result.metadata.contentType = 'profile'
            return
        }
        const groupMatch = groupPattern.exec(url)
        if (groupMatch) {
            result.ids.groupInviteCode = groupMatch[1]
            result.metadata.isGroupInvite = true
            result.metadata.contentType = 'group'
        }
    },

    validateHandle(handle: string): boolean {
        return /^\d{6,15}$/.test(handle)
    },

    buildProfileUrl(phone: string): string {
        return `https://wa.me/${phone.replace(/\D/g, '')}`
    },

    buildContentUrl(contentType: string, id: string): string {
        if (contentType === 'group') return `https://chat.whatsapp.com/${id}`
        return `https://wa.me/${id}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },
} 