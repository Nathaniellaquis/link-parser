# link-parser

Extract usernames, IDs, and metadata from social media URLs.

```typescript
// Turn any social media URL into structured data
parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
// => { platform: 'YouTube', ids: { videoId: 'dQw4w9WgXcQ' }, metadata: { contentType: 'video' } }
```

## Installation

```bash
npm install link-parser
# or
yarn add link-parser
# or  
pnpm add link-parser
```

## What It Does

This library extracts structured data from URLs across 100+ platforms. It handles all URL variations (with/without protocol, www, mobile domains, short URLs) and validates usernames according to each platform's rules.

```typescript
import { parse } from 'link-parser'

// Extract username from any Instagram URL format
parse('instagram.com/nasa')
parse('https://www.instagram.com/nasa/')  
parse('https://www.instagram.com/p/B4uJw1qhLwV/')
parse('https://instagr.am/nasa')
// All return: { platform: 'Instagram', ids: { handle: 'nasa' } }

// Extract IDs from content URLs
parse('https://open.spotify.com/track/11dFghVXANMlKmJXsNCbNl')
// => { platform: 'Spotify', ids: { trackId: '11dFghVXANMlKmJXsNCbNl' } }

parse('https://github.com/facebook/react/pull/28797')  
// => { platform: 'GitHub', ids: { owner: 'facebook', repo: 'react', pullNumber: '28797' } }

// Validate handles
import { registry, Platforms } from 'link-parser'
const twitter = registry.get(Platforms.Twitter)!
twitter.validateHandle('jack') // => true
twitter.validateHandle('this_is_way_too_long_for_twitter') // => false
```

## Supported Platforms (97 total)

### Social Media (26)
- **Instagram** - Profiles, posts, stories, reels
- **Twitter** - Profiles, tweets, spaces  
- **TikTok** - Profiles, videos
- **Facebook** - Profiles, pages, posts, groups, events
- **LinkedIn** - Profiles, companies, posts
- **Reddit** - Users, subreddits, posts
- **Snapchat** - Profiles, stories
- **Pinterest** - Profiles, pins, boards
- **Tumblr** - Blogs, posts
- **Discord** - Server invites, users
- **Telegram** - Channels, groups, users
- **WhatsApp** - Groups, chats
- **VKontakte (VK)** - Profiles, groups, posts
- **Threads** - Profiles, posts
- **Bluesky** - Profiles, posts
- **BeReal** - Profiles
- **VSCO** - Profiles, images
- **Dispo** - Profiles, rolls
- **Clubhouse** - Profiles, rooms, clubs
- **Medium** - Profiles, publications, articles
- **Dev.to** - Profiles, articles
- **Quora** - Profiles, questions, spaces
- **StackOverflow** - Users, questions
- **Mastodon** - Profiles (via Hoo.be)
- **Signal** - Group invites
- **Slack** - Workspace invites

### Video & Streaming (10)
- **YouTube** - Channels, videos, playlists, shorts
- **Twitch** - Channels, videos, clips
- **Vimeo** - Users, videos
- **Dailymotion** - Users, videos
- **Rumble** - Channels, videos
- **Triller** - Profiles, videos
- **BiliBili** - Users, videos
- **BitChute** - Channels, videos
- **Kick** - Channels, videos
- **PeerTube** - Channels, videos

### Music & Audio (11)
- **Spotify** - Artists, albums, tracks, playlists
- **SoundCloud** - Artists, tracks, playlists
- **Apple Music** - Artists, albums, songs
- **Deezer** - Artists, albums, tracks
- **Pandora** - Artists, podcasts
- **Tidal** - Artists, albums, tracks
- **Bandcamp** - Artists, albums, tracks
- **Mixcloud** - Users, shows
- **Audiomack** - Artists, songs, albums
- **Audius** - Artists, tracks
- **Beatport** - Artists, tracks, labels
- **BandLab** - Users, tracks

### E-commerce & Marketplace (12)
- **Amazon** - Products, stores
- **Etsy** - Shops, listings
- **eBay** - Users, items
- **Shopify** - Stores, products
- **Poshmark** - Closets, listings
- **StockX** - Products
- **Grailed** - Users, listings
- **AliExpress** - Stores, items
- **Wish** - Products
- **Revolve** - Products
- **LikeToKnowIt** - Profiles, posts
- **ShopMy** - Profiles, collections

### Developer & Tech (3)
- **GitHub** - Users, repos, issues, PRs
- **GitLab** - Users, projects, merge requests
- **Bitbucket** - Users, repos

### Creative & Portfolio (4)
- **Dribbble** - Users, shots
- **Behance** - Users, projects
- **ArtStation** - Artists, artworks
- **Flickr** - Users, photos

### Payment & Support (8)
- **PayPal** - Profiles, payment links
- **Venmo** - Profiles
- **CashApp** - Profiles
- **Patreon** - Creators, posts
- **Ko-fi** - Creators, posts
- **BuyMeACoffee** - Creators
- **Stripe** - Payment links
- **Square** - Checkout links

### Crypto & NFT (4)
- **OpenSea** - Collections, assets
- **Rarible** - Users, items
- **LooksRare** - Collections, tokens
- **Etherscan** - Addresses, transactions
- **Coinbase Commerce** - Checkout pages

### Entertainment & Events (6)
- **IMDb** - Titles, names
- **Ticketmaster** - Events, artists
- **BandsInTown** - Artists, events
- **Cameo** - Celebrities
- **Fanfix** - Creators
- **Slushy** - Creators

### Professional & Productivity (4)
- **Calendly** - Users, event types
- **Microsoft Teams** - Meeting links
- **Matterport** - Spaces
- **MediaKits** - Profiles

### Other (4)
- **Email** - Email addresses
- **Phone** - Phone numbers
- **GoFundMe** - Campaigns
- **Stereo** - Shows, creators

## Key Features

### Handle Validation
Each platform module knows its platform's rules:
```typescript
const instagram = registry.get(Platforms.Instagram)!
instagram.validateHandle('nasa')          // ✓ valid
instagram.validateHandle('n.a.s.a')       // ✓ valid  
instagram.validateHandle('n..asa')        // ✗ consecutive dots
instagram.validateHandle('_nasa_')        // ✗ can't start/end with underscore
```

### URL Building
Convert usernames/IDs back to canonical URLs:
```typescript
const youtube = registry.get(Platforms.YouTube)!
youtube.buildProfileUrl('mkbhd')
// => 'https://www.youtube.com/@mkbhd'

youtube.buildContentUrl('video', 'dQw4w9WgXcQ')  
// => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
```

### URL Normalization
Clean up URLs by removing tracking parameters and fixing common issues:
```typescript
parse('https://www.instagram.com/nasa/?utm_source=ig_embed')
// Returns normalized URL without tracking params
```

### TypeScript Support
Full type safety with discriminated unions:
```typescript
const result = parse(url)

if (result.platform === Platforms.GitHub) {
  // TypeScript knows these fields exist
  console.log(result.ids.owner, result.ids.repo)
}
```

## API Reference

### `parse(url: string): ParsedUrl`
Main parsing function that detects platform and extracts data.

### `registry: Map<Platforms, PlatformModule>`
Registry of all platform modules. Use to access platform-specific methods.

### `Platforms` enum
Enum of all supported platforms for type-safe platform checking.

## Common Use Cases

### Validate User Input
```typescript
function validateSocialLink(url: string): boolean {
  const result = parse(url)
  return result.isValid && result.platform !== Platforms.Unknown
}
```

### Extract IDs for API Calls
```typescript
const result = parse('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
if (result.platform === Platforms.YouTube && result.ids.videoId) {
  // Use videoId with YouTube API
  await youtubeApi.getVideo(result.ids.videoId)
}
```

### Build Consistent URLs
```typescript
function getInstagramUrl(usernameOrUrl: string): string {
  const result = parse(usernameOrUrl)
  if (result.platform === Platforms.Instagram && result.username) {
    return `https://www.instagram.com/${result.username}`
  }
  throw new Error('Invalid Instagram URL or username')
}
```

### Analytics & Tracking
```typescript
function countLinksByPlatform(urls: string[]): Record<string, number> {
  return urls.reduce((acc, url) => {
    const { platform } = parse(url)
    if (platform && platform !== Platforms.Unknown) {
      acc[platform] = (acc[platform] || 0) + 1
    }
    return acc
  }, {})
}
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

To add a new platform, check out the [Platform Implementation Guide](./New-Platform-Implementation-Guide.md).

## License

MIT © 2024

---

Built with TypeScript. Tested with Jest. Used in production. 