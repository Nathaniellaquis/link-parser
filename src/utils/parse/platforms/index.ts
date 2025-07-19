import { PlatformModule, Platforms } from '../core/types';
import { patchAllPlatforms } from '../utils/patch-patterns';

// Import all platform modules
import { amazon } from './amazon';
import { bitbucket } from './bitbucket';
import { bluesky } from './bluesky';
import { discord } from './discord';
import { email } from './email';
import { facebook } from './facebook';
import { github } from './github';
import { gitlab } from './gitlab';
import { instagram } from './instagram';
import { kofi } from './kofi';
import { linkedin } from './linkedin';
import { onlyfans } from './onlyfans';
import { patreon } from './patreon';
import { phone } from './phone';
import { pinterest } from './pinterest';
import { reddit } from './reddit';
import { shopify } from './shopify';
import { shopmy } from './shopmy';
import { snapchat } from './snapchat';
import { soundcloud } from './soundcloud';
import { spotify } from './spotify';
import { substack } from './substack';
import { telegram } from './telegram';
import { threads } from './threads';
import { tiktok } from './tiktok';
import { tumblr } from './tumblr';
import { twitch } from './twitch';
import { twitter } from './twitter';
import { youtube } from './youtube';
import { venmo } from './venmo';
import { cashapp } from './cashapp';
import { paypal } from './paypal';
import { vimeo } from './vimeo';
import { cameo } from './cameo';
import { applemusic } from './applemusic';
import { deezer } from './deezer';
import { tidal } from './tidal';
import { bandcamp } from './bandcamp';
import { mixcloud } from './mixcloud';
import { audiomack } from './audiomack';
import { dailymotion } from './dailymotion';
import { rumble } from './rumble';
import { pandora } from './pandora';
import { triller } from './triller';
import { bereal } from './bereal';
import { vsco } from './vsco';
import { dispo } from './dispo';
import { clubhouse } from './clubhouse';
import { poshmark } from './poshmark';
import { liketoknowit } from './liketoknowit';
import { revolve } from './revolve';
import { opensea } from './opensea';
import { imdb } from './imdb';
import { ticketmaster } from './ticketmaster';
import { bandsintown } from './bandsintown';
import { stereo } from './stereo';
import { fanfix } from './fanfix';
import { slushy } from './slushy';
import { gofundme } from './gofundme';
import { calendly } from './calendly';
import { mediakits } from './mediakits';
import { matterport } from './matterport';
import { whatsapp } from './whatsapp';
import { vk } from './vk';
import { medium } from './medium';
import { devto } from './devto';
import { stackoverflow } from './stackoverflow';
import { quora } from './quora';
import { kick } from './kick';
import { bilibili } from './bilibili';
import { bitchute } from './bitchute';
import { peertube } from './peertube';
import { dribbble } from './dribbble';
import { behance } from './behance';
import { artstation } from './artstation';
import { flickr } from './flickr';
import { audius } from './audius';
import { beatport } from './beatport';
import { bandlab } from './bandlab';
import { etsy } from './etsy';
import { ebay } from './ebay';
import { aliexpress } from './aliexpress';
import { stockx } from './stockx';
import { grailed } from './grailed';
import { wish } from './wish';
import { buymeacoffee } from './buymeacoffee';
import { stripelink } from './stripelink';
import { squarecheckout } from './squarecheckout';
import { coinbasecommerce } from './coinbasecommerce';
import { rarible } from './rarible';
import { etherscan } from './etherscan';
import { looksrare } from './looksrare';
import { slackinvite } from './slackinvite';
import { signalgroup } from './signalgroup';
import { microsoftteams } from './microsoftteams';
import { hoobe } from './hoobe';

// Create registry
export const registry = new Map<Platforms, PlatformModule>([
  [Platforms.Amazon, amazon],
  [Platforms.Bitbucket, bitbucket],
  [Platforms.Bluesky, bluesky],
  [Platforms.Discord, discord],
  [Platforms.Email, email],
  [Platforms.Facebook, facebook],
  [Platforms.GitHub, github],
  [Platforms.GitLab, gitlab],
  [Platforms.Instagram, instagram],
  [Platforms.KoFi, kofi],
  [Platforms.LinkedIn, linkedin],
  [Platforms.OnlyFans, onlyfans],
  [Platforms.Patreon, patreon],
  [Platforms.Phone, phone],
  [Platforms.Pinterest, pinterest],
  [Platforms.Reddit, reddit],
  [Platforms.Shopify, shopify],
  [Platforms.ShopMy, shopmy],
  [Platforms.Snapchat, snapchat],
  [Platforms.SoundCloud, soundcloud],
  [Platforms.Spotify, spotify],
  [Platforms.Substack, substack],
  [Platforms.Telegram, telegram],
  [Platforms.Venmo, venmo],
  [Platforms.CashApp, cashapp],
  [Platforms.PayPal, paypal],
  [Platforms.Vimeo, vimeo],
  [Platforms.Cameo, cameo],
  [Platforms.AppleMusic, applemusic],
  [Platforms.Deezer, deezer],
  [Platforms.Pandora, pandora],
  [Platforms.Tidal, tidal],
  [Platforms.Bandcamp, bandcamp],
  [Platforms.Mixcloud, mixcloud],
  [Platforms.Audiomack, audiomack],
  [Platforms.Dailymotion, dailymotion],
  [Platforms.Threads, threads],
  [Platforms.TikTok, tiktok],
  [Platforms.Tumblr, tumblr],
  [Platforms.Twitch, twitch],
  [Platforms.Twitter, twitter],
  [Platforms.YouTube, youtube],
  [Platforms.Rumble, rumble],
  [Platforms.Triller, triller],
  [Platforms.BeReal, bereal],
  [Platforms.VSCO, vsco],
  [Platforms.Dispo, dispo],
  [Platforms.Clubhouse, clubhouse],
  [Platforms.Poshmark, poshmark],
  [Platforms.LikeToKnowIt, liketoknowit],
  [Platforms.Revolve, revolve],
  [Platforms.OpenSea, opensea],
  [Platforms.IMDb, imdb],
  [Platforms.Ticketmaster, ticketmaster],
  [Platforms.BandsInTown, bandsintown],
  [Platforms.Stereo, stereo],
  [Platforms.Fanfix, fanfix],
  [Platforms.Slushy, slushy],
  [Platforms.GoFundMe, gofundme],
  [Platforms.Calendly, calendly],
  [Platforms.MediaKits, mediakits],
  [Platforms.Matterport, matterport],
  [Platforms.WhatsApp, whatsapp],
  [Platforms.VKontakte, vk],
  [Platforms.Medium, medium],
  [Platforms.DevTo, devto],
  [Platforms.StackOverflow, stackoverflow],
  [Platforms.Quora, quora],
  [Platforms.PeerTube, peertube],
  [Platforms.Dribbble, dribbble],
  [Platforms.Behance, behance],
  [Platforms.ArtStation, artstation],
  [Platforms.Flickr, flickr],
  [Platforms.Audius, audius],
  [Platforms.Beatport, beatport],
  [Platforms.BandLab, bandlab],
  [Platforms.Etsy, etsy],
  [Platforms.EBay, ebay],
  [Platforms.AliExpress, aliexpress],
  [Platforms.StockX, stockx],
  [Platforms.Grailed, grailed],
  [Platforms.Wish, wish],
  [Platforms.BuyMeACoffee, buymeacoffee],
  [Platforms.StripeLink, stripelink],
  [Platforms.SquareCheckout, squarecheckout],
  [Platforms.CoinbaseCommerce, coinbasecommerce],
  [Platforms.Rarible, rarible],
  [Platforms.Etherscan, etherscan],
  [Platforms.LooksRare, looksrare],
  [Platforms.SlackInvite, slackinvite],
  [Platforms.SignalGroup, signalgroup],
  [Platforms.MicrosoftTeams, microsoftteams],
  [Platforms.HooBe, hoobe],
  [Platforms.Kick, kick],
  [Platforms.BiliBili, bilibili],
  [Platforms.BitChute, bitchute],
]);

// After the registry is built, patch patterns to support optional query/hash universally
patchAllPlatforms(registry);
