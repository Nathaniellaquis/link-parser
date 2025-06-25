"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phone = void 0;
const types_1 = require("../../core/types");
const libphonenumber_js_1 = require("libphonenumber-js");
const DIGIT_RE = /\+?[0-9 ()\-\.]{5,}/;
exports.phone = {
    id: types_1.Platforms.Phone,
    name: 'Phone',
    domains: [],
    patterns: {
        profile: DIGIT_RE,
        handle: /^\+?[0-9]{5,15}$/,
    },
    detect(raw) {
        if (raw.startsWith('tel:'))
            raw = raw.slice(4);
        const pn = (0, libphonenumber_js_1.parsePhoneNumberFromString)(raw);
        return !!pn;
    },
    extract(raw, res) {
        let num = raw.startsWith('tel:') ? raw.slice(4) : raw;
        const pn = (0, libphonenumber_js_1.parsePhoneNumberFromString)(num);
        if (pn) {
            res.userId = pn.number;
            res.metadata.isProfile = true;
            res.metadata.contentType = 'phone';
        }
    },
    validateHandle(handle) {
        const pn = (0, libphonenumber_js_1.parsePhoneNumberFromString)(handle);
        return !!pn;
    },
    buildProfileUrl(username) {
        const pn = (0, libphonenumber_js_1.parsePhoneNumberFromString)(username);
        const e164 = pn ? pn.number : username.replace(/[^0-9+]/g, '');
        return `tel:${e164}`;
    },
    normalizeUrl(url) {
        if (url.startsWith('tel:'))
            url = url.slice(4);
        const pn = (0, libphonenumber_js_1.parsePhoneNumberFromString)(url);
        return pn ? `tel:${pn.number}` : url;
    },
};
