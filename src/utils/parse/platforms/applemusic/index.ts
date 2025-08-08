import { PlatformModule, Platforms, ParsedUrl } from '../../core/types'
import { normalize, getUrlSafe } from '../../utils/url'
// import { createDomainPattern } from '../../utils/url'
import { QUERY_HASH } from '../../utils/constants'

// Helper function to generate Apple Music embed URLs
function getAppleMusicEmbedUrl(hostname: string, link: string) {
    const url = new URL(link)
    url.hostname = hostname
    url.searchParams.set('theme', 'auto')
    return url.toString()
}

// Define the config values first
const domains = [
    'music.apple.com',
    'embed.music.apple.com',
    'podcasts.apple.com',
    'embed.podcasts.apple.com',
]

// Common regex parts
const MUSIC_DOMAIN_PATTERN = '^https?://(?:www\\.)?(?:embed\\.)?music\\.apple\\.com'
const PODCASTS_DOMAIN_PATTERN = '^https?://(?:www\\.)?(?:embed\\.)?podcasts\\.apple\\.com'
const LOCALE_GROUP = '(?:(?<locale>[a-z]{2}(?:-[a-z]{2})?)\/)?'
const NAME_GROUP = '(?<name>[^\/]+)'


export const applemusic: PlatformModule = {
    id: Platforms.AppleMusic,
    name: 'Apple Music',
    color: '#fa243c',

    domains: domains,

    domainsRegexp: new RegExp(`^(?:https?://)?(?:www\\.)?(?:(?:music|podcasts)\\.apple\\.com|embed\\.(?:music\\.|podcasts\\.)?apple\\.com)`, 'i'),

    patterns: {
        // Keep simple handle pattern for validation
        profile: new RegExp(`^https?://(music|podcasts)\\.apple\\.com/(?:(\w{2})/)?(album|artist|playlist|song|station|podcast)/[^/]+/([a-zA-Z0-9.-]+)/?${QUERY_HASH}$`, 'i'),
        handle: /^\d+$/, // artist id
        content: {
            // order of items is important
            playlist: new RegExp(`${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}playlist\\/${NAME_GROUP}\\/(?<playlistId>[a-zA-Z0-9.-]+)(?:\\?.*)?$`, 'i'),
            artist: new RegExp(`${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}artist\\/${NAME_GROUP}\\/(?<artistId>\\d+)(?:\\?.*)?$`, 'i'),
            station: new RegExp(`${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}station\\/${NAME_GROUP}\\/(?<stationId>[a-zA-Z0-9.-]+)(?:\\?.*)?$`, 'i'),
            podcastEpisode: new RegExp(`${PODCASTS_DOMAIN_PATTERN}\\/${LOCALE_GROUP}podcast\\/${NAME_GROUP}\\/id(?<podcastId>\\d+)\\?.*i=(?<episodeId>\\d+).*$`, 'i'),
            podcast: new RegExp(`${PODCASTS_DOMAIN_PATTERN}\\/${LOCALE_GROUP}podcast\\/${NAME_GROUP}\\/id(?<podcastId>\\d+)(?:\\?.*)?$`, 'i'),
            song: new RegExp(`${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}song\\/${NAME_GROUP}\\/(?<songId>\\d+)(?:\\?.*)?$`, 'i'),
            track: new RegExp(`${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}album\\/${NAME_GROUP}\\/(?<albumId>\\d+)\\?.*i=(?<trackId>\\d+).*$`, 'i'),
            album: new RegExp(`${MUSIC_DOMAIN_PATTERN}\\/${LOCALE_GROUP}album\\/${NAME_GROUP}\\/(?<albumId>\\d+)(?:\\?.*)?$`, 'i')
        }
    },

    detect(url: string): boolean {
        return this.domainsRegexp!.test(url)
    },

    extract(url: string, res: ParsedUrl): void {
        const urlObj = getUrlSafe(url)
        if (!urlObj) return

        // Try each content pattern until one matches
        const contentPatterns = this.patterns.content
        if (!contentPatterns) return

        let matchResult: { contentType: string; match: RegExpMatchArray } | null = null

        // Try each pattern
        for (const [contentType, pattern] of Object.entries(contentPatterns)) {
            if (!pattern) continue
            const match = urlObj.href.match(pattern)
            if (match && match.groups) {
                matchResult = { contentType, match }
                break
            }
        }

        if (!matchResult) return

        const { contentType, match } = matchResult
        const groups = match.groups!

        // Set content type and appropriate metadata
        res.metadata.contentType = contentType

        // Extract locale if available
        if (groups.locale) {
            res.metadata.locale = groups.locale
        }

        // Set content ID and metadata based on content type
        switch (contentType) {
            case 'artist':
                res.ids.artistId = groups.artistId
                res.metadata.isProfile = true
                break
            case 'album':
                res.ids.albumId = groups.albumId
                res.metadata.isAlbum = true
                break
            case 'playlist':
                res.ids.playlistId = groups.playlistId
                res.metadata.isPlaylist = true
                break
            case 'song':
                res.ids.songId = groups.songId
                res.metadata.isSong = true
                break
            case 'track':
                res.ids.albumId = groups.albumId
                res.ids.trackId = groups.trackId
                res.metadata.isTrack = true
                break
            case 'station':
                res.ids.stationId = groups.stationId
                res.metadata.isStation = true
                break
            case 'podcast':
                res.ids.podcastId = groups.podcastId
                res.metadata.isPodcast = true
                break
            case 'podcastEpisode':
                res.ids.podcastId = groups.podcastId
                res.ids.episodeId = groups.episodeId
                res.metadata.isPodcastEpisode = true
                break
        }

        // Set domain
        res.metadata.domain = urlObj.hostname
    },

    validateHandle(handle: string): boolean {
        return this.patterns.handle.test(handle)
    },

    buildProfileUrl(artistId: string): string {
        // cannot know locale and artist slug; basic form
        return `https://music.apple.com/us/artist/id${artistId}`
    },

    normalizeUrl(url: string): string {
        return normalize(url)
    },

    getEmbedInfo(url: string) {
        // Parse the URL internally
        const result: ParsedUrl = {
            isValid: false,
            originalUrl: url,
            normalizedUrl: url,
            platform: null,
            ids: {},
            metadata: {}
        }

        this.extract(url, result)

        if (!result.metadata.contentType) {
            return null
        }
        
        // Determine target domain based on content type
        const targetDomain = (result.metadata.contentType === 'podcast' || result.metadata.contentType === 'podcastEpisode') 
            ? 'embed.podcasts.apple.com' 
            : 'embed.music.apple.com'
        
        // Generate embed URL using the provided function
        const embedUrl = getAppleMusicEmbedUrl(targetDomain, url)
        return { embedUrl, type: 'iframe', contentType: result.metadata.contentType }
    }
} 