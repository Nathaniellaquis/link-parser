"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tiktok = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.tiktok = {
    id: types_1.Platforms.TikTok,
    name: 'TikTok',
    color: '#000000',
    domains: ['tiktok.com'],
    mobileSubdomains: ['m', 'vm'],
    shortDomains: ['vm.tiktok.com'],
    patterns: {
        profile: /tiktok\.com\/@([A-Za-z0-9._]+)/i,
        handle: /^@[A-Za-z0-9._]{2,24}$/,
        content: {
            video: /tiktok\.com\/@[\w.-]+\/video\/(\d+)/i,
            short: /vm\.tiktok\.com\/([A-Za-z0-9]+)/i,
        },
    },
    detect(url) {
        return this.domains.some(d => url.includes(d)) || this.shortDomains?.some(sd => url.includes(sd)) || false;
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
                    result.metadata.contentType = 'video';
                    break;
                }
            }
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
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
        return `https://tiktok.com/@${clean}`;
    },
    buildContentUrl(contentType, id) {
        if (contentType === 'video') {
            return `https://tiktok.com/@placeholder/video/${id}`;
        }
        return `https://tiktok.com/v/${id}`;
    },
    normalizeUrl(url) {
        url = url.replace(/[?&](lang|_d|utm_[^&]+)=[^&]+/g, '');
        return (0, url_1.normalize)(url);
    },
    async resolveShortUrl(shortUrl) {
        return shortUrl;
    },
    getEmbedInfo(url, parsed) {
        if (/tiktok\.com\/embed\//.test(url)) {
            return { embedUrl: url, isEmbedAlready: true };
        }
        const id = parsed.ids.videoId;
        if (id) {
            const embedUrl = `https://www.tiktok.com/embed/v2/${id}`;
            return { embedUrl, type: 'iframe' };
        }
        return null;
    },
};
