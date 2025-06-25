"use strict";
/*
 * URL utilities for the platform parser
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalize = exports.removeTrailingSlash = exports.ensureHttps = exports.stripTrackingParams = void 0;
/**
 * Remove known tracking query parameters from a URL string
 */
function stripTrackingParams(url) {
    const urlObj = new URL(url, url.startsWith('http') ? undefined : 'https://dummy.invalid');
    const paramsToStrip = [
        // Generic tracking parameters
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_term',
        'utm_content',
        'fbclid',
        'igshid',
        // Platform-specific variants (prefix match)
    ];
    paramsToStrip.forEach(param => urlObj.searchParams.delete(param));
    return urlObj.search ? urlObj.toString() : urlObj.toString().replace(/\?$/, '');
}
exports.stripTrackingParams = stripTrackingParams;
/**
 * Ensure a URL string starts with https://.
 */
function ensureHttps(url) {
    if (url.startsWith('http://')) {
        return url.replace('http://', 'https://');
    }
    if (!url.startsWith('http')) {
        return `https://${url}`;
    }
    return url;
}
exports.ensureHttps = ensureHttps;
/**
 * Remove a trailing slash from the URL (unless it is the only path separator)
 */
function removeTrailingSlash(url) {
    return url.endsWith('/') ? url.slice(0, -1) : url;
}
exports.removeTrailingSlash = removeTrailingSlash;
/**
 * Normalize a URL using standard rules: https enforcement, strip tracking, remove trailing slash
 */
function normalize(url) {
    return removeTrailingSlash(stripTrackingParams(ensureHttps(url)));
}
exports.normalize = normalize;
