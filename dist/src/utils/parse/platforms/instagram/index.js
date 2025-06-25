"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.instagram = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.instagram = {
    id: types_1.Platforms.Instagram,
    name: 'Instagram',
    color: '#E1306C',
    domains: ['instagram.com', 'instagr.am'],
    mobileSubdomains: ['m', 'mobile'],
    patterns: {
        profile: /^(?:https?:\/\/)?(?:www\.|m\.|mobile\.)?(?:instagram\.com|instagr\.am)\/([a-zA-Z0-9_.]+)/i,
        handle: /^[\w](?!.*?\.{2})[\w.]{0,28}[\w]$/i,
        content: {
            post: /instagram\.com\/p\/([A-Za-z0-9_-]+)/i,
            reel: /instagram\.com\/reel[s]?\/([A-Za-z0-9_-]+)/i,
            story: /instagram\.com\/stories\/([a-zA-Z0-9_.]+)\/(\d+)/i,
            tv: /instagram\.com\/tv\/([A-Za-z0-9_-]+)/i,
        },
    },
    detect(url) {
        return this.domains.some(domain => url.includes(domain));
    },
    extract(url, result) {
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch && !/\/(p|reel|tv|stories)\//.test(url)) {
            result.username = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
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
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle.replace('@', ''));
    },
    buildProfileUrl(username) {
        const clean = username.replace('@', '');
        return `https://instagram.com/${clean}`;
    },
    buildContentUrl(contentType, id) {
        const map = { post: 'p', reel: 'reel', tv: 'tv' };
        const path = map[contentType] || 'p';
        return `https://instagram.com/${path}/${id}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url.replace(/[?&](igshid|utm_[^&]+|ig_[^&]+)=[^&]+/g, ''));
    },
    getEmbedInfo(url, parsed) {
        if (/instagram\.com\/.*\/embed\//.test(url)) {
            return { embedUrl: url, isEmbedAlready: true };
        }
        const id = parsed.ids.postId || parsed.ids.reelId || parsed.ids.tvId;
        if (id) {
            const embedUrl = `https://www.instagram.com/p/${id}/embed/`;
            return { embedUrl, type: 'iframe' };
        }
        return null;
    },
};
