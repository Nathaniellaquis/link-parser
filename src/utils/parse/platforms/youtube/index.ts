import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';
import { createUrlPattern } from '../../utils/pattern';

// Define the config values first
const domains = ['youtube.com', 'youtu.be'];
const subdomains = ['m', 'mobile'];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const youtube: PlatformModule = {
  id: Platforms.YouTube,
  name: 'YouTube',
  color: '#FF0000',

  domains: domains,
  subdomains: subdomains,

  domainsRegexp: new RegExp(`^(?:https?://)?${DOMAIN_PATTERN}(/|$)`, 'i'),

  patterns: {
    profile: new RegExp(
      `^(?:https?://)?${DOMAIN_PATTERN}/(?:c/|user/|@)([a-zA-Z0-9_-]{2,30})/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
    content: createUrlPattern({
      domainPattern: DOMAIN_PATTERN,
      urlsPatterns: {
        channel: '/channel/(?<channelId>UC[a-zA-Z0-9_-]+)/?',
        userProfile: '/user/(?<username>[a-zA-Z0-9_-]+)/?',
        handleProfile: '/@(?<username>[a-zA-Z0-9_-]+)/?',
        liveWatch: '/watch\\?v=(?<liveId>[a-zA-Z0-9_-]+)&.*\\blive=1',
        videoInPlaylist:
          '/watch\\?v=(?<videoId>[a-zA-Z0-9_-]+)&.*list=(?<playlistId>[a-zA-Z0-9_-]+)',
        video: '/watch\\?v=(?<videoId>[a-zA-Z0-9_-]+)',
        videoShort:
          '/(?<videoId>(?!playlist|channel|shorts|live|embed|watch|user|c|@)[a-zA-Z0-9_-]+)/?',
        short: '/shorts/(?<shortId>[a-zA-Z0-9_-]+)/?',
        playlist: '/playlist\\?list=(?<playlistId>[a-zA-Z0-9_-]+)',
        live: '/live/(?<liveId>[a-zA-Z0-9_-]+)/?',
        channelLive: '/@(?<username>[a-zA-Z0-9_-]+)/live/?',
        userLive: '/user/(?<username>[a-zA-Z0-9_-]+)/live/?',
        channelIdLive: '/channel/(?<channelId>UC[a-zA-Z0-9_-]+)/live/?',
        embed: '/embed/(?<videoId>[a-zA-Z0-9_-]+)/?',
      },
    }),
  },

  detect(url: string): boolean {
    // Use domainsRegexp to properly handle subdomains
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
          contentType,
        },
      };

      // Set content ID and metadata based on content type
      switch (contentType) {
        case 'channel':
          extractedData.ids = { channelId: groups.channelId };
          extractedData.metadata!.isProfile = true;
          break;
        case 'userProfile':
        case 'handleProfile':
          extractedData.username = groups.username;
          extractedData.metadata!.isProfile = true;
          break;
        case 'video':
        case 'videoShort':
          extractedData.ids = { videoId: groups.videoId };
          extractedData.metadata!.isVideo = true;
          // Extract timestamp if present
          const tMatch = url.match(/[?&]t=(?<timestamp>\d+)/);
          if (tMatch && tMatch.groups)
            extractedData.metadata!.timestamp = parseInt(tMatch.groups.timestamp);
          break;
        case 'videoInPlaylist':
          extractedData.ids = {
            videoId: groups.videoId,
            playlistId: groups.playlistId,
          };
          extractedData.metadata!.isVideo = true;
          extractedData.metadata!.isPlaylist = true;
          // Extract timestamp if present
          const tMatchPlaylist = url.match(/[?&]t=(?<timestamp>\d+)/);
          if (tMatchPlaylist && tMatchPlaylist.groups)
            extractedData.metadata!.timestamp = parseInt(tMatchPlaylist.groups.timestamp);
          break;
        case 'short':
          extractedData.ids = { shortId: groups.shortId };
          extractedData.metadata!.isShort = true;
          break;
        case 'playlist':
          extractedData.ids = { playlistId: groups.playlistId };
          extractedData.metadata!.isPlaylist = true;
          break;
        case 'live':
        case 'liveWatch':
          extractedData.ids = { liveId: groups.liveId };
          extractedData.metadata!.isLive = true;
          break;
        case 'channelLive':
        case 'userLive':
          extractedData.username = groups.username;
          extractedData.metadata!.isLive = true;
          break;
        case 'channelIdLive':
          extractedData.ids = { channelId: groups.channelId };
          extractedData.metadata!.isLive = true;
          break;
        case 'embed':
          extractedData.ids = { videoId: groups.videoId };
          extractedData.metadata!.isEmbed = true;
          break;
      }

      return extractedData;
    }

    // Handle profile URLs (not in content patterns)
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
    return this.patterns.handle.test(handle.replace('@', ''));
  },

  buildProfileUrl(username: string): string {
    const clean = username.replace('@', '');
    if (clean.startsWith('UC') && clean.length === 24) {
      return `https://youtube.com/channel/${clean}`;
    }
    return `https://youtube.com/@${clean}`;
  },

  buildContentUrl(contentType: string, id: string): string {
    if (['video', 'short', 'live'].includes(contentType))
      return `https://youtube.com/watch?v=${id}`;
    if (contentType === 'playlist') return `https://youtube.com/playlist?list=${id}`;
    return `https://youtube.com/watch?v=${id}`;
  },

  normalizeUrl(url: string): string {
    url = url.replace(/[?&](feature|si|pp|ab_channel)=[^&]+/g, '');
    return normalize(url);
  },

  extractTimestamp(url: string): number | null {
    const match = url.match(/[?&]t=(?<timestamp>\d+)/);
    return match && match.groups ? parseInt(match.groups.timestamp) : null;
  },

  generateEmbedUrl(
    contentId: string,
    options?: { startTime?: number; autoplay?: boolean },
  ): string {
    const params = new URLSearchParams();
    if (options?.startTime) params.set('start', options.startTime.toString());
    if (options?.autoplay) params.set('autoplay', '1');
    const qs = params.toString();
    return `https://www.youtube.com/embed/${contentId}${qs ? `?${qs}` : ''}`;
  },

  async resolveShortUrl(shortUrl: string): Promise<string> {
    const match = /youtu\.be\/(?<videoId>[a-zA-Z0-9_-]+)/.exec(shortUrl);
    if (match && match.groups) return `https://youtube.com/watch?v=${match.groups.videoId}`;
    return shortUrl;
  },

  getEmbedInfo(url: string) {
    // Extract data to determine content type (this will handle embed URLs too)
    const extractedData = this.extract(url);
    if (!extractedData) {
      return null;
    }

    const { metadata, ids } = extractedData;
    const contentType = metadata?.contentType;

    // If it's already an embed URL, return it as-is
    if (contentType === 'embed') {
      return { embedUrl: url, isEmbedAlready: true, type: 'iframe', contentType: 'video' };
    }

    // Handle different content types
    switch (contentType) {
      case 'video':
      case 'videoShort':
      case 'embed':
        if (ids?.videoId) {
          const embedUrl = `https://www.youtube.com/embed/${ids.videoId}`;
          return { embedUrl, type: 'iframe', contentType };
        }
        break;

      case 'short':
        // Shorts embed as regular videos
        if (ids?.shortId) {
          const embedUrl = `https://www.youtube.com/embed/${ids.shortId}`;
          return { embedUrl, type: 'iframe', contentType };
        }
        break;

      case 'videoInPlaylist':
        // Video in playlist: embed video with playlist parameter
        if (ids?.videoId && ids?.playlistId) {
          const embedUrl = `https://www.youtube.com/embed/${ids.videoId}?list=${ids.playlistId}`;
          return { embedUrl, type: 'iframe', contentType };
        }
        break;

      case 'playlist':
        // Playlist: use videoseries endpoint
        if (ids?.playlistId) {
          const embedUrl = `https://www.youtube.com/embed/videoseries?list=${ids.playlistId}`;
          return { embedUrl, type: 'iframe', contentType };
        }
        break;

      case 'channel':
        // Channel: convert to uploads playlist (UC -> UU)
        if (ids?.channelId && ids.channelId.startsWith('UC')) {
          const uploadsPlaylistId = 'UU' + ids.channelId.substring(2);
          const embedUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;
          return { embedUrl, type: 'iframe', contentType };
        }
        break;

      case 'live':
      case 'liveWatch':
      case 'channelLive':
      case 'userLive':
      case 'channelIdLive':
        // Live streams are not embeddable
        return null;

      case 'userProfile':
        // Legacy user URLs - handle in async method
        return null;

      case 'handleProfile':
        // @ handles cannot be reliably resolved to channel IDs without YouTube Data API. It resolves in async method
        return null;
    }

    return null;
  },

  async getEmbedInfoAsync(
    url: string,
    options?: {
      getChannelIdFromHandle?: (handle: string) => Promise<string | null>;
    },
  ) {
    // Handle cases that need async processing
    const extractedData = this.extract(url);
    if (extractedData) {
      const { metadata } = extractedData;
      const contentType = metadata?.contentType;

      switch (contentType) {
        // case 'userProfile':
        //   if (extractedData.username) {
        //     try {
        //       // Try to resolve username to channel ID via YouTube's RSS feed
        //       // This is a workaround since we don't have API keys
        //       const channelId = await this.resolveUsernameToChannelId?.(extractedData.username);
        //       if (channelId && channelId.startsWith('UC')) {
        //         // Convert to uploads playlist (UC -> UU)
        //         const uploadsPlaylistId = 'UU' + channelId.substring(2);
        //         const embedUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;
        //         return { embedUrl, type: 'iframe', contentType };
        //       }
        //     } catch (error) {
        //       console.warn(`Failed to resolve YouTube username ${extractedData.username}:`, error);
        //     }

        //     // Fallback: use the legacy embed format (may not work for all users)
        //     const embedUrl = `https://www.youtube.com/embed?listType=user_uploads&list=${extractedData.username}`;
        //     return { embedUrl, type: 'iframe', contentType };
        //   }
        //   break;

        case 'userProfile':
        case 'handleProfile':
          if (extractedData.username && options?.getChannelIdFromHandle) {
            try {
              // Use the provided channel ID resolver
              const channelId = await options.getChannelIdFromHandle(extractedData.username);
              if (channelId && channelId.startsWith('UC')) {
                // Convert to uploads playlist (UC -> UU)
                const uploadsPlaylistId = 'UU' + channelId.substring(2);
                const embedUrl = `https://www.youtube.com/embed/videoseries?list=${uploadsPlaylistId}`;
                return { embedUrl, type: 'iframe', contentType };
              }
            } catch (error) {
              console.warn(`Failed to resolve YouTube handle ${extractedData.username}:`, error);
            }
          }

          const embedUrl = `https://www.youtube.com/embed?listType=user_uploads&list=${extractedData.username}`;
          return { embedUrl, type: 'iframe', contentType };
          // @ handles cannot be reliably resolved to channel IDs without YouTube Data API
          return null;
        default:
          return this.getEmbedInfo?.(url, options) ?? null;
      }
    }

    return null;
  },

  async resolveUsernameToChannelId(username: string): Promise<string | null> {
    try {
      // Method 1: Try to fetch the user page and extract channel ID from redirect
      // const userPageResponse = await fetch(`https://www.youtube.com/user/${username}`, {
      //   method: 'HEAD',
      //   redirect: 'manual',
      // });

      // // YouTube redirects /user/USERNAME to /channel/CHANNEL_ID
      // if (userPageResponse.status === 301 || userPageResponse.status === 302) {
      //   const location = userPageResponse.headers.get('location');
      //   if (location) {
      //     const channelMatch = location.match(/\/channel\/([A-Za-z0-9_-]+)/);
      //     if (channelMatch) {
      //       return channelMatch[1];
      //     }
      //   }
      // }

      // Method 2: Try RSS feed approach
      // const rssUrl = `https://www.youtube.com/feeds/videos.xml?user=${username}`;
      // const rssResponse = await fetch(rssUrl);

      // if (rssResponse.ok) {
      //   const rssText = await rssResponse.text();
      //   // Extract channel ID from RSS feed
      //   const channelMatch = rssText.match(/<yt:channelId>([A-Za-z0-9_-]+)<\/yt:channelId>/);
      //   if (channelMatch) {
      //     return channelMatch[1];
      //   }
      // }

      return null;
    } catch (error) {
      console.warn(`Error resolving YouTube username ${username}:`, error);
      return null;
    }
  },
};
