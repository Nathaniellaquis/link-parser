"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pinterest = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.pinterest = {
    id: types_1.Platforms.Pinterest,
    name: 'Pinterest',
    color: '#BD081C',
    domains: ['pinterest.com', 'pin.it'],
    patterns: {
        profile: /pinterest\.com\/([A-Za-z0-9_]+)/i,
        handle: /^[A-Za-z0-9_]{3,15}$/,
        content: {
            pin: /pinterest\.com\/pin\/(\d+)/i,
            short: /pin\.it\/([A-Za-z0-9]+)/i,
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
            result.username = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://pinterest.com/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url.replace(/[?&]utm_[^&]+/g, ''));
    },
};
