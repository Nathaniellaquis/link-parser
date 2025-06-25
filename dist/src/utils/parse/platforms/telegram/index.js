"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telegram = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.telegram = {
    id: types_1.Platforms.Telegram,
    name: 'Telegram',
    color: '#0088CC',
    domains: ['t.me', 'telegram.me'],
    patterns: {
        profile: /(?:t\.me|telegram\.me)\/([A-Za-z0-9_]+)/i,
        handle: /^[A-Za-z0-9_]{5,32}$/,
        content: {
            post: /(?:t\.me|telegram\.me)\/[A-Za-z0-9_]+\/(\d+)/i,
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
        return this.patterns.handle.test(handle.replace('@', ''));
    },
    buildProfileUrl(username) {
        return `https://t.me/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url);
    },
};
