import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';
import { createUrlPattern } from '../../utils/pattern';

// Define the config values first
const domains = ['threads.net', 'threads.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const threads: PlatformModule = {
  id: Platforms.Threads,
  name: 'Threads',

  domains: domains,
  subdomains: subdomains,
  domainsRegexp: new RegExp(`^(?:https?://)?${DOMAIN_PATTERN}(/|$)`, 'i'),

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/@([a-zA-Z0-9._]{2,30})/?(?!post/)${QUERY_HASH}$`,
      'i',
    ),
    handle: /^@?[a-zA-Z0-9._]{2,30}$/,
    content: createUrlPattern({
      domainPattern: DOMAIN_PATTERN,
      urlsPatterns: {
        usernamePost: '/@(?<username>[a-zA-Z0-9._]{2,30})/post/(?<postId>[A-Za-z0-9]{2,})/?',
        threadPost: '/t/(?<postId>[A-Za-z0-9]{2,})/?',
      },
    }),
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    // const urlLower = url.toLowerCase();
    // return this.domains.some((domain) => urlLower.includes(domain));
    return this.domainsRegexp!.test(url);
  },

  extract(url: string): ExtractedData | null {
    // Try each content pattern until one matches
    const contentPatterns = this.patterns.content;
    if (!contentPatterns) return null;

    let matchResult: { contentType: string; match: RegExpMatchArray } | null = null;

    // Try each pattern
    for (const [contentType, pattern] of Object.entries(contentPatterns)) {
      if (!pattern) continue;
      const match = pattern.exec(url);
      if (match && match.groups) {
        matchResult = { contentType, match };
        break;
      }
    }

    if (matchResult) {
      const { contentType, match } = matchResult;
      const groups = match.groups!;

      const extractedData: ExtractedData = {
        metadata: {
          isPost: true,
          contentType: 'post', // Both patterns are just "post" type
        },
      };

      // Set content ID based on which pattern matched
      if (contentType === 'usernamePost') {
        extractedData.username = groups.username;
        extractedData.ids = { postId: groups.postId };
      } else if (contentType === 'threadPost') {
        extractedData.ids = { postId: groups.postId };
      }

      return extractedData;
    }

    // Handle profile URLs
    const profileMatch = this.patterns.profile.exec(url);
    if (profileMatch) {
      return {
        username: profileMatch[1],
        metadata: {
          isProfile: true,
          contentType: 'profile',
        },
      };
    }

    return null;
  },

  validateHandle(h: string): boolean {
    return /^@?[a-zA-Z0-9._]{2,30}$/i.test(h);
  },

  buildProfileUrl(u: string): string {
    return `https://threads.net/@${u.replace('@', '')}`;
  },

  normalizeUrl(u: string): string {
    return normalize(u);
  },

  getEmbedInfo(url: string) {
    // Extract data to determine content type
    const extractedData = this.extract(url);
    if (!extractedData) {
      return null;
    }

    const { metadata, ids } = extractedData;
    const isPost = metadata?.isPost;

    // Only posts are embeddable on Threads
    if (isPost && ids?.postId) {
      // Threads posts support iframe embedding with specific URL format
      const embedUrl = `https://www.threads.net/t/${ids.postId}/embed`;
      return { embedUrl, type: 'iframe', contentType: 'post' };
    }

    // Profiles are NOT embeddable
    return null;
  },
};
