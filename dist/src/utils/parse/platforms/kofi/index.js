"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.kofi = void 0;
const types_1 = require("../../core/types");
exports.kofi = {
    id: types_1.Platforms.KoFi,
    name: 'Ko-fi',
    domains: ['ko-fi.com'],
    patterns: {
        profile: /ko-fi\.com\/([A-Za-z0-9_-]+)/i,
        handle: /^[A-Za-z0-9_-]+$/,
    },
    detect: url => url.includes('ko-fi.com'),
    extract: (url, res) => {
        const m = /ko-fi\.com\/([A-Za-z0-9_-]+)/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'profile';
        }
    },
    validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
    buildProfileUrl: u => `https://ko-fi.com/${u}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
