import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'

export const tumblr: PlatformModule = {
  id: Platforms.Tumblr,
  name: 'Tumblr',
  domains: ['tumblr.com'],
  patterns: {
    profile: /^https?:\/\/([a-zA-Z0-9-]{3,})\.tumblr\.com$/i,
    handle: /^[a-zA-Z0-9-]{3,}$/,
    content: {
      post: /^https?:\/\/([a-zA-Z0-9-]+)\.tumblr\.com\/post\/(\d+)/i,
    },
  },
  detect: (url: string): boolean => {
    if (!url.includes('tumblr.com')) return false

    // Check subdomain pattern with numeric post ID
    if (/^https?:\/\/[a-zA-Z0-9-]{3,}\.tumblr\.com(?:\/post\/\d+)?/i.test(url)) {
      // If it has /post/, ensure it's followed by digits
      if (url.includes('/post/') && !/\/post\/\d+/i.test(url)) {
        return false
      }
      return true
    }
    // Check path pattern
    if (/^https?:\/\/(?:www\.)?tumblr\.com\/[a-zA-Z0-9-]{3,}$/i.test(url)) return true

    return false
  },
  extract: (url: string, res: ParsedUrl) => {
    // Handle post URLs
    const postMatch = /^https?:\/\/([a-zA-Z0-9-]+)\.tumblr\.com\/post\/(\d+)/i.exec(url)
    if (postMatch) {
      res.username = postMatch[1]
      res.ids.postId = postMatch[2]
      res.metadata.isPost = true
      res.metadata.contentType = 'post'
      return
    }

    // Handle subdomain profile URLs
    const subdomainMatch = /^https?:\/\/([a-zA-Z0-9-]{3,})\.tumblr\.com$/i.exec(url)
    if (subdomainMatch) {
      res.username = subdomainMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
      return
    }

    // Handle path profile URLs
    const pathMatch = /^https?:\/\/(?:www\.)?tumblr\.com\/([a-zA-Z0-9-]{3,})$/i.exec(url)
    if (pathMatch) {
      res.username = pathMatch[1]
      res.metadata.isProfile = true
      res.metadata.contentType = 'profile'
    }
  },
  validateHandle: (h: string): boolean => /^[a-zA-Z0-9-]{3,}$/.test(h),
  buildProfileUrl: (u: string): string => `https://${u}.tumblr.com`,
  normalizeUrl: (u: string): string => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
}