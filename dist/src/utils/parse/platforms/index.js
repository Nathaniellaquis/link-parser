"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.phone = exports.email = exports.shopmy = exports.kofi = exports.substack = exports.onlyfans = exports.shopify = exports.amazon = exports.bitbucket = exports.gitlab = exports.github = exports.tumblr = exports.mastodon = exports.bluesky = exports.threads = exports.soundcloud = exports.patreon = exports.twitch = exports.reddit = exports.discord = exports.telegram = exports.pinterest = exports.linkedin = exports.snapchat = exports.spotify = exports.facebook = exports.twitter = exports.tiktok = exports.youtube = exports.instagram = exports.registry = void 0;
// Import individual platform modules
const instagram_1 = require("./instagram");
Object.defineProperty(exports, "instagram", { enumerable: true, get: function () { return instagram_1.instagram; } });
const youtube_1 = require("./youtube");
Object.defineProperty(exports, "youtube", { enumerable: true, get: function () { return youtube_1.youtube; } });
const tiktok_1 = require("./tiktok");
Object.defineProperty(exports, "tiktok", { enumerable: true, get: function () { return tiktok_1.tiktok; } });
const twitter_1 = require("./twitter");
Object.defineProperty(exports, "twitter", { enumerable: true, get: function () { return twitter_1.twitter; } });
const facebook_1 = require("./facebook");
Object.defineProperty(exports, "facebook", { enumerable: true, get: function () { return facebook_1.facebook; } });
const spotify_1 = require("./spotify");
Object.defineProperty(exports, "spotify", { enumerable: true, get: function () { return spotify_1.spotify; } });
const snapchat_1 = require("./snapchat");
Object.defineProperty(exports, "snapchat", { enumerable: true, get: function () { return snapchat_1.snapchat; } });
const linkedin_1 = require("./linkedin");
Object.defineProperty(exports, "linkedin", { enumerable: true, get: function () { return linkedin_1.linkedin; } });
const pinterest_1 = require("./pinterest");
Object.defineProperty(exports, "pinterest", { enumerable: true, get: function () { return pinterest_1.pinterest; } });
const telegram_1 = require("./telegram");
Object.defineProperty(exports, "telegram", { enumerable: true, get: function () { return telegram_1.telegram; } });
const discord_1 = require("./discord");
Object.defineProperty(exports, "discord", { enumerable: true, get: function () { return discord_1.discord; } });
const reddit_1 = require("./reddit");
Object.defineProperty(exports, "reddit", { enumerable: true, get: function () { return reddit_1.reddit; } });
const twitch_1 = require("./twitch");
Object.defineProperty(exports, "twitch", { enumerable: true, get: function () { return twitch_1.twitch; } });
const patreon_1 = require("./patreon");
Object.defineProperty(exports, "patreon", { enumerable: true, get: function () { return patreon_1.patreon; } });
const soundcloud_1 = require("./soundcloud");
Object.defineProperty(exports, "soundcloud", { enumerable: true, get: function () { return soundcloud_1.soundcloud; } });
const threads_1 = require("./threads");
Object.defineProperty(exports, "threads", { enumerable: true, get: function () { return threads_1.threads; } });
const bluesky_1 = require("./bluesky");
Object.defineProperty(exports, "bluesky", { enumerable: true, get: function () { return bluesky_1.bluesky; } });
const mastodon_1 = require("./mastodon");
Object.defineProperty(exports, "mastodon", { enumerable: true, get: function () { return mastodon_1.mastodon; } });
const tumblr_1 = require("./tumblr");
Object.defineProperty(exports, "tumblr", { enumerable: true, get: function () { return tumblr_1.tumblr; } });
const github_1 = require("./github");
Object.defineProperty(exports, "github", { enumerable: true, get: function () { return github_1.github; } });
const gitlab_1 = require("./gitlab");
Object.defineProperty(exports, "gitlab", { enumerable: true, get: function () { return gitlab_1.gitlab; } });
const bitbucket_1 = require("./bitbucket");
Object.defineProperty(exports, "bitbucket", { enumerable: true, get: function () { return bitbucket_1.bitbucket; } });
const amazon_1 = require("./amazon");
Object.defineProperty(exports, "amazon", { enumerable: true, get: function () { return amazon_1.amazon; } });
const shopify_1 = require("./shopify");
Object.defineProperty(exports, "shopify", { enumerable: true, get: function () { return shopify_1.shopify; } });
const onlyfans_1 = require("./onlyfans");
Object.defineProperty(exports, "onlyfans", { enumerable: true, get: function () { return onlyfans_1.onlyfans; } });
const substack_1 = require("./substack");
Object.defineProperty(exports, "substack", { enumerable: true, get: function () { return substack_1.substack; } });
const kofi_1 = require("./kofi");
Object.defineProperty(exports, "kofi", { enumerable: true, get: function () { return kofi_1.kofi; } });
const shopmy_1 = require("./shopmy");
Object.defineProperty(exports, "shopmy", { enumerable: true, get: function () { return shopmy_1.shopmy; } });
const email_1 = require("./email");
Object.defineProperty(exports, "email", { enumerable: true, get: function () { return email_1.email; } });
const phone_1 = require("./phone");
Object.defineProperty(exports, "phone", { enumerable: true, get: function () { return phone_1.phone; } });
exports.registry = new Map([
    instagram_1.instagram,
    youtube_1.youtube,
    tiktok_1.tiktok,
    twitter_1.twitter,
    facebook_1.facebook,
    spotify_1.spotify,
    snapchat_1.snapchat,
    linkedin_1.linkedin,
    pinterest_1.pinterest,
    telegram_1.telegram,
    discord_1.discord,
    reddit_1.reddit,
    twitch_1.twitch,
    patreon_1.patreon,
    soundcloud_1.soundcloud,
    threads_1.threads,
    bluesky_1.bluesky,
    mastodon_1.mastodon,
    tumblr_1.tumblr,
    github_1.github,
    gitlab_1.gitlab,
    bitbucket_1.bitbucket,
    amazon_1.amazon,
    shopify_1.shopify,
    onlyfans_1.onlyfans,
    substack_1.substack,
    kofi_1.kofi,
    shopmy_1.shopmy,
    email_1.email,
    phone_1.phone,
].map(mod => [mod.id, mod]));
