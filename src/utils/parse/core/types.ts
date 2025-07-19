export enum Platforms {
  Instagram = 'instagram',
  YouTube = 'youtube',
  TikTok = 'tiktok',
  Twitter = 'twitter',
  Facebook = 'facebook',
  Spotify = 'spotify',
  Snapchat = 'snapchat',
  LinkedIn = 'linkedin',
  Pinterest = 'pinterest',
  Telegram = 'telegram',
  Discord = 'discord',
  Reddit = 'reddit',
  Twitch = 'twitch',
  Patreon = 'patreon',
  SoundCloud = 'soundcloud',
  Threads = 'threads',
  Bluesky = 'bluesky',
  Tumblr = 'tumblr',
  GitHub = 'github',
  GitLab = 'gitlab',
  Bitbucket = 'bitbucket',
  Amazon = 'amazon',
  Shopify = 'shopify',
  OnlyFans = 'onlyfans',
  Substack = 'substack',
  KoFi = 'kofi',
  ShopMy = 'shopmy',
  Email = 'email',
  Venmo = 'venmo',
  CashApp = 'cashapp',
  PayPal = 'paypal',
  Vimeo = 'vimeo',
  Cameo = 'cameo',
  AppleMusic = 'applemusic',
  Deezer = 'deezer',
  Pandora = 'pandora',
  Tidal = 'tidal',
  Bandcamp = 'bandcamp',
  Mixcloud = 'mixcloud',
  Audiomack = 'audiomack',
  Dailymotion = 'dailymotion',
  Rumble = 'rumble',
  Triller = 'triller',
  BeReal = 'bereal',
  VSCO = 'vsco',
  Dispo = 'dispo',
  Clubhouse = 'clubhouse',
  Poshmark = 'poshmark',
  LikeToKnowIt = 'liketoknowit',
  Revolve = 'revolve',
  OpenSea = 'opensea',
  IMDb = 'imdb',
  Ticketmaster = 'ticketmaster',
  BandsInTown = 'bandsintown',
  Stereo = 'stereo',
  Fanfix = 'fanfix',
  Slushy = 'slushy',
  GoFundMe = 'gofundme',
  Calendly = 'calendly',
  MediaKits = 'mediakits',
  Matterport = 'matterport',
  WhatsApp = 'whatsapp',
  VKontakte = 'vk',
  Medium = 'medium',
  DevTo = 'devto',
  StackOverflow = 'stackoverflow',
  BiliBili = 'bilibili',
  BitChute = 'bitchute',
  Kick = 'kick',
  Quora = 'quora',
  Dribbble = 'dribbble',
  Behance = 'behance',
  ArtStation = 'artstation',
  Flickr = 'flickr',
  Audius = 'audius',
  Beatport = 'beatport',
  BandLab = 'bandlab',
  Phone = 'phone',
  Etsy = 'etsy',
  EBay = 'ebay',
  AliExpress = 'aliexpress',
  StockX = 'stockx',
  Grailed = 'grailed',
  Wish = 'wish',
  BuyMeACoffee = 'buymeacoffee',
  StripeLink = 'stripelink',
  SquareCheckout = 'squarecheckout',
  CoinbaseCommerce = 'coinbasecommerce',
  Rarible = 'rarible',
  Etherscan = 'etherscan',
  LooksRare = 'looksrare',
  SlackInvite = 'slackinvite',
  SignalGroup = 'signalgroup',
  MicrosoftTeams = 'microsoftteams',
  HooBe = 'hoobe',
  PeerTube = 'peertube',
  Unknown = 'unknown',
}

// Generic embed platform type (extend as needed)
export type EmbedPlatform = 'youtube' | 'soundcloud' | 'twitter' | 'instagram' | string;
export type EmbedType = 'video' | 'post' | 'audio' | 'generic' | string;

export interface ParsedUrl {
  // Validation
  isValid: boolean;

  // URLs
  originalUrl: string;
  normalizedUrl: string;
  canonicalUrl?: string;

  // Platform Info
  platform: Platforms | null;
  platformName?: string;

  // User Data
  username?: string;
  userId?: string;

  // Content Data
  ids: {
    postId?: string;
    videoId?: string;
    storyId?: string;
    [key: string]: string | undefined;
  };

  // Metadata
  metadata: {
    isProfile?: boolean;
    isPost?: boolean;
    isVideo?: boolean;
    isStory?: boolean;
    isEmbed?: boolean;
    contentType?: string;
    [key: string]: any;
  };

  // Embed Data
  embedData?: {
    platform: EmbedPlatform;
    type: EmbedType;
    contentId: string;
    embedUrl?: string;
    options?: any;
  };
}

export interface PlatformModule {
  // Identity
  id: Platforms;
  name: string;
  color?: string;

  // Domains & Detection
  domains: string[];
  subdomains?: string[];
  /** domainsRegexp is used to detect if a URL is a valid platform URL. It is a regular expression that matches the domains and subdomains of the platform. */
  domainsRegexp?: RegExp;

  // Pattern Collection
  patterns: {
    profile: RegExp;
    handle: RegExp;
    content?: {
      post?: RegExp;
      video?: RegExp;
      story?: RegExp;
      [key: string]: RegExp | undefined;
    };
  };

  // Core Methods
  detect(url: string): boolean;
  extract(url: string): ExtractedData | null;
  validateHandle(handle: string): boolean;

  // URL Builders
  buildProfileUrl(username: string): string;
  buildContentUrl?(contentType: string, id: string): string;

  // Normalization
  normalizeUrl(url: string): string;

  // Platform-Specific Features (optional)
  extractTimestamp?(url: string): number | null;
  generateEmbedUrl?(contentId: string, options?: any): string;
  resolveShortUrl?(shortUrl: string): Promise<string>;

  /**
   * Return canonical embed information for a URL. If the passed URL is already an
   * embed iframe src, return data with isEmbedAlready = true so the caller can flag it.
   * This method should be self-contained and extract any data it needs internally.
   */
  getEmbedInfo?(url: string): {
    embedUrl: string;
    type?: string;
    options?: Record<string, any>;
    isEmbedAlready?: boolean;
  } | null;
}

/**
 * Data extracted from a URL by a platform's extract method.
 * This is returned instead of mutating a ParsedUrl object.
 */
export interface ExtractedData {
  username?: string;
  userId?: string;
  ids?: {
    postId?: string;
    videoId?: string;
    storyId?: string;
    trackId?: string;
    albumId?: string;
    playlistId?: string;
    reelId?: string;
    tvId?: string;
    tweetId?: string;
    productId?: string;
    repoId?: string;
    issueId?: string;
    articleId?: string;
    shotId?: string;
    projectId?: string;
    serverId?: string;
    channelId?: string;
    inviteCode?: string;
    groupId?: string;
    roomId?: string;
    eventId?: string;
    campaignId?: string;
    clipId?: string;
    streamId?: string;
    storeId?: string;
    sellerId?: string;
    listingId?: string;
    collectionId?: string;
    publicationId?: string;
    questionId?: string;
    gistId?: string;
    pullId?: string;
    phoneNumber?: string;
    photoId?: string;
    galleryId?: string;
    answerId?: string;
    tokenId?: string;
    contractAddress?: string;
    spaceId?: string;
    checkoutId?: string;
    creatorId?: string;
    storyItemId?: string;
    episodeId?: string;
    showId?: string;
    artistId?: string;
    [key: string]: string | undefined;
  };
  metadata?: {
    isProfile?: boolean;
    isPost?: boolean;
    isVideo?: boolean;
    isStory?: boolean;
    isEmbed?: boolean;
    isTrack?: boolean;
    isAlbum?: boolean;
    isPlaylist?: boolean;
    isArtist?: boolean;
    isShow?: boolean;
    isEpisode?: boolean;
    isRepository?: boolean;
    isArticle?: boolean;
    isPublication?: boolean;
    isCampaign?: boolean;
    isProject?: boolean;
    isGallery?: boolean;
    isPhoto?: boolean;
    isQuestion?: boolean;
    isProduct?: boolean;
    isStore?: boolean;
    isCollection?: boolean;
    isInvite?: boolean;
    isGroup?: boolean;
    isChannel?: boolean;
    isPayment?: boolean;
    isRoom?: boolean;
    isEvent?: boolean;
    isClip?: boolean;
    isStream?: boolean;
    isLive?: boolean;
    isCheckout?: boolean;
    isSong?: boolean;
    isStation?: boolean;
    isPodcast?: boolean;
    isPodcastEpisode?: boolean;
    contentType?: string;
    [key: string]: any;
  };
}
