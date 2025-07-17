# Groundwork Implementation Guide

This guide must be completed BEFORE any agent begins platform refactoring. It establishes the shared types and parser updates needed for all platforms to work with the new architecture.

## Step 1: Add ExtractedData Type to core/types.ts

Add this interface to `/src/utils/parse/core/types.ts`:

```typescript
/**
 * Data extracted from a URL by a platform's extract method.
 * This is returned instead of mutating a ParsedUrl object.
 */
export interface ExtractedData {
  username?: string;
  userId?: string;
  ids?: {
    postId?: string;
    videoId?: string;
    storyId?: string;
    trackId?: string;
    albumId?: string;
    playlistId?: string;
    reelId?: string;
    tvId?: string;
    tweetId?: string;
    productId?: string;
    repoId?: string;
    issueId?: string;
    articleId?: string;
    shotId?: string;
    projectId?: string;
    serverId?: string;
    channelId?: string;
    inviteCode?: string;
    groupId?: string;
    roomId?: string;
    eventId?: string;
    campaignId?: string;
    clipId?: string;
    streamId?: string;
    storeId?: string;
    sellerId?: string;
    listingId?: string;
    collectionId?: string;
    publicationId?: string;
    questionId?: string;
    gistId?: string;
    pullId?: string;
    phoneNumber?: string;
    photoId?: string;
    galleryId?: string;
    answerId?: string;
    tokenId?: string;
    contractAddress?: string;
    spaceId?: string;
    checkoutId?: string;
    creatorId?: string;
    storyItemId?: string;
    episodeId?: string;
    showId?: string;
    artistId?: string;
    [key: string]: string | undefined;
  };
  metadata?: {
    isProfile?: boolean;
    isPost?: boolean;
    isVideo?: boolean;
    isStory?: boolean;
    isEmbed?: boolean;
    isTrack?: boolean;
    isAlbum?: boolean;
    isPlaylist?: boolean;
    isArtist?: boolean;
    isShow?: boolean;
    isEpisode?: boolean;
    isRepository?: boolean;
    isArticle?: boolean;
    isPublication?: boolean;
    isCampaign?: boolean;
    isProject?: boolean;
    isGallery?: boolean;
    isPhoto?: boolean;
    isQuestion?: boolean;
    isProduct?: boolean;
    isStore?: boolean;
    isCollection?: boolean;
    isInvite?: boolean;
    isGroup?: boolean;
    isChannel?: boolean;
    isPayment?: boolean;
    isRoom?: boolean;
    isEvent?: boolean;
    isClip?: boolean;
    isStream?: boolean;
    isLive?: boolean;
    isCheckout?: boolean;
    contentType?: string;
    [key: string]: any;
  };
}
```

## Step 2: Update PlatformModule Interface

In the same `types.ts` file, update the PlatformModule interface:

```typescript
// Change the extract method signature from:
extract(url: string, result: ParsedUrl): void

// To:
extract(url: string): ExtractedData | null
```

## Step 3: Update parser.ts

Replace the platform detection and extraction logic in `/src/utils/parse/core/parser.ts`:

```typescript
// Replace lines 30-62 with:

// Try each platform
for (const [_, module] of registry) {
  if (module.detect(processedUrl)) {
    result.platform = module.id
    result.platformName = module.name
    
    // Call the new extract method
    const extractedData = module.extract(processedUrl)
    
    if (extractedData) {
      // Merge extracted data into result
      if (extractedData.username) result.username = extractedData.username
      if (extractedData.userId) result.userId = extractedData.userId
      if (extractedData.ids) {
        result.ids = { ...result.ids, ...extractedData.ids }
      }
      if (extractedData.metadata) {
        result.metadata = { ...result.metadata, ...extractedData.metadata }
      }
      
      result.normalizedUrl = module.normalizeUrl(processedUrl)
      result.isValid = true
      
      // Extract embed data if the platform supports it
      if (module.getEmbedInfo) {
        const embedInfo = module.getEmbedInfo(processedUrl, result)
        if (embedInfo) {
          result.embedData = {
            platform: module.id,
            type: embedInfo.type || 'iframe',
            contentId: result.ids.videoId || result.ids.postId || result.ids.trackId || '',
            embedUrl: embedInfo.embedUrl,
            options: embedInfo.options
          }
          
          // Mark if the URL is already an embed
          if (embedInfo.isEmbedAlready) {
            result.metadata.isEmbed = true
          }
        }
      }
    }
    
    break
  }
}
```

## Step 4: Run Tests to Ensure Groundwork is Solid

After making these changes:
1. Run `npm run build` to ensure TypeScript compilation works
2. Run `npm test` - tests will fail (expected) but there should be no runtime errors
3. Fix any TypeScript errors that arise

## Important Notes for Platform Refactoring

### What to KEEP:
1. **Domain patterns**: The `createDomainPattern` utility already handles subdomains properly
2. **Regex patterns**: All existing regex patterns remain unchanged
3. **Validation logic**: `validateHandle` methods stay the same
4. **URL builders**: `buildProfileUrl` and `buildContentUrl` methods unchanged
5. **Normalization**: `normalizeUrl` methods stay the same
6. **Embed logic**: `getEmbedInfo` methods stay the same

### What to CHANGE:
1. **Extract method**: Convert from mutation to return `ExtractedData | null`
2. **Detection logic**: 
   - If the current `detect` method ONLY checks domains (good), keep it
   - If it checks specific patterns (restrictive), update it to be domain-only:
   ```typescript
   detect(url: string): boolean {
     const urlLower = url.toLowerCase();
     // Check if URL contains any of our domains
     return this.domains.some(domain => urlLower.includes(domain));
   }
   ```

### Detection Logic Decision Tree:
```
Is the current detect() method checking specific patterns?
├─ YES → Update to domain-only detection
│   └─ This allows detecting help pages, new features, etc.
└─ NO (only checking domains) → Keep as is
    └─ It's already correctly implemented
```

## Testing the Groundwork

Create a simple test file to verify the groundwork:

```typescript
// test-groundwork.ts
import { parse } from './src/utils/parse/core/parser'

// This should still work after groundwork changes
const result = parse('https://instagram.com/johndoe')
console.log('Platform:', result.platform)
console.log('Username:', result.username)
console.log('Valid:', result.isValid)
```

## Success Criteria for Groundwork

- [ ] ExtractedData type is added to types.ts
- [ ] PlatformModule interface is updated
- [ ] parser.ts handles new extract() return format
- [ ] TypeScript compiles without errors
- [ ] Basic parsing still functions (even if tests fail)

Only after ALL these items are checked should the platform-specific refactoring begin.