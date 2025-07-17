import { parse } from '../../src/utils/parse';
import { registry } from '../../src/utils/parse/platforms';
import { Platforms } from '../../src/utils/parse/core/types';

const id = Platforms.IMDb;
const mod = registry.get(id)!;

describe('IMDb platform tests', () => {
  const samples = {
    person: 'https://imdb.com/name/nm1234567',
    title: 'https://imdb.com/title/tt7654321',
    company: 'https://imdb.com/company/co2345678',
  };

  test('detect', () => {
    Object.values(samples).forEach((u) => expect(mod.detect(u)).toBe(true));
  });

  test('parse person', () => {
    const r = parse(samples.person);
    expect(r.userId).toBe('nm1234567');
    expect(r.metadata.isPerson).toBe(true);
  });

  test('parse title', () => {
    const r = parse(samples.title);
    expect(r.ids.titleId).toBe('tt7654321');
    expect(r.metadata.isTitle).toBe(true);
  });

  test('parse company', () => {
    const r = parse(samples.company);
    expect(r.ids.companyId).toBe('co2345678');
    expect(r.metadata.isCompany).toBe(true);
  });
});
