"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.soundcloud = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.soundcloud = {
    id: types_1.Platforms.SoundCloud,
    name: 'SoundCloud',
    color: '#FF5500',
    domains: ['soundcloud.com'],
    patterns: {
        profile: /soundcloud\.com\/([A-Za-z0-9_-]+)/i,
        handle: /^[A-Za-z0-9_-]{3,25}$/,
        content: {
            track: /soundcloud\.com\/[A-Za-z0-9_-]+\/([A-Za-z0-9_-]+)/i,
        },
    },
    detect(url) {
        return url.includes('soundcloud.com');
    },
    extract(url, result) {
        const trackMatch = this.patterns.content?.track?.exec(url);
        if (trackMatch) {
            result.ids.trackId = trackMatch[1];
            result.metadata.contentType = 'track';
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
            result.username = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://soundcloud.com/${username}`;
    },
    buildContentUrl(contentType, id) {
        if (contentType === 'track') {
            return `https://soundcloud.com/track/${id}`;
        }
        return `https://soundcloud.com/${id}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url.replace(/[?&]utm_[^&]+/g, ''));
    },
    generateEmbedUrl(contentId) {
        return `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${contentId}`;
    },
    getEmbedInfo(url, parsed) {
        if (url.includes('w.soundcloud.com/player')) {
            return { embedUrl: url, isEmbedAlready: true };
        }
        const id = parsed.ids.trackId;
        if (id) {
            const embedUrl = this.generateEmbedUrl ? this.generateEmbedUrl(id) : `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${id}`;
            return { embedUrl, type: 'iframe' };
        }
        return null;
    },
};
