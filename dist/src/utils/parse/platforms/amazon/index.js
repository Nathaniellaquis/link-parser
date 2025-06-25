"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amazon = void 0;
const types_1 = require("../../core/types");
exports.amazon = {
    id: types_1.Platforms.Amazon,
    name: 'Amazon Storefront',
    domains: ['amazon.com'],
    patterns: {
        profile: /amazon\.com\/shop\/([A-Za-z0-9_-]+)/i,
        handle: /^[A-Za-z0-9_-]+$/,
    },
    detect: url => url.includes('amazon.com/shop'),
    extract: (url, res) => {
        const m = /amazon\.com\/shop\/([A-Za-z0-9_-]+)/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'storefront';
        }
    },
    validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
    buildProfileUrl: u => `https://amazon.com/shop/${u}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
