import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

// Invite links can be:
// https://join.slack.com/t/workspace/shared_invite/zt-abc123~code
// We'll capture workspace slug and code
const inviteRegex = /^https?:\/\/join\.slack\.com\/t\/([A-Za-z0-9-]+)\/shared_invite\/[A-Za-z0-9~_-]+$/i

export const slackinvite: PlatformModule = {
    id: Platforms.SlackInvite,
    name: 'SlackInvite',
    color: '#4A154B',

    domains: ['join.slack.com'],
    patterns: { profile: /^$/, handle: /^$/, content: { invite: inviteRegex } },
    detect: url => url.includes('join.slack.com/t') && inviteRegex.test(url),
    extract(url, result: ParsedUrl) { const m = inviteRegex.exec(url); if (m) { result.ids.workspace = m[1]; result.metadata.contentType = 'invite' } },
    validateHandle() { return false },
    buildProfileUrl() { return 'https://slack.com' },
    buildContentUrl(_, id) { return `https://join.slack.com/t/${id}` },
    normalizeUrl: url => normalize(url),
} 