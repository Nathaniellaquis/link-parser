export enum Platforms {
  Instagram = 'instagram',
  YouTube = 'youtube',
  TikTok = 'tiktok',
  Twitter = 'twitter',
  Facebook = 'facebook',
  Spotify = 'spotify',
  Snapchat = 'snapchat',
  LinkedIn = 'linkedin',
  Pinterest = 'pinterest',
  Telegram = 'telegram',
  Discord = 'discord',
  Reddit = 'reddit',
  Twitch = 'twitch',
  Patreon = 'patreon',
  SoundCloud = 'soundcloud',
  Threads = 'threads',
  Bluesky = 'bluesky',
  Mastodon = 'mastodon',
  Tumblr = 'tumblr',
  GitHub = 'github',
  GitLab = 'gitlab',
  Bitbucket = 'bitbucket',
  Amazon = 'amazon',
  Shopify = 'shopify',
  OnlyFans = 'onlyfans',
  Substack = 'substack',
  KoFi = 'kofi',
  Unknown = 'unknown',
}

// Generic embed platform type (extend as needed)
export type EmbedPlatform = 'youtube' | 'soundcloud' | 'twitter' | 'instagram' | string
export type EmbedType = 'video' | 'post' | 'audio' | 'generic' | string

export interface ParsedUrl {
  // Validation
  isValid: boolean

  // URLs
  originalUrl: string
  normalizedUrl: string
  canonicalUrl?: string

  // Platform Info
  platform: Platforms | null
  platformName?: string

  // User Data
  username?: string
  userId?: string

  // Content Data
  ids: {
    postId?: string
    videoId?: string
    storyId?: string
    [key: string]: string | undefined
  }

  // Metadata
  metadata: {
    isProfile?: boolean
    isPost?: boolean
    isVideo?: boolean
    isStory?: boolean
    isEmbed?: boolean
    contentType?: string
    [key: string]: any
  }

  // Embed Data
  embedData?: {
    platform: EmbedPlatform
    type: EmbedType
    contentId: string
    embedUrl?: string
    options?: any
  }
}

export interface PlatformModule {
  // Identity
  id: Platforms
  name: string
  color?: string

  // Domains & Detection
  domains: string[]
  mobileSubdomains?: string[]
  shortDomains?: string[]

  // Pattern Collection
  patterns: {
    profile: RegExp
    handle: RegExp
    content?: {
      post?: RegExp
      video?: RegExp
      story?: RegExp
      [key: string]: RegExp | undefined
    }
  }

  // Core Methods
  detect(url: string): boolean
  extract(url: string, result: ParsedUrl): void
  validateHandle(handle: string): boolean

  // URL Builders
  buildProfileUrl(username: string): string
  buildContentUrl?(contentType: string, id: string): string

  // Normalization
  normalizeUrl(url: string): string

  // Platform-Specific Features (optional)
  extractTimestamp?(url: string): number | null
  generateEmbedUrl?(contentId: string, options?: any): string
  resolveShortUrl?(shortUrl: string): Promise<string>
}