import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const addressRegex = /^https?:\/\/etherscan\.io\/address\/(0x[0-9a-fA-F]{40})\/?$/i
const txRegex = /^https?:\/\/etherscan\.io\/tx\/(0x[0-9a-fA-F]{64})\/?$/i

export const etherscan: PlatformModule = {
    id: Platforms.Etherscan,
    name: 'Etherscan',
    color: '#21325B',

    domains: ['etherscan.io'],
    patterns: { profile: addressRegex, handle: /^0x[0-9a-fA-F]{40}$/, content: { tx: txRegex } },
    detect: url => url.includes('etherscan.io') && (addressRegex.test(url) || txRegex.test(url)),
    extract(url, result: ParsedUrl) { const t = txRegex.exec(url); if (t) { result.ids.txHash = t[1]; result.metadata.contentType = 'transaction'; return } const a = addressRegex.exec(url); if (a) { result.userId = a[1]; result.metadata.contentType = 'address'; } },
    validateHandle(h) { return /^0x[0-9a-fA-F]{40}$/.test(h) },
    buildProfileUrl(addr) { return `https://etherscan.io/address/${addr}` },
    buildContentUrl(type, id) { if (type === 'transaction' || type === 'tx') return `https://etherscan.io/tx/${id}`; return `https://etherscan.io/address/${id}` },
    normalizeUrl: url => normalize(url),
} 