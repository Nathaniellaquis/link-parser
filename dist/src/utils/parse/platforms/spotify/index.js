"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spotify = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.spotify = {
    id: types_1.Platforms.Spotify,
    name: 'Spotify',
    color: '#1DB954',
    domains: ['spotify.com', 'open.spotify.com'],
    patterns: {
        profile: /open\.spotify\.com\/(?:user|artist)\/([A-Za-z0-9]+)/i,
        handle: /^[A-Za-z0-9]{3,32}$/,
        content: {
            track: /open\.spotify\.com\/track\/([A-Za-z0-9]+)/i,
            playlist: /open\.spotify\.com\/playlist\/([A-Za-z0-9]+)/i,
            album: /open\.spotify\.com\/album\/([A-Za-z0-9]+)/i,
        },
    },
    detect(url) {
        return this.domains.some(d => url.includes(d));
    },
    extract(url, result) {
        for (const [type, patternValue] of Object.entries(this.patterns.content || {})) {
            const pattern = patternValue;
            if (!pattern)
                continue;
            const match = pattern.exec(url);
            if (match) {
                result.ids[`${type}Id`] = match[1];
                result.metadata.contentType = type;
                result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
                break;
            }
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
            result.userId = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://open.spotify.com/user/${username}`;
    },
    buildContentUrl(contentType, id) {
        return `https://open.spotify.com/${contentType}/${id}`;
    },
    generateEmbedUrl(contentType, id) {
        return `https://open.spotify.com/embed/${contentType}/${id}`;
    },
    getEmbedInfo(url, parsed) {
        if (url.includes('/embed/')) {
            return { embedUrl: url, isEmbedAlready: true };
        }
        const types = [
            ['track', parsed.ids.trackId],
            ['album', parsed.ids.albumId],
            ['playlist', parsed.ids.playlistId],
        ];
        for (const [type, id] of types) {
            if (id) {
                const embedUrl = this.generateEmbedUrl ? this.generateEmbedUrl(type, id) : `https://open.spotify.com/embed/${type}/${id}`;
                return { embedUrl, type: 'iframe' };
            }
        }
        return null;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url.replace(/[?&](si|utm_[^&]+)=[^&]+/g, ''));
    },
};
