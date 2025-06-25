import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i

export const email: PlatformModule = {
    id: Platforms.Email,
    name: 'Email',
    domains: [],
    patterns: {
        profile: EMAIL_REGEX,
        handle: EMAIL_REGEX,
    },
    detect(url: string): boolean {
        if (url.startsWith('mailto:')) {
            const email = url.slice(7).split('?')[0]
            return EMAIL_REGEX.test(email)
        }
        return EMAIL_REGEX.test(url)
    },
    extract(url: string, result: ParsedUrl): void {
        let address = url
        if (url.startsWith('mailto:')) {
            address = url.slice(7).split('?')[0]
        }

        if (EMAIL_REGEX.test(address)) {
            result.username = address.toLowerCase()
            result.metadata.email = address.toLowerCase()
            result.metadata.isProfile = true
            result.metadata.contentType = 'email'
        }
    },
    validateHandle(handle: string): boolean {
        return EMAIL_REGEX.test(handle)
    },
    buildProfileUrl(username: string): string {
        return `mailto:${username}`
    },
    normalizeUrl(url: string): string {
        const address = url.startsWith('mailto:') ? url.slice(7).split('?')[0] : url
        return `mailto:${address.toLowerCase()}`
    },
} 