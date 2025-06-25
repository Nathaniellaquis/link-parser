"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facebook = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.facebook = {
    id: types_1.Platforms.Facebook,
    name: 'Facebook',
    color: '#1877F2',
    domains: ['facebook.com', 'fb.com'],
    mobileSubdomains: ['m', 'mobile'],
    patterns: {
        profile: /(?:facebook\.com|fb\.com)\/profile\.php\?id=(\d+)|(?:facebook\.com|fb\.com)\/([A-Za-z0-9_.]+)/i,
        handle: /^[A-Za-z0-9.]{5,}$/,
        content: {
            post: /(?:facebook\.com|fb\.com)\/[A-Za-z0-9_.]+\/posts\/(\d+)/i,
            video: /(?:facebook\.com|fb\.com)\/[A-Za-z0-9_.]+\/videos\/(\d+)/i,
        },
    },
    detect(url) {
        return this.domains.some(d => url.includes(d));
    },
    extract(url, result) {
        if (this.patterns.content) {
            for (const [type, patternValue] of Object.entries(this.patterns.content)) {
                const pattern = patternValue;
                if (!pattern)
                    continue;
                const match = pattern.exec(url);
                if (match) {
                    result.ids[`${type}Id`] = match[1];
                    result.metadata[`is${type.charAt(0).toUpperCase() + type.slice(1)}`] = true;
                    result.metadata.contentType = type;
                    break;
                }
            }
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
            result.username = profileMatch[2] || undefined;
            result.userId = profileMatch[1] || undefined;
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://facebook.com/${username}`;
    },
    buildContentUrl(contentType, id) {
        if (contentType === 'video') {
            return `https://facebook.com/watch/?v=${id}`;
        }
        return `https://facebook.com/story.php?story_fbid=${id}`;
    },
    normalizeUrl(url) {
        url = url.replace(/[?&](mibextid|ref|refsrc|_rdc|_rdr|sfnsn|hc_ref)=[^&]+/g, '');
        return (0, url_1.normalize)(url);
    },
};
