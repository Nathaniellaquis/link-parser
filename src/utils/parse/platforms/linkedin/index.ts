import { PlatformModule, Platforms, ParsedUrl, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['linkedin.com'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains);

export const linkedin: PlatformModule = {
  id: Platforms.LinkedIn,
  name: 'LinkedIn',
  color: '#0A66C2',

  domains: domains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/in/([A-Za-z0-9-_%]{3,100})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9-]{3,100}$/,
    content: {
      company: new RegExp(
        `^https?://${DOMAIN_PATTERN}/company/([A-Za-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      school: new RegExp(`^https?://${DOMAIN_PATTERN}/school/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
      post: new RegExp(
        `^https?://${DOMAIN_PATTERN}/posts/[A-Za-z0-9-_%]+_(.+?)/?${QUERY_HASH}$`,
        'i',
      ),
      article: new RegExp(`^https?://${DOMAIN_PATTERN}/pulse/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
      feedUpdate: new RegExp(
        `^https?://${DOMAIN_PATTERN}/feed/update/urn:li:activity:(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // Simple domain check - allows ALL pages on the platform
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Handle company URLs
    const companyMatch = this.patterns.content?.company?.exec(url);
    if (companyMatch) {
      return {
        ids: { companyName: companyMatch[1] },
        metadata: {
          isCompany: true,
          contentType: 'company',
        },
      };
    }

    // Handle school URLs
    const schoolMatch = this.patterns.content?.school?.exec(url);
    if (schoolMatch) {
      return {
        ids: { schoolName: schoolMatch[1] },
        metadata: {
          isSchool: true,
          contentType: 'school',
        },
      };
    }

    // Handle post URLs
    const postMatch = this.patterns.content?.post?.exec(url);
    if (postMatch) {
      return {
        ids: { postId: postMatch[1] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
    }

    // Handle article URLs
    const articleMatch = this.patterns.content?.article?.exec(url);
    if (articleMatch) {
      return {
        ids: { articleSlug: articleMatch[1] },
        metadata: {
          isArticle: true,
          contentType: 'article',
        },
      };
    }

    // Handle feed update URLs
    const feedMatch = this.patterns.content?.feedUpdate?.exec(url);
    if (feedMatch) {
      return {
        ids: { postId: feedMatch[1] },
        metadata: {
          isPost: true,
          contentType: 'post',
        },
      };
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

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://linkedin.com/in/${username}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&]trk=[^&]+/g, ''));
  },
};
