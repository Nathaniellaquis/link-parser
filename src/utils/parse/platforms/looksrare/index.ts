import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// example: https://looksrare.org/collections/0xabc.../1234
const tokenRegex = /^https?:\/\/looksrare\.org\/collections\/(0x[0-9a-fA-F]{40})\/(\d+)\/?$/i

export const looksrare: PlatformModule = {
    id: Platforms.LooksRare,
    name: 'LooksRare',
    color: '#00C5FF',

    domains: ['looksrare.org'],
    patterns: { profile: /^$/, handle: /^$/, content: { token: tokenRegex } },
    detect: url => url.includes('looksrare.org/collections') && tokenRegex.test(url),
    extract(url, result: ParsedUrl) { const m = tokenRegex.exec(url); if (m) { result.ids.contract = m[1]; result.ids.tokenId = m[2]; result.metadata.contentType = 'token' } },
    validateHandle() { return false },
    buildProfileUrl() { return 'https://looksrare.org' },
    buildContentUrl(_, id) { return `https://looksrare.org/collections/${id}` },
    normalizeUrl: url => normalize(url),
} 