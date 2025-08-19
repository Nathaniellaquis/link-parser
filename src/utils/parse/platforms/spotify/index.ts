import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize, getUrlSafe } from '../../utils/url';
import { createUrlPattern } from '../../utils/pattern';
import { QUERY_HASH } from '../../utils/constants';

// Define Spotify content types
type SpotifyContentType =
  | 'artist'
  | 'track'
  | 'album'
  | 'playlist'
  | 'show'
  | 'podcastEpisode'
  | 'embed';

// Define the config values first
const domains = ['open.spotify.com', 'spotify.link'];

// Spotify REQUIRES open.spotify.com - no other subdomain variations allowed
// But spotify.link is a different domain for short URLs
const DOMAIN_PATTERN = 'open\\.spotify\\.com';
const SHORT_DOMAIN_PATTERN = 'spotify\\.link';

// URL patterns for different content types
const urlsPatterns = {
  // Content patterns - removed ID length restrictions
  artist: '/artist/(?<artistId>[A-Za-z0-9]+)',
  track: '/track/(?<trackId>[A-Za-z0-9]+)',
  album: '/album/(?<albumId>[A-Za-z0-9]+)',
  playlist: '/playlist/(?<playlistId>[A-Za-z0-9]+)',
  show: '/show/(?<showId>[A-Za-z0-9]+)',
  podcastEpisode: '/episode/(?<episodeId>[A-Za-z0-9]+)',
  embed: '/embed/(?<embedType>track|album|playlist|artist|show|episode)/(?<embedId>[A-Za-z0-9]+)',
};

// Short URL patterns for spotify.link
const shortUrlPatterns = {
  shortLink: '/(?<shortId>[a-zA-Z0-9]+)',
};

export const spotify: PlatformModule = {
  id: Platforms.Spotify,
  name: 'Spotify',
  color: '#1DB954',

  domains: domains,

  domainsRegexp: new RegExp(
    `^(?:https?://)?(?:(?:www\\.)?open\\.spotify\\.com|spotify\\.link)`,
    'i',
  ),

  patterns: {
    // Profile pattern for user profiles (only on open.spotify.com)
    profile: new RegExp(
      `^(?:https?://)?open\\.spotify\\.com/user/(?<username>[A-Za-z0-9._-]+)/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[A-Za-z0-9._-]+$/, // removed length restrictions
    content: createUrlPattern({
      domainPattern: DOMAIN_PATTERN,
      urlsPatterns,
    }),
  },

  detect(url: string): boolean {
    // Use domainsRegexp if available (supports protocol-less URLs)
    // console.debug('DEBUG: Spotify detect called with', url);
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

    // Check if it's a short URL first
    if (urlObj.hostname === 'spotify.link') {
      // Create short URL patterns
      const shortUrlRegexPatterns = createUrlPattern({
        domainPattern: SHORT_DOMAIN_PATTERN,
        urlsPatterns: shortUrlPatterns,
      });

      for (const [, pattern] of Object.entries(shortUrlRegexPatterns)) {
        if (!pattern) continue;
        const match = urlObj.href.match(pattern);
        if (match && match.groups) {
          return {
            metadata: {
              contentType: 'shortLink',
              isShortUrl: true,
            },
            ids: { shortId: match.groups.shortId },
          };
        }
      }
      return null;
    }

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

    if (!matchResult) {
      // Check for user profile
      const profileMatch = urlObj.href.match(this.patterns.profile);
      if (profileMatch && profileMatch.groups) {
        return {
          username: profileMatch.groups.username,
          metadata: {
            isProfile: true,
            contentType: 'profile',
          },
        };
      }
      return null;
    }

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
      case 'track':
        extractedData.ids = { trackId: groups.trackId };
        extractedData.metadata!.isTrack = true;
        break;
      case 'album':
        extractedData.ids = { albumId: groups.albumId };
        extractedData.metadata!.isAlbum = true;
        break;
      case 'playlist':
        extractedData.ids = { playlistId: groups.playlistId };
        extractedData.metadata!.isPlaylist = true;
        break;
      case 'show':
        extractedData.ids = { showId: groups.showId };
        extractedData.metadata!.isPodcast = true;
        break;
      case 'podcastEpisode':
        extractedData.ids = { episodeId: groups.episodeId };
        extractedData.metadata!.isPodcastEpisode = true;
        break;
      case 'embed':
        const embedType = groups.embedType;
        const embedId = groups.embedId;
        extractedData.ids = { [`${embedType}Id`]: embedId };
        extractedData.metadata!.contentType = embedType;
        extractedData.metadata!.isEmbed = true;
        // Set type-specific metadata
        switch (embedType) {
          case 'artist':
            extractedData.metadata!.isProfile = true;
            extractedData.metadata!.isArtist = true;
            break;
          case 'track':
            extractedData.metadata!.isTrack = true;
            break;
          case 'album':
            extractedData.metadata!.isAlbum = true;
            break;
          case 'playlist':
            extractedData.metadata!.isPlaylist = true;
            break;
          case 'show':
            extractedData.metadata!.isPodcast = true;
            break;
          case 'episode':
            extractedData.metadata!.isPodcastEpisode = true;
            break;
        }
        break;
    }

    return extractedData;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(username: string): string {
    return `https://open.spotify.com/user/${username}`;
  },

  buildContentUrl(contentType: SpotifyContentType, id: string): string {
    // Map podcastEpisode back to episode for actual Spotify URLs
    const urlContentType = contentType === 'podcastEpisode' ? 'episode' : contentType;
    return `https://open.spotify.com/${urlContentType}/${id}`;
  },

  generateEmbedUrl(contentType: SpotifyContentType, id: string): string {
    // Map podcastEpisode back to episode for actual Spotify embed URLs
    const urlContentType = contentType === 'podcastEpisode' ? 'episode' : contentType;
    return `https://open.spotify.com/embed/${urlContentType}/${id}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url.replace(/[?&](si|utm_[^&]+)=[^&]+/g, ''));
  },

  getEmbedInfo(url: string) {
    // Use the extract method to get content type
    const extractedData = this.extract(url);
    if (!extractedData?.metadata?.contentType) {
      return null;
    }

    const { contentType } = extractedData.metadata;

    // Short URLs need async resolution, return null for sync method
    if (contentType === 'shortLink' || extractedData.metadata.isShortUrl) {
      return null;
    }

    // If it's already an embed URL, return it
    if (url.includes('/embed/')) {
      return {
        embedUrl: url,
        type: 'iframe',
        isEmbedAlready: true,
      };
    }

    // User profiles are not embeddable
    if (contentType === 'profile') {
      return null;
    }

    // Get the appropriate ID for the content type
    const ids = extractedData.ids;
    if (!ids) return null;

    let embedId: string | undefined;

    // Map content types to their IDs
    switch (contentType) {
      case 'artist':
        embedId = ids.artistId;
        break;
      case 'track':
        embedId = ids.trackId;
        break;
      case 'album':
        embedId = ids.albumId;
        break;
      case 'playlist':
        embedId = ids.playlistId;
        break;
      case 'show':
        embedId = ids.showId;
        break;
      case 'podcastEpisode':
        embedId = ids.episodeId;
        break;
    }

    if (!embedId) return null;

    // Generate embed URL
    const embedUrl = this.generateEmbedUrl
      ? this.generateEmbedUrl(contentType, embedId)
      : `https://open.spotify.com/embed/${contentType === 'podcastEpisode' ? 'episode' : contentType}/${embedId}`;

    return { embedUrl, type: 'iframe' };
  },

  async getEmbedInfoAsync(
    url: string,
    options?: {
      resolveShortUrl?: (shortUrl: string) => Promise<string | null>;
    },
  ) {
    // Handle short URLs that need async resolution
    const extractedData = this.extract(url);
    if (extractedData?.metadata?.isShortUrl && options?.resolveShortUrl) {
      try {
        // Use the provided resolver to get the actual Spotify URL
        const resolvedUrl = await options.resolveShortUrl(url);
        if (resolvedUrl && resolvedUrl !== url) {
          // Use the sync getEmbedInfo method with the resolved URL
          return this.getEmbedInfo?.(resolvedUrl) ?? null;
        }
      } catch (error) {
        console.warn(`Failed to resolve Spotify short URL ${url}:`, error);
        return null;
      }
    }

    // For all other cases, fall back to sync method
    return this.getEmbedInfo?.(url) ?? null;
  },
};
