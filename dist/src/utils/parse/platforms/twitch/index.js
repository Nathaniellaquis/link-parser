"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitch = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.twitch = {
    id: types_1.Platforms.Twitch,
    name: 'Twitch',
    color: '#9146FF',
    domains: ['twitch.tv'],
    patterns: {
        profile: /twitch\.tv\/([A-Za-z0-9_]+)/i,
        handle: /^[A-Za-z0-9_]{4,25}$/,
        content: {
            video: /twitch\.tv\/videos\/(\d+)/i,
            clip: /clips\.twitch\.tv\/([A-Za-z0-9]+)/i,
        },
    },
    detect(url) {
        return url.includes('twitch.tv');
    },
    extract(url, result) {
        for (const [type, patternValue] of Object.entries(this.patterns.content || {})) {
            const pattern = patternValue;
            if (!pattern)
                continue;
            const match = pattern.exec(url);
            if (match) {
                result.ids[`${type}Id`] = match[1];
                result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
                result.metadata.contentType = type;
                break;
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
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://twitch.tv/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url);
    },
};
