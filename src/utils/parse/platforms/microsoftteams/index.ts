import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize } from '../../utils/url'

const teamRegex = /^https?:\/\/teams\.microsoft\.com\/l\/team\/(\w+)\/conversations\?.*groupId=([0-9a-f-]{36})/i
const meetingRegex = /^https?:\/\/teams\.live\.com\/meet\/([A-Za-z0-9-]+)/i

export const microsoftteams: PlatformModule = {
    id: Platforms.MicrosoftTeams,
    name: 'MicrosoftTeams',
    color: '#464EB8',

    domains: ['teams.microsoft.com', 'teams.live.com'],
    patterns: { profile: /^$/, handle: /^$/, content: { team: teamRegex, meeting: meetingRegex } },
    detect: url => (/teams\.microsoft\.com|teams\.live\.com/.test(url)) && (teamRegex.test(url) || meetingRegex.test(url)),
    extract(url, result: ParsedUrl) {
        const t = teamRegex.exec(url); if (t) { result.ids.teamId = t[1]; result.ids.groupId = t[2]; result.metadata.contentType = 'team'; return }
        const m = meetingRegex.exec(url); if (m) { result.ids.meetingId = m[1]; result.metadata.contentType = 'meeting' }
    },
    validateHandle() { return false },
    buildProfileUrl() { return 'https://teams.microsoft.com' },
    buildContentUrl(_, id) { return `https://teams.microsoft.com/l/team/${id}` },
    normalizeUrl: url => normalize(url),
} 