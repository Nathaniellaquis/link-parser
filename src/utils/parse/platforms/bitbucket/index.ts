import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const bitbucket: PlatformModule = {
  id: Platforms.Bitbucket,
  name: 'Bitbucket',
  domains: ['bitbucket.org'],
  patterns: {
    profile: /bitbucket\.org\/([A-Za-z0-9_-]+)/i,
    handle: /^[A-Za-z0-9_-]+$/,
  },
  detect: url => url.includes('bitbucket.org'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /bitbucket\.org\/([A-Za-z0-9_-]+)/i.exec(url)
    if (m) {
      res.username = m[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
  buildProfileUrl: u => `https://bitbucket.org/${u}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}