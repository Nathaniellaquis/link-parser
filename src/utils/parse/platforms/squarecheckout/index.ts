import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const codePattern = '[a-zA-Z0-9]{8,}'
const payRegex = new RegExp(`^https?:\\/\\/(?:square\\.link|checkout\\.square\\.site)\\/pay\\/(${codePattern})$`, 'i')

export const squarecheckout: PlatformModule = {
    id: Platforms.SquareCheckout,
    name: 'SquareCheckout',
    color: '#28C101',

    domains: ['square.link', 'checkout.square.site'],

    patterns: { profile: /^$/, handle: /^$/, content: { pay: payRegex } },
    detect: (url) => (/square\.link|checkout\.square\.site/.test(url) && payRegex.test(url)),
    extract(url: string, result: ParsedUrl) { const m = payRegex.exec(url); if (m) { result.ids.code = m[1]; result.metadata.contentType = 'payment' } },
    validateHandle() { return false },
    buildProfileUrl() { return 'https://squareup.com' },
    buildContentUrl(_, id) { return `https://square.link/pay/${id}` },
    normalizeUrl: url => normalize(url),
} 