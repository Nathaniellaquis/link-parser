import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Example: https://rarible.com/token/ETHEREUM:0xabc123:12345
const tokenRegex = /^https?:\/\/rarible\.com\/token\/[A-Z]+:([0-9a-fA-Fx]+):([0-9]+)\/?$/i
// User: https://rarible.com/user/0xabc...
const userRegex = /^https?:\/\/rarible\.com\/user\/([0-9a-fA-Fx]{4,})\/?$/i

export const rarible: PlatformModule = {
    id: Platforms.Rarible,
    name: 'Rarible',
    color: '#FADA5E',

    domains: ['rarible.com'],

    patterns: {
        profile: userRegex,
        handle: /^[0-9a-fA-Fx]{4,}$/,
        content: { token: tokenRegex },
    },

    detect(url) { return url.includes('rarible.com') && (tokenRegex.test(url) || userRegex.test(url)) },

    extract(url, result: ParsedUrl) {
        const t = tokenRegex.exec(url)
        if (t) { result.ids.contract = t[1]; result.ids.tokenId = t[2]; result.metadata.contentType = 'token'; return }
        const u = userRegex.exec(url)
        if (u) { result.userId = u[1]; result.metadata.isProfile = true; result.metadata.contentType = 'profile' }
    },

    validateHandle(h) { return /^[0-9a-fA-Fx]{4,}$/.test(h) },
    buildProfileUrl(addr: string) { return `https://rarible.com/user/${addr}` },
    buildContentUrl(_, id) { return `https://rarible.com/token/${id}` },
    normalizeUrl: url => normalize(url),
} 