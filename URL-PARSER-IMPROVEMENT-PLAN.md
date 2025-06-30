# URL Parser Enhancement Plan

## Executive Summary
Fix the link-parser to achieve 80%+ success rate by:
1. Making all patterns accept query parameters/fragments
2. Using ALL listed domains in patterns (not just the primary one)

## Current Issues
- **42.2% success rate** - Most patterns break with query parameters like `?utm_source=...`
- Platforms list multiple domains but patterns only use one (e.g., `m.youtube.com` fails even though it's listed)
- Example: Instagram lists `['instagram.com', 'instagr.am', 'ig.me']` but patterns only check `instagram.com`

## Simple Solution

### 1. Add Query/Hash Support

```typescript
// src/utils/parse/utils/constants.ts
export const QUERY_HASH = '(?:\\?[^#]*)?(?:#.*)?';  // Matches optional query and hash
```

### 2. Use ALL Domains in Patterns

#### Current Problem
```typescript
// YouTube lists these domains:
domains: ['youtube.com', 'youtu.be', 'm.youtube.com']

// But patterns only use one:
channel: /^https?:\/\/(?:www\.)?youtube\.com\/channel\/([UC][\w-]{21}[AQgw])$/i
// ❌ This fails for m.youtube.com/channel/...
```

#### Solution
```typescript
// Build domain regex from ALL listed domains:
const domainRegex = '(?:(?:www\\.)?(?:youtube\\.com|youtu\\.be|m\\.youtube\\.com))';

// Use in patterns:
channel: new RegExp(`^https?://${domainRegex}/channel/([UC][\\w-]{21}[AQgw])/?${QUERY_HASH}$`, 'i')
// ✅ Now works for all domains AND query parameters
```

### 3. Pattern Update Example

#### Instagram Before:
```typescript
patterns: {
  profile: /^https?:\/\/(?:www\.)?instagram\.com\/([A-Za-z0-9_.]{1,30})$/i,
  reel: /^https?:\/\/(?:www\.)?instagram\.com\/reel\/([A-Za-z0-9_-]+)$/i,
}
```

#### Instagram After:
```typescript
// Helper to build domain pattern
const IG_DOMAINS = '(?:(?:www\\.)?(?:instagram\\.com|instagr\\.am|ig\\.me))';

patterns: {
  profile: new RegExp(`^https?://${IG_DOMAINS}/([A-Za-z0-9_.]{1,30})/?${QUERY_HASH}$`, 'i'),
  reel: new RegExp(`^https?://${IG_DOMAINS}/reel/([A-Za-z0-9_-]+)/?${QUERY_HASH}$`, 'i'),
}
```

Now:
- ✅ `instagram.com/username?utm_source=twitter` works
- ✅ `ig.me/username` works  
- ✅ `m.instagram.com/reel/ABC123?share=true` works

### 4. Implementation Steps

For each platform:
1. Create domain pattern from ALL listed domains
2. Add `${QUERY_HASH}` to end of every pattern
3. Update detect() to check with the new patterns
4. That's it!

### 5. Benefits

- **Query Parameters Work**: `instagram.com/p/ABC?utm_source=...` ✅
- **All Domains Work**: `m.youtube.com/watch?v=...` ✅  
- **Fragments Work**: `twitter.com/user/status/123#reply` ✅
- **No Breaking Changes**: Same API, just more URLs accepted

### 6. What We're NOT Doing

- ❌ NOT parsing settings/help pages
- ❌ NOT categorizing content types
- ❌ NOT changing the API
- ❌ NOT adding complexity

Just making the existing patterns more flexible!

## Next Steps

1. Add `QUERY_HASH` constant
2. Update each platform file to:
   - Build domain pattern from ALL listed domains
   - Add `${QUERY_HASH}` to patterns
3. Test with live URLs
4. Ship it! 🚀