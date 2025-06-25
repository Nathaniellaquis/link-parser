"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shopify = void 0;
const types_1 = require("../../core/types");
exports.shopify = {
    id: types_1.Platforms.Shopify,
    name: 'Shopify Store',
    domains: ['myshopify.com'],
    patterns: {
        profile: /https?:\/\/([\w-]+)\.myshopify\.com/i,
        handle: /^[A-Za-z0-9-]+$/,
    },
    detect: url => /myshopify\.com/.test(url),
    extract: (url, res) => {
        const m = /https?:\/\/([\w-]+)\.myshopify\.com/i.exec(url);
        if (m) {
            res.username = m[1];
            res.metadata.isProfile = true;
            res.metadata.contentType = 'storefront';
        }
    },
    validateHandle: h => /^[A-Za-z0-9-]+$/.test(h),
    buildProfileUrl: u => `https://${u}.myshopify.com`,
    normalizeUrl: u => u.replace(/^http:\/\//, 'https://').replace(/\/$/, ''),
};
