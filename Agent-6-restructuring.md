# Agent 6: Architecture Restructuring - Messaging & Communication Platforms

## Overview
You are responsible for refactoring messaging and communication platforms from a mutation-based approach to a pure functional approach.

## Your Platforms (12 total)
1. discord
2. telegram
3. whatsapp
4. slackinvite
5. signalgroup
6. microsoftteams
7. email
8. phone
9. venmo
10. cashapp
11. paypal
12. stripelink

## Architecture Changes Required

### 1. Extract Method Refactoring
Change from:
```typescript
extract(url: string, result: ParsedUrl): void {
  // Mutates result object
  result.ids.serverId = match[1];
  result.ids.inviteCode = match[2];
}
```

To:
```typescript
extract(url: string): ExtractedData | null {
  // Returns data or null
  return {
    ids: { 
      serverId: match[1],
      inviteCode: match[2]
    },
    metadata: { contentType: 'invite' }
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

Apply this pattern to communication platforms:
```typescript
extract(url: string): ExtractedData | null {
  // Handle invite links
  const inviteMatch = this.patterns.content?.invite?.exec(url);
  if (inviteMatch) {
    return {
      ids: { inviteCode: inviteMatch[1] },
      metadata: {
        isInvite: true,
        contentType: 'invite'
      }
    };
  }

  // Handle group/channel URLs
  const groupMatch = this.patterns.content?.group?.exec(url);
  if (groupMatch) {
    return {
      ids: { groupId: groupMatch[1] },
      metadata: {
        isGroup: true,
        contentType: 'group'
      }
    };
  }

  // Handle user profiles
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

  // Handle special cases (email, phone)
  if (this.id === Platforms.Email) {
    const emailMatch = /mailto:([^?]+)/.exec(url);
    if (emailMatch) {
      return {
        username: emailMatch[1],
        metadata: {
          contentType: 'email'
        }
      };
    }
  }

  return null;
}
```

## Platform-Specific Notes

### Discord
- Server invites (discord.gg/xyz)
- Channel links
- User profiles (with IDs)

### Telegram
- Public groups/channels (t.me/groupname)
- User profiles
- Message links

### WhatsApp
- Group invite links
- Click to chat links
- Phone numbers

### Payment Platforms (Venmo, CashApp, PayPal)
- User profiles
- Payment links
- Request money URLs

### Email & Phone
- Special handling for mailto: and tel: protocols
- Extract email addresses and phone numbers

## Testing Requirements

1. Update tests for new return format
2. Test invite/group link extraction
3. Test payment platform patterns
4. Handle special protocols (mailto:, tel:)

### Example Test Update:
```typescript
// Before
it('should extract Discord invite code', () => {
  const result = { ids: {}, metadata: {} } as ParsedUrl;
  discord.extract('https://discord.gg/abc123', result);
  expect(result.ids.inviteCode).toBe('abc123');
});

// After
it('should extract Discord invite code', () => {
  const result = discord.extract('https://discord.gg/abc123');
  expect(result).not.toBeNull();
  expect(result?.ids?.inviteCode).toBe('abc123');
  expect(result?.metadata?.contentType).toBe('invite');
  expect(result?.metadata?.isInvite).toBe(true);
});
```

## Execution Steps

1. Ensure the groundwork implementation is complete
2. Start with Discord (multiple URL patterns)
3. Run tests after each platform: `npm test -- tests/platforms/discord`
4. Handle special protocols for email/phone
5. Run full test suite: `npm test`
6. Run linting: `npm run lint`

## Success Criteria

- All platforms return `ExtractedData | null` from extract()
- Detection logic updated only where overly restrictive
- Handle special protocols correctly
- All tests pass
- Consistent patterns across platforms

## Common Patterns for Communication Platforms

1. **Invite links**: Short URLs for joining groups
2. **User profiles**: @ handles or numeric IDs
3. **Group/Channel IDs**: Public identifiers
4. **Payment requests**: Special formatted URLs
5. **Protocol handlers**: mailto:, tel:, whatsapp://

## Special Considerations

- Some platforms use short domains (t.me, discord.gg)
- Payment platforms mix social and financial features
- Phone numbers need validation
- Email addresses need proper extraction
- Handle both web and app protocol URLs

## Important Notes

- Use clear content type names
- Document special protocol handling
- Note any issues in `agent-6-notes.md`