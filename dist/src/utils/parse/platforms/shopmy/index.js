"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopmy = void 0;
const types_1 = require("../../core/types");
exports.shopmy = {
    id: types_1.Platforms.ShopMy,
    name: 'ShopMy',
    domains: ['shopmy.us'],
    patterns: {
        profile: /shopmy\.us\/[A-Za-z0-9_-]+$/i,
        handle: /^[A-Za-z0-9_-]+$/,
    },
    detect: url => /shopmy\.us/.test(url),
    extract: (url, result) => {
        const m = /shopmy\.us\/([A-Za-z0-9_-]+)$/i.exec(url);
        if (m) {
            result.username = m[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'storefront';
        }
    },
    validateHandle: h => /^[A-Za-z0-9_-]+$/.test(h),
    buildProfileUrl: username => `https://shopmy.us/${username}`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
