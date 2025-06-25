"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.discord = void 0;
const types_1 = require("../../core/types");
const url_1 = require("../../utils/url");
exports.discord = {
    id: types_1.Platforms.Discord,
    name: 'Discord',
    color: '#5865F2',
    domains: ['discord.gg', 'discord.com'],
    patterns: {
        profile: /discord\.com\/users\/(\d+)/i,
        handle: /^.{2,32}#\d{4}$/,
        content: {
            invite: /discord\.gg\/([A-Za-z0-9]+)/i,
        },
    },
    detect(url) {
        return this.domains.some(d => url.includes(d));
    },
    extract(url, result) {
        const inviteMatch = this.patterns.content?.invite?.exec(url);
        if (inviteMatch) {
            result.ids.inviteId = inviteMatch[1];
            result.metadata.contentType = 'invite';
        }
        const profileMatch = this.patterns.profile.exec(url);
        if (profileMatch) {
            result.userId = profileMatch[1];
            result.metadata.isProfile = true;
            result.metadata.contentType = 'profile';
        }
    },
    validateHandle(handle) {
        return this.patterns.handle.test(handle);
    },
    buildProfileUrl(username) {
        return `https://discord.com/users/${username}`;
    },
    normalizeUrl(url) {
        return (0, url_1.normalize)(url);
    },
};
