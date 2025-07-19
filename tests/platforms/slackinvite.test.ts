import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.SlackInvite)!;

describe('Slack invite', () => {
  const url = 'https://join.slack.com/t/myworkspace/shared_invite/zt-123abc456~abc';
  test('detect', () => {
    expect(mod.detect(url)).toBe(true);
  });
  test('parse', () => {
    const r = parse(url);
    expect(r.ids.workspace).toBe('myworkspace');
  });
});
