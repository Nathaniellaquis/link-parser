import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.LikeToKnowIt;
const mod = registry.get(id)!;

describe('LikeToKnowIt tests', () => {
  const samples = {
    profile: 'https://liketoknow.it/stylishgal',
    post: 'https://liketoknow.it/p/ABCD123',
  };
  test('detect', () => {
    Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
  });
  test('parse profile', () => {
    const r = parse(samples.profile);
    expect(r.isValid).toBe(true);
    expect(r.username).toBe('stylishgal');
  });
  test('parse post', () => {
    const r = parse(samples.post);
    expect(r.ids.postId).toBe('ABCD123');
    expect(r.metadata.isPost).toBe(true);
  });
});
