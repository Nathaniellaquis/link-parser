"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mastodon = void 0;
const types_1 = require("../../core/types");
exports.mastodon = {
    id: types_1.Platforms.Mastodon,
    name: 'Mastodon',
    domains: [], // decentralized, detect by pattern
    patterns: {
        profile: /https?:\/\/([\w.-]+)\/@([\w.-]+)/i,
        handle: /^@?[\w.-]+@[\w.-]+$/,
    },
    detect: url => /\/@[\w.-]+/i.test(url) && url.includes('://'),
    extract: (url, res) => {
        const m = /https?:\/\/([\w.-]+)\/@([\w.-]+)/i.exec(url);
        if (m) {
            res.username = `${m[2]}@${m[1]}`;
            res.metadata.isProfile = true;
            res.metadata.contentType = 'profile';
            res.platformName = 'Mastodon';
        }
    },
    validateHandle: h => /^@?[\w.-]+@[\w.-]+$/.test(h),
    buildProfileUrl: u => {
        const parts = u.replace('@', '').split('@');
        return `https://${parts[1]}/@${parts[0]}`;
    },
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
