# Social Link Parser - API Reference

Complete reference for all 97+ supported platforms, their capabilities, and available methods.

## Table of Contents

- [Quick Start](#quick-start)
- [Core API](#core-api)
- [Platform Registry](#platform-registry)
- [Platform Enum Reference](#platform-enum-reference)
- [Platform Methods](#platform-methods)
- [Platform-Specific Documentation](#platform-specific-documentation)
- [Examples by Use Case](#examples-by-use-case)

## Quick Start

```typescript
import { parse, registry, Platforms } from 'social-link-parser'

// Parse any URL
const result = parse('https://www.instagram.com/nasa')
console.log(result.platform) // 'instagram' (lowercase!)
console.log(result.username) // 'nasa'

// Get platform-specific module
const instagram = registry.get(Platforms.Instagram)!
console.log(instagram.validateHandle('nasa')) // true
```

> **⚠️ Note on Enum Values:** The enum keys use PascalCase (`Platforms.Instagram`) but the values are **lowercase** (`'instagram'`). This is for consistency with URLs and APIs.

> **⚠️ ESM Import Issues:** Due to Node.js ESM limitations, importing with ES modules may fail. Use CommonJS (`require()`) for now, or wait for v0.4.0 with proper ESM support.

## Core API

### `parse(url: string): ParsedUrl`

Main parsing function that detects platform and extracts structured data.

```typescript
interface ParsedUrl {
  platform: string | null
  isValid: boolean
  username?: string
  ids: Record<string, string>
  metadata: Record<string, any>
  originalUrl: string
  normalizedUrl?: string
  embedData?: EmbedData
}
```

### `registry: Map<Platforms, PlatformModule>`

Registry containing all platform modules with their methods.

### `Platforms` enum

TypeScript enum of all supported platforms for type-safe access.

## Platform Registry

Access any platform module:

```typescript
import { registry, Platforms } from 'social-link-parser'

// Get platform module
const youtube = registry.get(Platforms.YouTube)!

// Use platform methods
youtube.validateHandle('mkbhd')              // true
youtube.buildProfileUrl('mkbhd')             // 'https://www.youtube.com/@mkbhd'
youtube.buildContentUrl('video', 'abc123')  // 'https://www.youtube.com/watch?v=abc123'
```

## Platform Enum Reference

### Complete Platform List

```typescript
enum Platforms {
  // === SOCIAL MEDIA (25) ===
  Instagram = 'instagram',
  Twitter = 'twitter', 
  TikTok = 'tiktok',
  Facebook = 'facebook',
  LinkedIn = 'linkedin',
  Snapchat = 'snapchat',
  Pinterest = 'pinterest',
  Reddit = 'reddit',
  Tumblr = 'tumblr',
  Discord = 'discord',
  Telegram = 'telegram',
  WhatsApp = 'whatsapp',
  VKontakte = 'vk',
  Threads = 'threads',
  Bluesky = 'bluesky',
  BeReal = 'bereal',
  VSCO = 'vsco',
  Dispo = 'dispo',
  Clubhouse = 'clubhouse',
  Medium = 'medium',
  DevTo = 'devto',
  Quora = 'quora',
  StackOverflow = 'stackoverflow',
  SignalGroup = 'signalgroup',
  SlackInvite = 'slackinvite',
  
  // === VIDEO & STREAMING (10) ===
  YouTube = 'youtube',
  Twitch = 'twitch',
  Vimeo = 'vimeo',
  Dailymotion = 'dailymotion',
  Rumble = 'rumble',
  Triller = 'triller',
  BiliBili = 'bilibili',
  BitChute = 'bitchute',
  Kick = 'kick',
  PeerTube = 'peertube',
  
  // === MUSIC & AUDIO (12) ===
  Spotify = 'spotify',
  SoundCloud = 'soundcloud',
  AppleMusic = 'applemusic',
  Deezer = 'deezer',
  Pandora = 'pandora',
  Tidal = 'tidal',
  Bandcamp = 'bandcamp',
  Mixcloud = 'mixcloud',
  Audiomack = 'audiomack',
  Audius = 'audius',
  Beatport = 'beatport',
  BandLab = 'bandlab',
  
  // === E-COMMERCE (12) ===
  Amazon = 'amazon',
  Etsy = 'etsy',
  EBay = 'ebay',
  Shopify = 'shopify',
  Poshmark = 'poshmark',
  StockX = 'stockx',
  Grailed = 'grailed',
  AliExpress = 'aliexpress',
  Wish = 'wish',
  Revolve = 'revolve',
  LikeToKnowIt = 'liketoknowit',
  ShopMy = 'shopmy',
  
  // === DEVELOPER & TECH (3) ===
  GitHub = 'github',
  GitLab = 'gitlab',
  Bitbucket = 'bitbucket',
  
  // === CREATIVE & PORTFOLIO (4) ===
  Dribbble = 'dribbble',
  Behance = 'behance',
  ArtStation = 'artstation',
  Flickr = 'flickr',
  
  // === PUBLISHING (1) ===
  Substack = 'substack',
  
  // === PAYMENT & SUPPORT (8) ===
  PayPal = 'paypal',
  Venmo = 'venmo',
  CashApp = 'cashapp',
  Patreon = 'patreon',
  KoFi = 'kofi',
  BuyMeACoffee = 'buymeacoffee',
  StripeLink = 'stripelink',
  SquareCheckout = 'squarecheckout',
  
  // === CRYPTO & NFT (5) ===
  OpenSea = 'opensea',
  Rarible = 'rarible',
  LooksRare = 'looksrare',
  Etherscan = 'etherscan',
  CoinbaseCommerce = 'coinbasecommerce',
  
  // === ENTERTAINMENT & EVENTS (6) ===
  IMDb = 'imdb',
  Ticketmaster = 'ticketmaster',
  BandsInTown = 'bandsintown',
  Cameo = 'cameo',
  Fanfix = 'fanfix',
  Slushy = 'slushy',
  
  // === CREATOR ECONOMY (1) ===
  OnlyFans = 'onlyfans',
  
  // === PROFESSIONAL & PRODUCTIVITY (4) ===
  Calendly = 'calendly',
  MicrosoftTeams = 'microsoftteams',
  Matterport = 'matterport',
  MediaKits = 'mediakits',
  
  // === OTHER (6) ===
  Email = 'email',
  Phone = 'phone',
  GoFundMe = 'gofundme',
  Stereo = 'stereo',
  HooBe = 'hoobe',
  
  // === UNKNOWN ===
  Unknown = 'unknown'
}
```

## Platform Methods

Each platform module implements the `PlatformModule` interface:

### Core Methods

```typescript
interface PlatformModule {
  // Basic info
  id: string
  name: string
  color?: string
  domains: string[]
  subdomains?: string[]
  
  // Pattern matching
  patterns: {
    profile: RegExp
    handle: RegExp
    content?: Record<string, RegExp>
  }
  
  // Core methods
  detect(url: string): boolean
  extract(url: string, result: ParsedUrl): void
  validateHandle(handle: string): boolean
  buildProfileUrl(username: string): string
  normalizeUrl(url: string): string
  
  // Optional methods
  buildContentUrl?(contentType: string, id: string): string
  getEmbedInfo?(url: string, parsed: ParsedUrl): EmbedData | null
}
```

### Method Examples

#### `detect(url: string): boolean`

```typescript
const instagram = registry.get(Platforms.Instagram)!

instagram.detect('https://instagram.com/nasa')           // true
instagram.detect('https://www.instagram.com/p/ABC123')   // true  
instagram.detect('https://youtube.com/watch?v=123')      // false
```

#### `validateHandle(handle: string): boolean`

```typescript
const twitter = registry.get(Platforms.Twitter)!

twitter.validateHandle('jack')              // true
twitter.validateHandle('user_name_123')     // true
twitter.validateHandle('a')                 // false (too short)
twitter.validateHandle('toolongusername')   // false (>15 chars)
```

#### `buildProfileUrl(username: string): string`

```typescript
const youtube = registry.get(Platforms.YouTube)!

youtube.buildProfileUrl('mkbhd')           // 'https://www.youtube.com/@mkbhd'
youtube.buildProfileUrl('@mkbhd')          // 'https://www.youtube.com/@mkbhd' (@ stripped)
```

#### `buildContentUrl(contentType: string, id: string): string`

```typescript
const youtube = registry.get(Platforms.YouTube)!

youtube.buildContentUrl('video', 'dQw4w9WgXcQ')      // 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
youtube.buildContentUrl('playlist', 'PLrAXtmRdnEQy')  // 'https://www.youtube.com/playlist?list=PLrAXtmRdnEQy'
```

## Examples by Use Case

### Social Media Aggregation

```typescript
import { parse, Platforms } from 'social-link-parser'

const socialUrls = [
  'https://instagram.com/nasa',
  'https://twitter.com/nasa', 
  'https://youtube.com/@nasa',
  'https://tiktok.com/@nasa'
]

const profiles = socialUrls.map(url => {
  const result = parse(url)
  return {
    platform: result.platform,
    username: result.username,
    url: result.normalizedUrl
  }
})
```

### Handle Validation

```typescript
import { registry, Platforms } from 'social-link-parser'

function validateSocialHandle(platform: Platforms, handle: string): boolean {
  const module = registry.get(platform)
  return module ? module.validateHandle(handle) : false
}

// Usage
validateSocialHandle(Platforms.Instagram, 'nasa')        // true
validateSocialHandle(Platforms.Twitter, 'toolongname')   // false
```

### Content Analysis

```typescript
import { parse } from 'social-link-parser'

function analyzeContent(url: string) {
  const result = parse(url)
  
  if (!result.isValid) return null
  
  switch (result.platform) {
    case Platforms.YouTube:
      return {
        type: 'video',
        videoId: result.ids.videoId,
        timestamp: result.metadata.timestamp
      }
      
    case Platforms.Spotify:
      return {
        type: 'music',
        trackId: result.ids.trackId,
        albumId: result.ids.albumId
      }
      
    case Platforms.GitHub:
      return {
        type: 'code',
        owner: result.ids.owner,
        repo: result.ids.repo
      }
  }
}
```

### URL Building

```typescript
import { registry, Platforms } from 'social-link-parser'

function buildSocialUrls(username: string, platforms: Platforms[]) {
  return platforms.map(platform => {
    const module = registry.get(platform)
    if (!module) return null
    
    return {
      platform,
      url: module.buildProfileUrl(username),
      valid: module.validateHandle(username)
    }
  }).filter(Boolean)
}

// Usage
const urls = buildSocialUrls('nasa', [
  Platforms.Instagram,
  Platforms.Twitter,
  Platforms.YouTube
])
```

## Platform-Specific Documentation

### YouTube
**Content Types:** `video`, `short`, `live`, `playlist`, `channel`, `embed`

```typescript
const youtube = registry.get(Platforms.YouTube)!

// Special Methods
youtube.extractTimestamp(url)                    // Extract timestamp from URL  
youtube.generateEmbedUrl(id, options)            // Custom embed with start time
youtube.resolveShortUrl(shortUrl)                // Convert youtu.be → youtube.com

// Content URLs  
youtube.buildContentUrl('video', 'dQw4w9WgXcQ')     // Video
youtube.buildContentUrl('playlist', 'PLxxx')        // Playlist

// Extractable IDs
const result = parse('https://youtube.com/watch?v=dQw4w9WgXcQ&t=42')
result.ids.videoId     // 'dQw4w9WgXcQ'
result.metadata.timestamp // 42
```

### Spotify  
**Content Types:** `artist`, `track`, `album`, `playlist`

```typescript
const spotify = registry.get(Platforms.Spotify)!

// Different generateEmbedUrl signature
spotify.generateEmbedUrl('track', trackId)       // Spotify-specific embed

// Content URLs
spotify.buildContentUrl('track', trackId)        // Track
spotify.buildContentUrl('album', albumId)        // Album

// Extractable IDs
const result = parse('https://open.spotify.com/track/4iV5W9uYEdYUVa79Axb7Rh')
result.ids.trackId     // '4iV5W9uYEdYUVa79Axb7Rh' 
result.metadata.contentType // 'track'
```

### GitHub
**Content Types:** `repo`, `gist`, `raw` (no videos/music)

```typescript
const github = registry.get(Platforms.GitHub)!

// No embed support - returns null
github.getEmbedInfo?.(url, parsed) // null

// Extractable IDs  
const result = parse('https://github.com/facebook/react')
result.username        // 'facebook'
result.ids.repoName    // 'react'
result.metadata.isRepo // true
```

### Instagram
**Content Types:** `profile`, `post`, `reel`, `story`, `live`, `tv`

```typescript
const instagram = registry.get(Platforms.Instagram)!

// Extractable IDs
const result = parse('https://instagram.com/p/CXX123abc')
result.ids.postId      // 'CXX123abc'
result.metadata.contentType // 'post'
```

### Twitter  
**Content Types:** `profile`, `tweet`, `space`, `list`

```typescript
const twitter = registry.get(Platforms.Twitter)!

// Extractable IDs
const result = parse('https://twitter.com/user/status/1234567890')
result.ids.tweetId     // '1234567890'
result.metadata.contentType // 'tweet'
```

### TikTok
**Content Types:** `profile`, `video`, `live`

```typescript
const tiktok = registry.get(Platforms.TikTok)!

// Handles mobile URLs automatically
const result = parse('https://vm.tiktok.com/xxx') // Resolves to full URL
```

### Amazon
**Content Types:** `product`, `store` (no profiles)

```typescript
const amazon = registry.get(Platforms.Amazon)!

// Extractable IDs
const result = parse('https://amazon.com/dp/B08XXX123')
result.ids.asin        // 'B08XXX123'
result.metadata.contentType // 'product'
```

### PayPal
**Content Types:** `profile`, `payment`

```typescript
const paypal = registry.get(Platforms.PayPal)!

// Extractable IDs
const result = parse('https://paypal.me/username/25')
result.username        // 'username'
result.ids.amount      // '25'
result.metadata.contentType // 'payment'
```

## Platform Capabilities Matrix

| Platform | Profiles | Posts | Videos | Music | Products | Special Features |
|----------|----------|-------|--------|-------|----------|------------------|
| **Instagram** | ✅ | ✅ | ✅ (Reels) | ❌ | ❌ | Stories, Live, TV, Embed |
| **YouTube** | ✅ | ❌ | ✅ | ❌ | ❌ | Shorts, Playlists, Live, Embed |
| **Twitter** | ✅ | ✅ | ❌ | ❌ | ❌ | Spaces, Lists, Embed |
| **TikTok** | ✅ | ✅ | ✅ | ❌ | ❌ | Live, Mobile URLs |
| **Spotify** | ✅ | ❌ | ❌ | ✅ | ❌ | Albums, Playlists, URI support |
| **GitHub** | ✅ | ❌ | ❌ | ❌ | ❌ | Repos, Issues, PRs, Gists |
| **Amazon** | ❌ | ❌ | ❌ | ❌ | ✅ | ASIN extraction, Store pages |
| **PayPal** | ✅ | ❌ | ❌ | ❌ | ❌ | Payment links, Amount parsing |
| **Discord** | ✅ | ❌ | ❌ | ❌ | ❌ | Server invites, Channels |
| **LinkedIn** | ✅ | ✅ | ❌ | ❌ | ❌ | Company pages, Posts |

## TypeScript Support

Full TypeScript support with discriminated unions:

```typescript
import { parse, Platforms } from 'social-link-parser'

const result = parse(url)

// Type narrowing
if (result.platform === Platforms.GitHub) {
  // TypeScript knows these fields exist
  console.log(result.ids.owner)    // string
  console.log(result.ids.repo)     // string
}

if (result.platform === Platforms.YouTube) {
  // YouTube-specific fields
  console.log(result.ids.videoId)  // string | undefined
}
```

---

## Contributing

Found a platform that's missing or has incorrect patterns? See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © 2024
