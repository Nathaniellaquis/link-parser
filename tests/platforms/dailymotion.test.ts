import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Dailymotion;
const mod = registry.get(id)!;

describe('Dailymotion platform tests', () => {
  const samples = {
    video: 'https://www.dailymotion.com/video/x7tgczq',
    videoShort: 'https://dai.ly/x7tgczq',
    profile: 'https://dailymotion.com/user123',
  };

  const invalid = ['https://dailymotion.com/video/', 'https://example.com/video/x7tgczq'];

  describe('detection', () => {


    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {


      expect(mod.detect(url)).toBe(true);


    });


  });

  test('detect negatives', () => {
    invalid.forEach((u) => expect(mod.detect(u)).toBe(false));
  });

  test('parse video', () => {
    const r = parse(samples.videoShort);
    expect(r.ids.videoId).toBe('x7tgczq');
    expect(r.metadata.isVideo).toBe(true);
  });

  test('parse profile', () => {
    const r = parse(samples.profile);
    expect(r.username).toBe('user123');
    expect(r.metadata.isProfile).toBe(true);
  });

  test('builder', () => {
    const url = mod.buildProfileUrl('channel');
    expect(url).toBe('https://www.dailymotion.com/channel');
  });
});
