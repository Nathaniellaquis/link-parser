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
}