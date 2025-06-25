"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const detector_1 = require("./detector");
const url_1 = require("../utils/url");
/**
 * Parse a social media URL or handle into structured data.
 */
function parse(input) {
    // Prepare the result object with defaults
    const result = {
        isValid: false,
        originalUrl: input,
        normalizedUrl: input,
        platform: null,
        ids: {},
        metadata: {},
    };
    // Basic heuristic: if the input lacks protocol but includes a dot, treat as URL
    const looksLikeUrl = /[.:]/.test(input);
    let platformModule;
    if (!looksLikeUrl) {
        // Try to detect even without URL-like characters (email, phone, etc.)
        platformModule = (0, detector_1.detectPlatform)(input);
        if (!platformModule) {
            return result;
        }
    }
    else {
        platformModule = (0, detector_1.detectPlatform)(input);
        if (!platformModule) {
            return result;
        }
    }
    result.platform = platformModule.id;
    result.platformName = platformModule.name;
    // Extract platform-specific data
    platformModule.extract(input, result);
    // Normalise URL using platform-specific logic first, then generic fallback
    let normalized = platformModule.normalizeUrl(input);
    if (normalized.startsWith('http')) {
        normalized = (0, url_1.normalize)(normalized);
    }
    result.normalizedUrl = normalized;
    // Canonical url: prefer platform.buildProfileUrl when we have username and it's profile
    if (result.username && result.metadata.isProfile) {
        result.canonicalUrl = platformModule.buildProfileUrl(result.username);
    }
    // Embed detection / generation
    const embedInfo = platformModule.getEmbedInfo?.(input, result);
    if (embedInfo) {
        result.embedData = {
            platform: platformModule.id,
            type: embedInfo.type ?? 'iframe',
            contentId: result.ids.videoId || result.ids.postId || result.ids.trackId || result.ids.pinId || '',
            embedUrl: embedInfo.embedUrl,
            options: embedInfo.options,
        };
        if (embedInfo.isEmbedAlready) {
            result.metadata.isEmbed = true;
        }
    }
    result.isValid = true;
    return result;
}
exports.parse = parse;
