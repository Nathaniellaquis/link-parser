import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.GoFundMe;
const mod = registry.get(id)!;

describe('GoFundMe tests', () => {
  const samples = {
    campaign: 'https://gofundme.com/f/help-my-dog',
    user: 'https://gofundme.com/u/johndoe',
  };
  describe('detection', () => {

    test.each(Object.entries(samples))('should detect %s URL: %s', (_, url) => {

      expect(mod.detect(url)).toBe(true);

    });

  });
  test('campaign', () => {
    const r = parse(samples.campaign);
    expect(r.ids.campaignSlug).toBe('help-my-dog');
    expect(r.metadata.isCampaign).toBe(true);
  });
  test('user', () => {
    const r = parse(samples.user);
    expect(r.username).toBe('johndoe');
    expect(r.metadata.isUser).toBe(true);
  });
});
