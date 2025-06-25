import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Stripe payment links: https://buy.stripe.com/abcd1234   (alphanumeric 8+)
const codePattern = '[A-Za-z0-9]{8,}'
const payRegex = new RegExp(`^https?:\\/\\/buy\\.stripe\\.com\\/(${codePattern})$`, 'i')

export const stripelink: PlatformModule = {
    id: Platforms.StripeLink,
    name: 'StripeLink',
    color: '#635BFF',

    domains: ['buy.stripe.com'],

    patterns: { profile: /^$/, handle: /^$/, content: { pay: payRegex } },

    detect: (url) => url.includes('buy.stripe.com') && payRegex.test(url),

    extract(url: string, result: ParsedUrl): void {
        const m = payRegex.exec(url)
        if (m) { result.ids.code = m[1]; result.metadata.contentType = 'payment' }
    },

    validateHandle() { return false },
    buildProfileUrl() { return 'https://stripe.com' },
    buildContentUrl(_, id: string) { return `https://buy.stripe.com/${id}` },
    normalizeUrl: url => normalize(url),
} 