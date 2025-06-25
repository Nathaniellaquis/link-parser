import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const groupRegex = /^https?:\/\/signal\.group\/#([A-Za-z0-9-_]{10,})$/i

export const signalgroup: PlatformModule = {
    id: Platforms.SignalGroup,
    name: 'SignalGroup',
    color: '#0080FF',

    domains: ['signal.group'],
    patterns: { profile: /^$/, handle: /^$/, content: { group: groupRegex } },
    detect: url => url.includes('signal.group/#') && groupRegex.test(url),
    extract(url, result: ParsedUrl) { const m = groupRegex.exec(url); if (m) { result.ids.groupCode = m[1]; result.metadata.contentType = 'group' } },
    validateHandle() { return false },
    buildProfileUrl() { return 'https://signal.org' },
    buildContentUrl(_, id) { return `https://signal.group/#${id}` },
    normalizeUrl: url => normalize(url),
} 