import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['deezer.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

const LOCALE = '(?:[a-z]{2}(?:-[a-z]{2})?)';

export const deezer: PlatformModule = {
  id: Platforms.Deezer,
  name: 'Deezer',
  color: '#EF5466',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(
      `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?artist/(\\d+)/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^\d+$/, // artist id numeric
    content: {
      album: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?album/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      track: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?track/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
      playlist: new RegExp(
        `^https?://${DOMAIN_PATTERN}/(?:${LOCALE}/)?playlist/(\\d+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.album?.test(url) ||
      !!this.patterns.content?.track?.test(url) ||
      !!this.patterns.content?.playlist?.test(url)
    );
  },

  extract(url: string, res: ParsedUrl): void {
    const artist = this.patterns.profile.exec(url);
    if (artist) {
      res.ids.artistId = artist[1];
      res.metadata.contentType = 'artist';
      res.metadata.isProfile = true;
      return;
    }
    const alb = this.patterns.content?.album?.exec(url);
    if (alb) {
      res.ids.albumId = alb[1];
      res.metadata.contentType = 'album';
      res.metadata.isAlbum = true;
      return;
    }
    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      res.ids.trackId = tr[1];
      res.metadata.contentType = 'track';
      res.metadata.isSingle = true;
      return;
    }
    const pl = this.patterns.content?.playlist?.exec(url);
    if (pl) {
      res.ids.playlistId = pl[1];
      res.metadata.contentType = 'playlist';
      res.metadata.isPlaylist = true;
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(artistId: string): string {
    return `https://deezer.com/artist/${artistId}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
