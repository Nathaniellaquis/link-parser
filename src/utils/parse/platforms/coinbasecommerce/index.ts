import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const codePattern = '[a-f0-9]{64}'
const checkoutRegex = new RegExp(`^https?:\\/\\/commerce\\.coinbase\\.com\\/checkout\\/(${codePattern})$`, 'i')

export const coinbasecommerce: PlatformModule = {
    id: Platforms.CoinbaseCommerce,
    name: 'CoinbaseCommerce',
    color: '#1652F0',

    domains: ['commerce.coinbase.com'],

    patterns: { profile: /^$/, handle: /^$/, content: { checkout: checkoutRegex } },
    detect: url => url.includes('commerce.coinbase.com/checkout') && checkoutRegex.test(url),
    extract(url: string, result: ParsedUrl) { const m = checkoutRegex.exec(url); if (m) { result.ids.checkoutId = m[1]; result.metadata.contentType = 'payment' } },
    validateHandle() { return false },
    buildProfileUrl() { return 'https://commerce.coinbase.com' },
    buildContentUrl(_, id) { return `https://commerce.coinbase.com/checkout/${id}` },
    normalizeUrl: url => normalize(url),
} 