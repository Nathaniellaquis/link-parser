import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.Vimeo;
const mod = registry.get(id)!;

describe('Vimeo platform tests', () => {
  const samples = {
    profileUser: 'https://vimeo.com/user12345678',
    profileName: 'https://vimeo.com/sampleuser',
    video: 'https://vimeo.com/123456789',
    channel: 'https://vimeo.com/channels/staffpicks',
  };

  test('detect valid URLs', () => {
    Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
  });

  test('parse video', () => {
    const r = parse(samples.video);
    expect(r.isValid).toBe(true);
    expect(r.ids.videoId).toBe('123456789');
    expect(r.metadata.isVideo).toBe(true);
  });

  test('parse channel', () => {
    const r = parse(samples.channel);
    expect(r.isValid).toBe(true);
    expect(r.username).toBe('staffpicks');
    expect(r.metadata.isChannel).toBe(true);
  });

  test('parse profile user', () => {
    const r = parse(samples.profileUser);
    expect(r.isValid).toBe(true);
    expect(r.username).toBe('user12345678');
    expect(r.metadata.isProfile).toBe(true);
  });

  test('builder', () => {
    const url = mod.buildProfileUrl('myname');
    expect(url).toBe('https://vimeo.com/myname');
    expect(mod.detect(url)).toBe(true);
  });
});
