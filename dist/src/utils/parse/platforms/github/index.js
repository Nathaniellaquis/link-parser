"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.github = void 0;
const types_1 = require("../../core/types");
exports.github = {
    id: types_1.Platforms.GitHub,
    name: 'GitHub',
    domains: ['github.com'],
    patterns: {
        profile: /github\.com\/([A-Za-z0-9-]+)/i,
        handle: /^[A-Za-z0-9-]{1,39}$/,
    },
    detect: url => url.includes('github.com'),
    extract: (url, res) => {
        const m = /github\.com\/([A-Za-z0-9-]+)/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'profile';
        }
    },
    validateHandle: h => /^[A-Za-z0-9-]{1,39}$/.test(h),
    buildProfileUrl: u => `https://github.com/${u}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
