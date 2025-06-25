"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.email = void 0;
const types_1 = require("../../core/types");
const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
exports.email = {
    id: types_1.Platforms.Email,
    name: 'Email',
    domains: [],
    patterns: {
        profile: EMAIL_REGEX,
        handle: EMAIL_REGEX,
    },
    detect(url) {
        if (url.startsWith('mailto:'))
            return EMAIL_REGEX.test(url.slice(7));
        return EMAIL_REGEX.test(url);
    },
    extract(url, result) {
        const address = url.startsWith('mailto:') ? url.slice(7) : url;
        if (EMAIL_REGEX.test(address)) {
            result.username = address.toLowerCase();
            result.metadata.isProfile = true;
            result.metadata.contentType = 'email';
        }
    },
    validateHandle(handle) {
        return EMAIL_REGEX.test(handle);
    },
    buildProfileUrl(username) {
        return `mailto:${username}`;
    },
    normalizeUrl(url) {
        const address = url.startsWith('mailto:') ? url.slice(7) : url;
        return `mailto:${address.toLowerCase()}`;
    },
};
