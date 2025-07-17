import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.PeerTube;
const mod = registry.get(id)!;

describe('PeerTube platform tests', () => {
  const samples = {
    profile: 'https://peertube.social/a/coolcreator',
    profileChannel: 'https://peertube.social/video-channels/mychannel',
    video: 'https://peertube.social/videos/watch/9db9f3f1-9b54-44ed-9e91-461d262d2205',
  };

  describe('detect', () => {
    Object.values(samples).forEach((url) => {
      test(url, () => {
        expect(mod.detect(url)).toBe(true);
      });
    });
  });

  describe('parse', () => {
    test('profile a', () => {
      const r = parse(samples.profile);
      expect(r.username).toBe('coolcreator');
      expect(r.metadata.isProfile).toBe(true);
    });

    test('profile channel', () => {
      const r = parse(samples.profileChannel);
      expect(r.username).toBe('mychannel');
      expect(r.metadata.isProfile).toBe(true);
    });

    test('video', () => {
      const r = parse(samples.video);
      expect(r.ids.videoId).toBe('9db9f3f1-9b54-44ed-9e91-461d262d2205');
      expect(r.metadata.isVideo).toBe(true);
    });
  });

  describe('builders', () => {
    test('profile builder', () => {
      expect(mod.buildProfileUrl?.('john')).toBe('https://peertube.social/a/john');
    });
    test('video builder', () => {
      expect(mod.buildContentUrl?.('video', 'abcd1234')).toBe(
        'https://peertube.social/videos/watch/abcd1234',
      );
    });
  });
});
