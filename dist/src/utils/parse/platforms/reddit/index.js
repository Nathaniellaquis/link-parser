"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reddit = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.reddit = {
    id: types_1.Platforms.Reddit,
    name: 'Reddit',
    color: '#FF4500',
    domains: ['reddit.com', 'redd.it'],
    patterns: {
        profile: /(?:reddit\.com)\/user\/([A-Za-z0-9_-]+)/i,
        handle: /^u\/[A-Za-z0-9_-]{3,20}$/,
        content: {
            post: /(?:reddit\.com\/r\/[A-Za-z0-9_]+\/comments|redd\.it)\/(\w+)/i,
        },
    },
    detect(url) {
        return this.domains.some(d => url.includes(d));
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
        return this.patterns.handle.test(handle.startsWith('u/') ? handle : `u/${handle}`);
    },
    buildProfileUrl(username) {
        return `https://reddit.com/user/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url.replace(/[?&]utm_[^&]+/g, ''));
    },
};
