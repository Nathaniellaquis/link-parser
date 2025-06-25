const fs = require('fs');
const path = require('path');

// Platform names and their test configurations
const platforms = [
  { id: 'Instagram', samples: {
    profileHandle: 'https://instagram.com/sampleuser',
    profileFull: 'https://www.instagram.com/sampleuser/',
    post: 'https://instagram.com/p/ABC123DEF456',
    reel: 'https://instagram.com/reel/ABC123DEF456',
    story: 'https://instagram.com/stories/sampleuser/1234567890',
    tv: 'https://instagram.com/tv/ABC123DEF456',
    embed: 'https://instagram.com/p/ABC123DEF456/embed',
  }, wrong: [
    'https://instagram.com/p/SHORT', // id too short
    'https://instagram.com//sampleuser', // double slash
    'https://instagram.com/reel/', // missing id
  ]},
  { id: 'YouTube', samples: {
    profileHandle: 'https://youtube.com/@sampleuser',
    profileChannel: 'https://youtube.com/channel/UC1234567890abcdefghi',
    profileUser: 'https://youtube.com/user/sampleuser',
    profileC: 'https://youtube.com/c/sampleuser',
    video: 'https://youtu.be/dQw4w9WgXcQ',
    videoQS: 'https://youtube.com/watch?v=dQw4w9WgXcQ&t=42',
    short: 'https://youtube.com/shorts/dQw4w9WgXcQ',
    live: 'https://youtube.com/live/dQw4w9WgXcQ',
    playlist: 'https://youtube.com/playlist?list=PL123456ABCDEF',
    embed: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
  }, wrong: [
    'https://youtu.be/shortid', // 8 chars id too short
    'https://youtube.com/watch?v=invalid', // id len mismatch
    'https://youtube.com/playlist?list=', // empty list param
  ]},
  { id: 'TikTok', samples: {
    profileHandle: 'https://tiktok.com/@sampleuser',
    video: 'https://tiktok.com/@sampleuser/video/1234567890123456789',
    live: 'https://tiktok.com/@sampleuser/live',
    embed: 'https://tiktok.com/embed/v2/1234567890123456789',
  }},
  { id: 'Twitter', samples: {
    profile: 'https://twitter.com/sampleuser',
    profileX: 'https://x.com/sampleuser',
    tweet: 'https://twitter.com/sampleuser/status/1234567890123456789',
    tweetX: 'https://x.com/sampleuser/status/1234567890123456789',
    embed: 'https://platform.twitter.com/embed/Tweet.html?id=1234567890123456789',
  }},
  { id: 'Facebook', samples: {
    profile: 'https://facebook.com/sampleuser',
    profileId: 'https://facebook.com/profile.php?id=1234567890',
    page: 'https://facebook.com/pages/Sample-Page/1234567890',
    post: 'https://facebook.com/sampleuser/posts/1234567890',
    video: 'https://facebook.com/watch/?v=1234567890',
    group: 'https://facebook.com/groups/samplegroup',
    event: 'https://facebook.com/events/1234567890',
  }},
  { id: 'Spotify', samples: {
    artist: 'https://open.spotify.com/artist/1234567890abcdefghij',
    track: 'https://open.spotify.com/track/1234567890abcdefghij',
    album: 'https://open.spotify.com/album/1234567890abcdefghij',
    playlist: 'https://open.spotify.com/playlist/1234567890abcdefghij',
    user: 'https://open.spotify.com/user/sampleuser',
    embed: 'https://open.spotify.com/embed/track/1234567890abcdefghij',
  }},
  { id: 'Snapchat', samples: {
    profile: 'https://snapchat.com/add/sampleuser',
    story: 'https://story.snapchat.com/s/sampleuser',
    spotlight: 'https://www.snapchat.com/spotlight/ABC123DEF456',
  }},
  { id: 'LinkedIn', samples: {
    profileIn: 'https://linkedin.com/in/sampleuser',
    company: 'https://linkedin.com/company/samplecompany',
    school: 'https://linkedin.com/school/sampleschool',
    post: 'https://linkedin.com/posts/sampleuser_sample-post-1234567890',
    article: 'https://linkedin.com/pulse/sample-article-sampleuser',
  }},
  { id: 'Pinterest', samples: {
    profile: 'https://pinterest.com/sampleuser',
    pin: 'https://pinterest.com/pin/1234567890',
    board: 'https://pinterest.com/sampleuser/sample-board',
  }},
  { id: 'Telegram', samples: {
    profile: 'https://t.me/sampleuser',
    channel: 'https://t.me/s/samplechannel',
    post: 'https://t.me/samplechannel/123',
    join: 'https://t.me/joinchat/ABC123DEF456',
  }},
  { id: 'Discord', samples: {
    invite: 'https://discord.gg/ABC123',
    inviteFull: 'https://discord.com/invite/ABC123',
    server: 'https://discord.com/servers/sample-server',
    user: 'https://discord.com/users/1234567890',
  }},
  { id: 'Reddit', samples: {
    profile: 'https://reddit.com/user/sampleuser',
    profileU: 'https://reddit.com/u/sampleuser',
    subreddit: 'https://reddit.com/r/samplesubreddit',
    post: 'https://reddit.com/r/samplesubreddit/comments/abc123/sample_post',
  }},
  { id: 'Twitch', samples: {
    profile: 'https://twitch.tv/sampleuser',
    video: 'https://twitch.tv/videos/1234567890',
    clip: 'https://clips.twitch.tv/SampleClipName',
    collection: 'https://twitch.tv/collections/ABC123DEF456',
  }},
  { id: 'Patreon', samples: {
    profile: 'https://patreon.com/sampleuser',
    profileC: 'https://patreon.com/c/samplecreator',
    post: 'https://patreon.com/posts/sample-post-12345678',
  }},
  { id: 'SoundCloud', samples: {
    profile: 'https://soundcloud.com/sampleuser',
    track: 'https://soundcloud.com/sampleuser/sample-track',
    set: 'https://soundcloud.com/sampleuser/sets/sample-playlist',
    embed: 'https://w.soundcloud.com/player/?url=https://soundcloud.com/sampleuser/sample-track',
  }},
  { id: 'Threads', samples: {
    profile: 'https://threads.net/@sampleuser',
    post: 'https://threads.net/@sampleuser/post/ABC123DEF456',
  }},
  { id: 'Bluesky', samples: {
    profile: 'https://bsky.app/profile/sampleuser.bsky.social',
    profileDid: 'https://bsky.app/profile/did:plc:abc123def456',
    post: 'https://bsky.app/profile/sampleuser.bsky.social/post/abc123',
  }},
  { id: 'Mastodon', samples: {
    profile: 'https://mastodon.social/@sampleuser',
    profileOther: 'https://fosstodon.org/@developer',
    post: 'https://mastodon.social/@sampleuser/1234567890',
  }},
  { id: 'Tumblr', samples: {
    profile: 'https://sampleuser.tumblr.com',
    profileBlog: 'https://tumblr.com/sampleuser',
    post: 'https://sampleuser.tumblr.com/post/1234567890/sample-post',
  }},
  { id: 'GitHub', samples: {
    profile: 'https://github.com/sampleuser',
    repo: 'https://github.com/sampleuser/samplerepo',
    gist: 'https://gist.github.com/sampleuser/abc123def456',
    raw: 'https://raw.githubusercontent.com/sampleuser/repo/main/file.txt',
  }},
  { id: 'GitLab', samples: {
    profile: 'https://gitlab.com/sampleuser',
    project: 'https://gitlab.com/sampleuser/sampleproject',
    group: 'https://gitlab.com/samplegroup',
    snippet: 'https://gitlab.com/sampleuser/sampleproject/-/snippets/123',
  }},
  { id: 'Bitbucket', samples: {
    profile: 'https://bitbucket.org/sampleuser',
    repo: 'https://bitbucket.org/sampleuser/samplerepo',
    snippet: 'https://bitbucket.org/snippets/sampleuser/ABC123',
  }},
  { id: 'Amazon', samples: {
    product: 'https://amazon.com/dp/B08N5WRWNW',
    productFull: 'https://www.amazon.com/Echo-Dot-3rd-Gen/dp/B08N5WRWNW',
    store: 'https://amazon.com/stores/page/ABC123DEF',
    review: 'https://amazon.com/review/R1234567890ABC',
  }},
  { id: 'Shopify', samples: {
    store: 'https://samplestore.myshopify.com',
    product: 'https://samplestore.myshopify.com/products/sample-product',
    collection: 'https://samplestore.myshopify.com/collections/all',
    page: 'https://samplestore.myshopify.com/pages/about-us',
  }},
  { id: 'OnlyFans', samples: {
    profile: 'https://onlyfans.com/sampleuser',
  }},
  { id: 'Substack', samples: {
    profile: 'https://sampleuser.substack.com',
    post: 'https://sampleuser.substack.com/p/sample-post',
    profileNew: 'https://substack.com/@sampleuser',
  }},
  { id: 'KoFi', samples: {
    profile: 'https://ko-fi.com/sampleuser',
    shop: 'https://ko-fi.com/sampleuser/shop',
    post: 'https://ko-fi.com/post/Sample-Post-A1234ABC',
  }},
  { id: 'ShopMy', samples: {
    profile: 'https://shopmy.us/sampleuser',
    collection: 'https://shopmy.us/collections/12345',
    product: 'https://shopmy.us/p/ABC123',
  }},
  { id: 'Email', samples: {
    plain: 'user@example.com',
    mailto: 'mailto:user@example.com',
    mailtoSubject: 'mailto:user@example.com?subject=Hello',
  }},
  { id: 'Phone', samples: {
    us: '+1-555-123-4567',
    usNoDash: '+15551234567',
    tel: 'tel:+15551234567',
    international: '+44 20 7946 0958',
  }},
];

// Template for generating test files
function generateTestFile(platform) {
  const lowerCaseId = platform.id.toLowerCase();
  const sampleEntries = Object.entries(platform.samples);
  const wrongSamplesArr = platform.wrong || [];
  
  return `import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.${platform.id};
const mod = registry.get(id)!;

describe('${platform.id} platform tests', () => {
  const samples = ${JSON.stringify(platform.samples, null, 4).replace(/"([^"]+)":/g, '$1:')};
  // Wrong URLs that should NOT be detected / parsed – tests to be added later
  const wrongSamples = ${JSON.stringify(wrongSamplesArr, null, 4)};

  describe('detection', () => {
    test('should detect all ${platform.id} URLs', () => {
      Object.values(samples).forEach(url => {
        expect(mod.detect(url)).toBe(true);
      });
    });

    test('should not detect non-${platform.id} URLs', () => {
      const nonPlatformUrls = [
        'https://example.com/test',
        'https://google.com',
        'not-a-url',
        // Platform-specific look-alikes that should FAIL detection
        ...wrongSamples,
      ];
      
      nonPlatformUrls.forEach(url => {
        expect(mod.detect(url)).toBe(false);
      });
    });
  });

  /* ----------------------- PARSING TESTS -----------------------
   * Parsing tests for valid samples are below.  Parsing tests for
   * wrongSamples will be added in the future to assert failures.
   * ------------------------------------------------------------*/
  describe('parsing', () => {
${sampleEntries.map(([key, url]) => `    test('should parse ${key}: ${url}', () => {
      const result = parse('${url}');
      expect(result.isValid).toBe(true);
      expect(result.platform).toBe(id);
      expect(result.originalUrl).toBe('${url}');
      
      // Platform-specific assertions
      ${generatePlatformSpecificAssertions(platform.id, key)}
    });`).join('\n\n')}
  });

  describe('profile URL building', () => {
    if (mod.buildProfileUrl) {
      test('should build valid profile URLs', () => {
        const profileUrl = mod.buildProfileUrl('testuser');
        expect(profileUrl).toBeTruthy();
        expect(mod.detect(profileUrl)).toBe(true);
      });
    }
  });

  describe('URL normalization', () => {
    if (mod.normalizeUrl) {
      Object.entries(samples).forEach(([key, url]) => {
        test(\`should normalize \${key} URL\`, () => {
          const normalized = mod.normalizeUrl!(url);
          expect(normalized).toBeTruthy();
          expect(typeof normalized).toBe('string');
        });
      });
    }
  });
});
`;
}

// Generate platform-specific assertions based on the platform and sample type
function generatePlatformSpecificAssertions(platformId, sampleKey) {
  const assertions = {
    Instagram: {
      profileHandle: `expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);`,
      post: `expect(result.ids.postId).toBe('ABC123DEF456');
      expect(result.embedData?.embedUrl).toBeTruthy();`,
      reel: `expect(result.ids.reelId).toBe('ABC123DEF456');`,
      story: `expect(result.username).toBe('sampleuser');
      expect(result.ids.storyId).toBe('1234567890');`,
    },
    YouTube: {
      profileHandle: `expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);`,
      video: `expect(result.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(result.embedData?.embedUrl).toContain('youtube.com/embed');`,
      videoQS: `expect(result.ids.videoId).toBe('dQw4w9WgXcQ');
      expect(result.metadata.timestamp).toBe(42);`,
      short: `expect(result.ids.shortId).toBe('dQw4w9WgXcQ');`,
      playlist: `expect(result.ids.playlistId).toBe('PL123456ABCDEF');`,
    },
    TikTok: {
      profileHandle: `expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);`,
      video: `expect(result.username).toBe('sampleuser');
      expect(result.ids.videoId).toBe('1234567890123456789');
      expect(result.embedData?.embedUrl).toBeTruthy();`,
    },
    Twitter: {
      profile: `expect(result.username).toBe('sampleuser');
      expect(result.metadata.isProfile).toBe(true);`,
      tweet: `expect(result.username).toBe('sampleuser');
      expect(result.ids.tweetId).toBe('1234567890123456789');
      expect(result.embedData?.embedUrl).toBeTruthy();`,
    },
    Email: {
      plain: `expect(result.username).toBe('user@example.com');
      expect(result.metadata.email).toBe('user@example.com');`,
      mailto: `expect(result.metadata.email).toBe('user@example.com');`,
    },
    Phone: {
      us: `expect(result.metadata.phoneNumber).toBeTruthy();
      expect(result.metadata.phoneCountry).toBe('US');`,
      international: `expect(result.metadata.phoneNumber).toBeTruthy();
      expect(result.metadata.phoneCountry).toBe('GB');`,
    },
  };

  const platformAssertions = assertions[platformId];
  if (platformAssertions && platformAssertions[sampleKey]) {
    return platformAssertions[sampleKey];
  }

  // Default assertions for platforms not explicitly handled
  return `// TODO: Add specific assertions for ${platformId} ${sampleKey}`;
}

// Create test directory if it doesn't exist
const testDir = path.join(__dirname, '..', 'tests', 'platforms');
if (!fs.existsSync(testDir)) {
  fs.mkdirSync(testDir, { recursive: true });
}

// Generate test files for each platform
platforms.forEach(platform => {
  const fileName = `${platform.id.toLowerCase()}.test.ts`;
  const filePath = path.join(testDir, fileName);
  const content = generateTestFile(platform);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Generated ${fileName}`);
});

console.log(`\n✅ Successfully generated ${platforms.length} test files!`); 