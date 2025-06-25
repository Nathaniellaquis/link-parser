"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gitlab = void 0;
const types_1 = require("../../core/types");
exports.gitlab = {
    id: types_1.Platforms.GitLab,
    name: 'GitLab',
    domains: ['gitlab.com'],
    patterns: {
        profile: /gitlab\.com\/([A-Za-z0-9_-]+)/i,
        handle: /^[A-Za-z0-9_-]+$/,
    },
    detect: url => url.includes('gitlab.com'),
    extract: (url, res) => {
        const m = /gitlab\.com\/([A-Za-z0-9_-]+)/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'profile';
        }
    },
    validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
    buildProfileUrl: u => `https://gitlab.com/${u}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
