import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

const DIGIT_RE = /\+?[0-9 ()\-\.]{5,}/

export const phone: PlatformModule = {
    id: Platforms.Phone,
    name: 'Phone',
    domains: [],
    patterns: {
        profile: DIGIT_RE,
        handle: /^\+?[0-9]{5,15}$/,
    },

    detect(raw: string): boolean {
        if (raw.startsWith('tel:')) raw = raw.slice(4)
        const pn = parsePhoneNumberFromString(raw)
        return !!pn
    },

    extract(raw: string, res: ParsedUrl): void {
        let num = raw.startsWith('tel:') ? raw.slice(4) : raw
        const pn = parsePhoneNumberFromString(num)
        if (pn) {
            res.userId = pn.number
            res.metadata.phoneNumber = pn.formatInternational()
            const country = pn.country || (pn.countryCallingCode === '1' ? 'US' : '')
            res.metadata.phoneCountry = country
            res.metadata.isProfile = true
            res.metadata.contentType = 'phone'
        }
    },

    validateHandle(handle: string): boolean {
        const pn = parsePhoneNumberFromString(handle)
        return !!pn
    },

    buildProfileUrl(username: string): string {
        const pn = parsePhoneNumberFromString(username)
        const e164 = pn ? pn.number : username.replace(/[^0-9+]/g, '')
        return `tel:${e164}`
    },

    normalizeUrl(url: string): string {
        if (url.startsWith('tel:')) url = url.slice(4)
        const pn = parsePhoneNumberFromString(url)
        return pn ? `tel:${pn.number}` : url
    },
} 