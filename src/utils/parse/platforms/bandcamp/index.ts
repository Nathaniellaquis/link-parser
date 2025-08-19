import { PlatformModule, Platforms, ExtractedData } from '../../core/types';
import { normalize } from '../../utils/url';
import { QUERY_HASH } from '../../utils/constants';

export const bandcamp: PlatformModule = {
  id: Platforms.Bandcamp,
  name: 'Bandcamp',
  color: '#629aa9',

  // bandcamp uses subdomains per artist
  domains: ['bandcamp.com'],
  domainsRegexp: new RegExp(`^(?:https?://)?(?:www\\.)?(?:[a-z0-9-]+\\.)*bandcamp\\.com(/|$)`, 'i'),

  patterns: {
    profile: new RegExp(
      `^https?://(?:www\\.)?([a-z0-9-]{2,60})\\.bandcamp\\.com/?${QUERY_HASH}$`,
      'i',
    ),
    handle: /^[a-z0-9-]{2,60}$/i,
    content: {
      album: new RegExp(
        `^https?://(?:www\\.)?([a-z0-9-]{2,60})\\.bandcamp\\.com/album/([a-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
      track: new RegExp(
        `^https?://(?:www\\.)?([a-z0-9-]{2,60})\\.bandcamp\\.com/track/([a-z0-9-]+)/?${QUERY_HASH}$`,
        'i',
      ),
    },
  },

  detect(url: string): boolean {
    // const urlLower = url.toLowerCase();
    // return urlLower.includes('.bandcamp.com');
    return this.domainsRegexp!.test(url);
  },

  extract(url: string): ExtractedData | null {
    const prof = this.patterns.profile.exec(url);
    if (prof) {
      return {
        username: prof[1],
        metadata: {
          isProfile: true,
          isArtist: true,
          contentType: 'artist',
        },
      };
    }

    const alb = this.patterns.content?.album?.exec(url);
    if (alb) {
      const artist = alb[1];
      const slug = alb[2];
      return {
        username: artist,
        ids: { albumSlug: slug },
        metadata: {
          isAlbum: true,
          contentType: 'album',
        },
      };
    }

    const tr = this.patterns.content?.track?.exec(url);
    if (tr) {
      return {
        username: tr[1],
        ids: { trackSlug: tr[2] },
        metadata: {
          isTrack: true,
          isSingle: true,
          contentType: 'track',
        },
      };
    }
    return null;
  },

  validateHandle(handle: string): boolean {
    return this.patterns.handle.test(handle);
  },

  buildProfileUrl(handle: string): string {
    return `https://${handle}.bandcamp.com`;
  },

  normalizeUrl(url: string): string {
    return normalize(url);
  },
};
