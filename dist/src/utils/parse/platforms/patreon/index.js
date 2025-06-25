"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.patreon = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.patreon = {
    id: types_1.Platforms.Patreon,
    name: 'Patreon',
    color: '#F96854',
    domains: ['patreon.com'],
    patterns: {
        profile: /patreon\.com\/([A-Za-z0-9_-]+)/i,
        handle: /^[A-Za-z0-9_-]{3,50}$/,
        content: {
            post: /patreon\.com\/posts\/(\d+)/i,
        },
    },
    detect(url) {
        return url.includes('patreon.com');
    },
    extract(url, result) {
        const postMatch = this.patterns.content?.post?.exec(url);
        if (postMatch) {
            result.ids.postId = postMatch[1];
            result.metadata.isPost = true;
            result.metadata.contentType = 'post';
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
            result.username = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://patreon.com/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url);
    },
};
