"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedin = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.linkedin = {
    id: types_1.Platforms.LinkedIn,
    name: 'LinkedIn',
    color: '#0A66C2',
    domains: ['linkedin.com'],
    patterns: {
        profile: /linkedin\.com\/in\/([A-Za-z0-9-_%]+)/i,
        handle: /^[A-Za-z0-9-]{3,100}$/,
        content: {
            post: /linkedin\.com\/feed\/update\/urn:li:activity:(\d+)/i,
        },
    },
    detect(url) {
        return url.includes('linkedin.com');
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
        return `https://linkedin.com/in/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url.replace(/[?&]trk=[^&]+/g, ''));
    },
};
