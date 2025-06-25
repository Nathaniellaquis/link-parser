"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtube = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.youtube = {
    id: types_1.Platforms.YouTube,
    name: 'YouTube',
    color: '#FF0000',
    domains: ['youtube.com', 'youtu.be', 'youtube-nocookie.com'],
    mobileSubdomains: ['m', 'mobile'],
    shortDomains: ['youtu.be'],
    patterns: {
        profile: /youtube\.com\/(?:c\/|channel\/|user\/|@)([a-zA-Z0-9_-]+)/i,
        handle: /^[a-zA-Z0-9][a-zA-Z0-9._-]{2,29}$/,
        content: {
            video: /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/i,
            short: /youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/i,
            playlist: /youtube\.com\/playlist\?list=([a-zA-Z0-9_-]+)/i,
            live: /youtube\.com\/live\/([a-zA-Z0-9_-]{11})/i,
        },
    },
    detect(url) {
        return this.domains.some(domain => url.includes(domain));
    },
    extract(url, result) {
        if (this.patterns.content) {
            for (const [type, patternValue] of Object.entries(this.patterns.content)) {
                const pattern = patternValue;
                if (!pattern)
                    continue;
                const match = pattern.exec(url);
                if (match) {
                    result.ids[`${type}Id`] = match[1];
                    result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
                    result.metadata.contentType = type;
                    if (['video', 'short', 'live'].includes(type)) {
                        const tMatch = url.match(/[?&]t=(\d+)/);
                        if (tMatch)
                            result.metadata.timestamp = parseInt(tMatch[1]);
                    }
                    break;
                }
            }
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
            result.username = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle.replace('@', ''));
    },
    buildProfileUrl(username) {
        const clean = username.replace('@', '');
        if (clean.startsWith('UC') && clean.length === 24) {
            return `https://youtube.com/channel/${clean}`;
        }
        return `https://youtube.com/@${clean}`;
    },
    buildContentUrl(contentType, id) {
        if (['video', 'short', 'live'].includes(contentType))
            return `https://youtube.com/watch?v=${id}`;
        if (contentType === 'playlist')
            return `https://youtube.com/playlist?list=${id}`;
        return `https://youtube.com/watch?v=${id}`;
    },
    normalizeUrl(url) {
        url = url.replace(/[?&](feature|si|pp|ab_channel)=[^&]+/g, '');
        return (0, url_1.normalize)(url);
    },
    extractTimestamp(url) {
        const match = url.match(/[?&]t=(\d+)/);
        return match ? parseInt(match[1]) : null;
    },
    generateEmbedUrl(contentId, options) {
        const params = new URLSearchParams();
        if (options?.startTime)
            params.set('start', options.startTime.toString());
        if (options?.autoplay)
            params.set('autoplay', '1');
        const qs = params.toString();
        return `https://www.youtube.com/embed/${contentId}${qs ? `?${qs}` : ''}`;
    },
    async resolveShortUrl(shortUrl) {
        const match = /youtu\.be\/([a-zA-Z0-9_-]{11})/.exec(shortUrl);
        if (match)
            return `https://youtube.com/watch?v=${match[1]}`;
        return shortUrl;
    },
    getEmbedInfo(url, parsed) {
        // If already an embed src
        const embedMatch = /youtube\.com\/embed\/([A-Za-z0-9_-]{11})/.exec(url);
        if (embedMatch) {
            return { embedUrl: url, isEmbedAlready: true };
        }
        const id = parsed.ids.videoId || parsed.ids.shortId || parsed.ids.liveId;
        if (id) {
            const embedUrl = this.generateEmbedUrl ? this.generateEmbedUrl(id) : `https://www.youtube.com/embed/${id}`;
            return { embedUrl, type: 'iframe' };
        }
        return null;
    },
};
