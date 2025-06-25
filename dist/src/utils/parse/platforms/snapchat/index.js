"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapchat = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.snapchat = {
    id: types_1.Platforms.Snapchat,
    name: 'Snapchat',
    color: '#FFFC00',
    domains: ['snapchat.com'],
    patterns: {
        profile: /snapchat\.com\/add\/([A-Za-z0-9._-]+)/i,
        handle: /^[A-Za-z0-9._-]{3,15}$/,
        content: {
            story: /snapchat\.com\/add\/([A-Za-z0-9._-]+)\?shareId=([a-f0-9-]+)/i,
        },
    },
    detect(url) {
        return url.includes('snapchat.com');
    },
    extract(url, result) {
        const storyMatch = this.patterns.content?.story?.exec(url);
        if (storyMatch) {
            result.username = storyMatch[1];
            result.ids.storyId = storyMatch[2];
            result.metadata.isStory = true;
            result.metadata.contentType = 'story';
        }
        else {
            const profileMatch = this.patterns.profile.exec(url);
            if (profileMatch) {
                result.username = profileMatch[1];
                result.metadata.isProfile = true;
                result.metadata.contentType = 'profile';
            }
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle.replace('@', ''));
    },
    buildProfileUrl(username) {
        return `https://snapchat.com/add/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url);
    },
};
