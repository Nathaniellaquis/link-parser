import { PlatformModule, Platforms, ParsedUrl } from '../../core/types';
import { normalize } from '../../utils/url';
import { createDomainPattern } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

// Define the config values first
const domains = ['audiomack.com'];
const subdomains: string[] = [];

// Create the domain pattern using the config values
const DOMAIN_PATTERN = createDomainPattern(domains, subdomains);

export const audiomack: PlatformModule = {
  id: Platforms.Audiomack,
  name: 'Audiomack',
  color: '#ff8800',

  domains: domains,
  subdomains: subdomains,

  patterns: {
    profile: new RegExp(`^https?://${DOMAIN_PATTERN}/([a-z0-9_-]{3,30})/?${QUERY_HASH}$`, 'i'),
    handle: /^[a-z0-9_-]{3,30}$/i,
    content: {
      song: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-z0-9_-]{3,30})/song/([a-z0-9_-]{3,120})/?${QUERY_HASH}$`,
        'i',
      ),
      album: new RegExp(
        `^https?://${DOMAIN_PATTERN}/([a-z0-9_-]{3,30})/album/([a-z0-9_-]{3,120})/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    if (!this.domains.some((domain) => url.includes(domain))) return false;
    return (
      this.patterns.profile.test(url) ||
      !!this.patterns.content?.song?.test(url) ||
      !!this.patterns.content?.album?.test(url)
    );
  },

  extract(url: string, res: ParsedUrl): void {
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      res.username = prof[1];
      res.metadata.isProfile = true;
      res.metadata.contentType = 'artist';
      return;
    }

    const song = this.patterns.content?.song?.exec(url);
    if (song) {
      res.username = song[1];
      res.ids.trackSlug = song[2];
      res.metadata.isSingle = true;
      res.metadata.contentType = 'track';
      return;
    }

    const album = this.patterns.content?.album?.exec(url);
    if (album) {
      res.username = album[1];
      res.ids.albumSlug = album[2];
      res.metadata.isAlbum = true;
      res.metadata.contentType = 'album';
    }
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(handle: string): string {
    return `https://audiomack.com/${handle}`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
