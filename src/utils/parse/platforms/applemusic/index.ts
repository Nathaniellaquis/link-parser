import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize, getUrlSafe } from '../../utils/url';
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants';

// Helper function to generate Apple Music embed URLs
function getAppleMusicEmbedUrl(hostname: string, link: string) {
  const url = new URL(link);
  url.hostname = hostname;
  url.searchParams.set('theme', 'auto');
  return url.toString();
}

// Define the config values first
const domains = [
  'music.apple.com',
  'embed.music.apple.com',
  'podcasts.apple.com',
  'embed.podcasts.apple.com',
];

// Common regex parts
const MUSIC_DOMAIN_PATTERN = '^(?:https?://)?(?:www\\.)?(?:embed\\.)?music\\.apple\\.com';
const PODCASTS_DOMAIN_PATTERN = '^(?:https?://)?(?:www\\.)?(?:embed\\.)?podcasts\\.apple\\.com';
const LOCALE_GROUP = '(?:(?<locale>[a-z]{2}(?:-[a-z]{2})?)/)?';
const NAME_GROUP = '(?<name>[^/]+)';

export const applemusic: PlatformModule = {
  id: Platforms.AppleMusic,
  name: 'Apple Music',
  color: '#fa243c',

  domains: domains,

  domainsRegexp: new RegExp(
    `^(?:https?://)?(?:www\\.)?(?:music\\.apple\\.com|embed\\.music\\.apple\\.com|podcasts\\.apple\\.com|embed\\.podcasts\\.apple\\.com)`,
    'i',
  ),

  patterns: {
    // Keep simple handle pattern for validation
    profile: new RegExp(
      `^(?:https?://)?(music|podcasts)\\.apple\\.com/(?:(\\w{2})/)?(album|artist|playlist|song|station|podcast)/[^/]+/([a-zA-Z0-9.-]+)/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^\d+$/, // artist id
    content: {
      // order of items is important
      playlist: new RegExp(
        `${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}playlist\\/${NAME_GROUP}\\/(?<playlistId>[a-zA-Z0-9.-]+)(?:\\?.*)?$`,
        'i',
      ),
      artist: new RegExp(
        `${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}artist\\/${NAME_GROUP}\\/(?<artistId>\\d+)(?:\\?.*)?$`,
        'i',
      ),
      station: new RegExp(
        `${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}station\\/${NAME_GROUP}\\/(?<stationId>[a-zA-Z0-9.-]+)(?:\\?.*)?$`,
        'i',
      ),
      podcastEpisode: new RegExp(
        `${PODCASTS_DOMAIN_PATTERN}\\/${LOCALE_GROUP}podcast\\/${NAME_GROUP}\\/id(?<podcastId>\\d+)\\?.*i=(?<episodeId>\\d+).*$`,
        'i',
      ),
      podcast: new RegExp(
        `${PODCASTS_DOMAIN_PATTERN}\\/${LOCALE_GROUP}podcast\\/${NAME_GROUP}\\/id(?<podcastId>\\d+)(?:\\?.*)?$`,
        'i',
      ),
      song: new RegExp(
        `${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}song\\/${NAME_GROUP}\\/(?<songId>\\d+)(?:\\?.*)?$`,
        'i',
      ),
      track: new RegExp(
        `${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}album\\/${NAME_GROUP}\\/(?<albumId>\\d+)\\?.*i=(?<trackId>\\d+).*$`,
        'i',
      ),
      album: new RegExp(
        `${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}album\\/${NAME_GROUP}\\/(?<albumId>\\d+)(?:\\?.*)?$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // Use domainsRegexp if available (supports protocol-less URLs)
    if (this.domainsRegexp) {
      return this.domainsRegexp.test(url);
    }
    // Fallback to simple domain check
    const urlLower = url.toLowerCase();
    return this.domains.some((domain) => urlLower.includes(domain));
  },

  extract(url: string): ExtractedData | null {
    const urlObj = getUrlSafe(url);
    if (!urlObj) return null;

    // Try each content pattern until one matches
    const contentPatterns = this.patterns.content;
    if (!contentPatterns) return null;

    let matchResult: { contentType: string; match: RegExpMatchArray } | null = null;

    // Try each pattern
    for (const [contentType, pattern] of Object.entries(contentPatterns)) {
      if (!pattern) continue;
      const match = urlObj.href.match(pattern);
      if (match && match.groups) {
        matchResult = { contentType, match };
        break;
      }
    }

    if (!matchResult) return null;

    const { contentType, match } = matchResult;
    const groups = match.groups!;

    const extractedData: ExtractedData = {
      metadata: {
        contentType,
      },
    };

    // Set content ID and metadata based on content type
    switch (contentType) {
      case 'artist':
        extractedData.ids = { artistId: groups.artistId };
        extractedData.metadata!.isProfile = true;
        extractedData.metadata!.isArtist = true;
        break;
      case 'album':
        extractedData.ids = { albumId: groups.albumId };
        extractedData.metadata!.isAlbum = true;
        break;
      case 'playlist':
        extractedData.ids = { playlistId: groups.playlistId };
        extractedData.metadata!.isPlaylist = true;
        break;
      case 'song':
        extractedData.ids = { songId: groups.songId };
        extractedData.metadata!.isSong = true;
        break;
      case 'track':
        extractedData.ids = {
          albumId: groups.albumId,
          trackId: groups.trackId,
        };
        extractedData.metadata!.isTrack = true;
        break;
      case 'station':
        extractedData.ids = { stationId: groups.stationId };
        extractedData.metadata!.isStation = true;
        break;
      case 'podcast':
        extractedData.ids = { podcastId: groups.podcastId };
        extractedData.metadata!.isPodcast = true;
        break;
      case 'podcastEpisode':
        extractedData.ids = {
          podcastId: groups.podcastId,
          episodeId: groups.episodeId,
        };
        extractedData.metadata!.isPodcastEpisode = true;
        break;
    }

    return extractedData;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(artistId: string): string {
    // cannot know locale and artist slug; basic form
    return `https://music.apple.com/us/artist/id${artistId}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },

  getEmbedInfo(url: string) {
    // Use the extract method to get content type
    const extractedData = this.extract(url);
    if (!extractedData?.metadata?.contentType) {
      return null;
    }
    const { contentType } = extractedData.metadata;

    // Determine target domain based on content type
    const targetDomain =
      contentType === 'podcast' || contentType === 'podcastEpisode'
        ? 'embed.podcasts.apple.com'
        : 'embed.music.apple.com';

    // Generate embed URL using the provided function
    const embedUrl = getAppleMusicEmbedUrl(targetDomain, url);
    return { embedUrl, type: 'iframe', contentType };
  },
};
