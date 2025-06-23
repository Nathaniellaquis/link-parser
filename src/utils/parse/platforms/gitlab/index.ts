import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const gitlab: PlatformModule = {
  id: Platforms.GitLab,
  name: 'GitLab',
  domains: ['gitlab.com'],
  patterns: {
    profile: /gitlab\.com\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]+$/,
  },
  detect: url => url.includes('gitlab.com'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /gitlab\.com\/([A-Za-z0-9_-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
  buildProfileUrl: u => `https://gitlab.com/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}