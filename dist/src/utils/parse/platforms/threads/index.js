"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.threads = void 0;
const types_1 = require("../../core/types");
exports.threads = {
    id: types_1.Platforms.Threads,
    name: 'Threads',
    domains: ['threads.net'],
    patterns: {
        profile: /threads\.net\/(@?[a-zA-Z0-9._]+)/i,
        handle: /^@?[a-zA-Z0-9._]{1,30}$/,
    },
    detect: url => url.includes('threads.net'),
    extract: (url, res) => {
        const m = /threads\.net\/(@?[a-zA-Z0-9._]+)/i.exec(url);
        if (m) {
            res.username = m[1].replace('@', '');
            res.metadata.isProfile = true;
            res.metadata.contentType = 'profile';
        }
    },
    validateHandle: h => /^@?[a-zA-Z0-9._]{1,30}$/i.test(h),
    buildProfileUrl: u => `https://threads.net/${u.replace('@', '')}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
