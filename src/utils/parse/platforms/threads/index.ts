import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const threads: PlatformModule = {
  id: Platforms.Threads,
  name: 'Threads',
  domains: ['threads.net'],
  patterns: {
    profile: /threads\.net\/(@?[a-zA-Z0-9._]+)/i,
    handle: /^@?[a-zA-Z0-9._]{1,30}$/,
  },
  detect: url => url.includes('threads.net'),
  extract: (url: string, res: ParsedUrl) => {
    const m = /threads\.net\/(@?[a-zA-Z0-9._]+)/i.exec(url)
    if (m) {
      res.username = m[1].replace('@', '')
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: h => /^@?[a-zA-Z0-9._]{1,30}$/i.test(h),
  buildProfileUrl: u => `https://threads.net/${u.replace('@', '')}`,
  normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}