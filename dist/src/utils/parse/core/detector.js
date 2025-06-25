"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectPlatform = void 0;
const platforms_1 = require("../platforms");
/**
 * Attempts to detect the correct platform module for a given URL.
 * Returns undefined if none match.
 */
function detectPlatform(url) {
    const lower = url.toLowerCase();
    for (const module of platforms_1.registry.values()) {
        if (module.detect(lower)) {
            return module;
        }
    }
    return undefined;
}
exports.detectPlatform = detectPlatform;
