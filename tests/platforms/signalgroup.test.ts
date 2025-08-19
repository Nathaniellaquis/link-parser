import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const mod = registry.get(Platforms.SignalGroup)!;

describe('Signal invite group', () => {
  const good = 'https://signal.group/#CjQKICBq1gSxISEQ9pm2aQ';
  const httpUrl = 'http://signal.group/#CjQKICBq1gSxISEQ9pm2aQ';
  const noFragment = 'https://test.group/CjQKICBq1gSxISEQ9pm2aQ';

  test('detect', () => {
    expect(mod.detect(good)).toBe(true);
    expect(mod.detect(httpUrl)).toBe(true);
    expect(mod.detect(noFragment)).toBe(false);
  });

  test('parse invite code', () => {
    const r = parse(good);
    expect(r.ids.groupCode).toBe('CjQKICBq1gSxISEQ9pm2aQ');
  });
});
