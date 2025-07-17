# Agent 8: Architecture Restructuring - Miscellaneous & Edge Case Platforms

## Overview
You are responsible for refactoring the remaining platforms and edge cases from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. clubhouse
2. fanfix
3. slushy
4. coinbasecommerce
5. squarecheckout
6. hoobe
7. shopmy
8. liketoknowit
9. onlyfans
10. cameo
11. rumble (if not taken by Agent 2)
12. index.ts (platform registry updates)

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.username = match[1];
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    username: match[1],
    metadata: { contentType: 'profile' }
  };
}
```

### 2. Detection Logic Update (ONLY if needed)
**First check**: Is the current `detect()` method checking for specific patterns?
- If YES → Update to domain-only detection
- If NO (already domain-only) → Keep the existing implementation

**Update to domain-only detection (if needed):**
```typescript
detect(url: string): boolean {
  const urlLower = url.toLowerCase();
  return this.domains.some(domain => urlLower.includes(domain));
}
```

### 3. Use Centralized ExtractedData Type
The `ExtractedData` type is already defined in `src/utils/parse/core/types.ts`. Use the centralized type definition.

## Special Task: Verify Parser Integration

The parser.ts integration should already be completed in the groundwork phase. Verify that the parser correctly handles the new extract() return format for all your platforms.

## Reference Pattern

Apply this pattern to miscellaneous platforms:
```typescript
extract(url: string): ExtractedData | null {
  // Handle room/event URLs (Clubhouse)
  const roomMatch = this.patterns.content?.room?.exec(url);
  if (roomMatch) {
    return {
      ids: { roomId: roomMatch[1] },
      metadata: {
        isRoom: true,
        contentType: 'room'
      }
    };
  }

  // Handle creator profiles
  const profileMatch = this.patterns.profile.exec(url);
  if (profileMatch) {
    return {
      username: profileMatch[1],
      metadata: {
        isProfile: true,
        contentType: 'profile'
      }
    };
  }

  return null;
}
```

## Platform-Specific Notes

### Clubhouse
- Room URLs
- Event URLs
- User profiles
- Club pages

### OnlyFans/Fanfix/Slushy
- Creator profiles
- Post IDs
- Subscription tiers

### Payment Processors (CoinbaseCommerce, SquareCheckout)
- Checkout URLs
- Payment links
- Store pages

### Shopping (ShopMy, LikeToKnowIt)
- Influencer shops
- Product collections
- Affiliate links

### Cameo
- Celebrity profiles
- Booking pages
- Video requests

## Testing Requirements

1. Update tests for all platforms
2. Test edge cases and unusual URL formats
3. Ensure platform registry handles new format
4. Verify backward compatibility

### Example Test Update:
```typescript
// Before
it('should extract creator username', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  onlyfans.extract('https://onlyfans.com/creator123', result);
  expect(result.username).toBe('creator123');
});

// After
it('should extract creator username', () => {
  const result = onlyfans.extract('https://onlyfans.com/creator123');
  expect(result).not.toBeNull();
  expect(result?.username).toBe('creator123');
  expect(result?.metadata?.contentType).toBe('profile');
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Handle remaining platforms
3. Verify parser integration works correctly
4. Run tests after each change
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All remaining platforms refactored
- Parser integration verified and working
- All tests pass including integration tests
- Complete documentation of edge cases
- No TypeScript errors

## Common Patterns for Misc Platforms

1. **Creator economy**: Profile-centric platforms
2. **Event/Room based**: Temporary content
3. **Payment flows**: Checkout and payment URLs
4. **Affiliate/Shopping**: Product collections
5. **Subscription tiers**: Different access levels

## Final Verification Tasks

1. Verify all platforms use the new extract() signature
2. Ensure TypeScript types are consistent
3. Test with real-world URLs
4. Document any edge cases found
5. Create summary of completed work

## Important Notes

- This agent handles cleanup and edge cases
- Ensure consistency across all platforms
- Document any remaining issues
- Create comprehensive `agent-8-notes.md` with summary