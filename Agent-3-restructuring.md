# Agent 3: Architecture Restructuring - E-commerce & Marketplace Platforms

## Overview
You are responsible for refactoring e-commerce and marketplace platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. amazon
2. shopify
3. etsy
4. ebay
5. aliexpress
6. stockx
7. grailed
8. wish
9. poshmark
10. revolve
11. opensea
12. rarible

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.ids.productId = match[1];
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    ids: { productId: match[1] },
    metadata: { contentType: 'product' }
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

## Reference Pattern

Apply this pattern to e-commerce platforms:
```typescript
extract(url: string): ExtractedData | null {
  // Handle product pages
  const productMatch = this.patterns.content?.product?.exec(url);
  if (productMatch) {
    return {
      ids: { productId: productMatch[1] },
      metadata: {
        isProduct: true,
        contentType: 'product'
      }
    };
  }

  // Handle store/seller profiles
  const storeMatch = this.patterns.content?.store?.exec(url);
  if (storeMatch) {
    return {
      username: storeMatch[1],
      ids: { storeId: storeMatch[1] },
      metadata: {
        isStore: true,
        contentType: 'store'
      }
    };
  }

  // Handle seller profiles
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

### Amazon
- ASIN product IDs
- Seller profiles
- Store fronts
- Different domains per country

### Shopify
- Store subdomains
- Product handles
- Collection pages
- Checkout URLs

### Etsy
- Shop names
- Listing IDs (numeric)
- User profiles

### OpenSea & Rarible (NFT Marketplaces)
- Collection slugs
- Token IDs
- Contract addresses
- User wallets

## Testing Requirements

1. Update test files for new return format
2. Test product ID extraction
3. Test seller/store profile extraction
4. Test marketplace-specific features (collections, categories)

### Example Test Update:
```typescript
// Before
it('should extract product ID', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  amazon.extract('https://amazon.com/dp/B08N5WRWNW', result);
  expect(result.ids.productId).toBe('B08N5WRWNW');
});

// After
it('should extract product ID', () => {
  const result = amazon.extract('https://amazon.com/dp/B08N5WRWNW');
  expect(result).not.toBeNull();
  expect(result?.ids?.productId).toBe('B08N5WRWNW');
  expect(result?.metadata?.contentType).toBe('product');
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with Amazon (most complex patterns)
3. Run tests after each platform: `npm test -- tests/platforms/amazon`
4. Handle marketplace-specific patterns
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic updated only where overly restrictive
- All tests pass
- Handle e-commerce specific content types
- No TypeScript errors

## Common Patterns for E-commerce Platforms

1. **Product IDs**: ASINs, SKUs, listing IDs (numeric or alphanumeric)
2. **Store/Shop URLs**: Often use subdomains or path prefixes
3. **Seller Profiles**: Different from store pages
4. **Collections/Categories**: Group products
5. **Checkout/Cart URLs**: Should be detected but may not extract data

## Special Considerations

- Many e-commerce sites use query parameters for products
- Regional domains (amazon.co.uk, amazon.de, etc.)
- Mobile vs desktop URLs
- Shortened/affiliate URLs

## Important Notes

- Keep consistent naming (productId vs itemId)
- Document any platform-specific patterns
- Note any issues in `agent-3-notes.md`