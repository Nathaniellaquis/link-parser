"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.twitter = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.twitter = {
    id: types_1.Platforms.Twitter,
    name: 'Twitter',
    color: '#1DA1F2',
    domains: ['twitter.com', 'x.com'],
    mobileSubdomains: ['m', 'mobile'],
    patterns: {
        profile: /(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)/i,
        handle: /^@[A-Za-z0-9_]{1,15}$/,
        content: {
            post: /(?:twitter\.com|x\.com)\/[A-Za-z0-9_]+\/status\/(\d+)/i,
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
        if (profileMatch && !/\/status\//.test(url)) {
            result.username = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle.startsWith('@') ? handle : `@${handle}`);
    },
    buildProfileUrl(username) {
        const clean = username.replace('@', '');
        return `https://x.com/${clean}`;
    },
    buildContentUrl(contentType, id) {
        if (contentType === 'post') {
            return `https://x.com/i/status/${id}`;
        }
        return `https://x.com/${id}`;
    },
    normalizeUrl(url) {
        url = url.replace('twitter.com', 'x.com');
        url = url.replace(/[?&](s|t|ref_src)=[^&]+/g, '');
        return (0, url_1.normalize)(url);
    },
    getEmbedInfo(url, parsed) {
        if (url.includes('twitframe.com')) {
            return { embedUrl: url, isEmbedAlready: true };
        }
        if (parsed.ids.postId) {
            const tweetUrl = this.buildContentUrl ? this.buildContentUrl('post', parsed.ids.postId) : `https://x.com/i/status/${parsed.ids.postId}`;
            const embedUrl = `https://twitframe.com/show?url=${encodeURIComponent(tweetUrl)}`;
            return { embedUrl, type: 'iframe' };
        }
        return null;
    },
};
