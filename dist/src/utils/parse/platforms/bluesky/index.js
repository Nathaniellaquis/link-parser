"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bluesky = void 0;
const types_1 = require("../../core/types");
exports.bluesky = {
    id: types_1.Platforms.Bluesky,
    name: 'Bluesky',
    domains: ['bsky.app'],
    patterns: {
        profile: /bsky\.app\/profile\/([a-zA-Z0-9.-]+)\/?/i,
        handle: /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/,
    },
    detect: url => url.includes('bsky.app'),
    extract: (url, res) => {
        const m = /bsky\.app\/profile\/([a-zA-Z0-9.-]+)/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'profile';
        }
    },
    validateHandle: h => /^[a-zA-Z0-9.-]+\.[a-zA-Z]+$/.test(h),
    buildProfileUrl: u => `https://bsky.app/profile/${u}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
