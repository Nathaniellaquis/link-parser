"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.substack = void 0;
const types_1 = require("../../core/types");
exports.substack = {
    id: types_1.Platforms.Substack,
    name: 'Substack',
    domains: ['substack.com'],
    patterns: {
        profile: /([a-z0-9-]+)\.substack\.com/i,
        handle: /^[a-z0-9-]+$/,
    },
    detect: url => url.includes('.substack.com'),
    extract: (url, res) => {
        const m = /([a-z0-9-]+)\.substack\.com/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'newsletter';
        }
    },
    validateHandle: h => /^[a-z0-9-]+$/.test(h),
    buildProfileUrl: u => `https://${u}.substack.com`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
