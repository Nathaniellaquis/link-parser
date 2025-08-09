import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['quora.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const quora: PlatformModule = {
  id: Platforms.Quora,
  name: 'Quora',
  color: '#B92B27',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/profile/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
    handle: /^[A-Za-z0-9-]+$/,
    content: {
      question: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)/?${QUERY_HASH}$`,
        'i',
      ),
      answer: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([A-Za-z0-9-]+(?:-[A-Za-z0-9-]+)*)/answer/([A-Za-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      space: new RegExp(`^https?://${DOMAIN_PATTERN}/q/([A-Za-z0-9-]+)/?${QUERY_HASH}$`, 'i'),
    },
  },

  detect(url: string): boolean {
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    // Profile
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

    // Space
    const spaceMatch = this.patterns.content?.space?.exec(url);
    if (spaceMatch) {
      return {
        ids: { spaceId: spaceMatch[1] },
        metadata: {
          contentType: 'space',
        },
      };
    }

    // Answer URL
    const answerMatch = this.patterns.content?.answer?.exec(url);
    if (answerMatch) {
      return {
        username: answerMatch[2],
        ids: {
          questionSlug: answerMatch[1],
          answerId: answerMatch[2],
        },
        metadata: {
          isAnswer: true,
          contentType: 'answer',
        },
      };
    }

    // Question
    const questionMatch = this.patterns.content?.question?.exec(url);
    if (questionMatch) {
      return {
        ids: { questionSlug: questionMatch[1] },
        metadata: {
          isQuestion: true,
          contentType: 'question',
        },
      };
    }

    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://www.quora.com/profile/${username}`;
  },

  buildContentUrl(_type: string, id: string): string {
    return `https://www.quora.com/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
