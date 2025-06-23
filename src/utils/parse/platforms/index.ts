import type { PlatformModule } from '../core/types'

// Import individual platform modules
import { instagram } from './instagram'
import { youtube } from './youtube'
import { tiktok } from './tiktok'
import { twitter } from './twitter'
import { facebook } from './facebook'
import { spotify } from './spotify'
import { snapchat } from './snapchat'
import { linkedin } from './linkedin'
import { pinterest } from './pinterest'
import { telegram } from './telegram'
import { discord } from './discord'
import { reddit } from './reddit'
import { twitch } from './twitch'
import { patreon } from './patreon'
import { soundcloud } from './soundcloud'
import { threads } from './threads'
import { bluesky } from './bluesky'
import { mastodon } from './mastodon'
import { tumblr } from './tumblr'
import { github } from './github'
import { gitlab } from './gitlab'
import { bitbucket } from './bitbucket'
import { amazon } from './amazon'
import { shopify } from './shopify'
import { onlyfans } from './onlyfans'
import { substack } from './substack'
import { kofi } from './kofi'

export const registry: Map<string, PlatformModule> = new Map(
  [
    instagram,
    youtube,
    tiktok,
    twitter,
    facebook,
    spotify,
    snapchat,
    linkedin,
    pinterest,
    telegram,
    discord,
    reddit,
    twitch,
    patreon,
    soundcloud,
    threads,
    bluesky,
    mastodon,
    tumblr,
    github,
    gitlab,
    bitbucket,
    amazon,
    shopify,
    onlyfans,
    substack,
    kofi,
  ].map(mod => [mod.id, mod]))

export {
  instagram,
  youtube,
  tiktok,
  twitter,
  facebook,
  spotify,
  snapchat,
  linkedin,
  pinterest,
  telegram,
  discord,
  reddit,
  twitch,
  patreon,
  soundcloud,
  threads,
  bluesky,
  mastodon,
  tumblr,
  github,
  gitlab,
  bitbucket,
  amazon,
  shopify,
  onlyfans,
  substack,
  kofi,
}